import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './types';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockExecutionContext = () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer test-token',
          },
        }),
      }),
    } as unknown as ExecutionContext;
    return mockContext;
  };

  const mockExecutionContextWithoutToken = () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;
    return mockContext;
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid token', async () => {
      const payload: JwtPayload = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer test-token',
        },
      };
      const mockContext = mockExecutionContext();

      jwtService.verifyAsync = jest.fn().mockResolvedValue(payload);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('test-token', {
        secret: 'test-secret',
      });
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      const mockContext = mockExecutionContextWithoutToken();

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      const mockContext = mockExecutionContext();

      jwtService.verifyAsync = jest
        .fn()
        .mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('test-token', {
        secret: 'test-secret',
      });
    });

    it('should throw UnauthorizedException when JWT_SECRET is not defined', async () => {
      delete process.env.JWT_SECRET;
      const mockContext = mockExecutionContext();

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from authorization header', () => {
      const request = {
        headers: {
          authorization: 'Bearer test-token',
        },
      };

      const token = guard['extractTokenFromHeader'](request as any);
      expect(token).toBe('test-token');
    });

    it('should return undefined if no authorization header', () => {
      const request = { headers: {} };

      const token = guard['extractTokenFromHeader'](request as any);
      expect(token).toBeUndefined();
    });

    it('should return undefined if authorization header does not contain Bearer token', () => {
      const request = {
        headers: {
          authorization: 'Basic test-token',
        },
      };

      const token = guard['extractTokenFromHeader'](request as any);
      expect(token).toBeUndefined();
    });
  });
});

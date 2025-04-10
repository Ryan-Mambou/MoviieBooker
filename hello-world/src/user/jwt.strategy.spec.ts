import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './user.service';
import { JwtPayload } from '../guards/types';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user payload', () => {
      const payload: JwtPayload = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        id: payload.id,
        email: payload.email,
        username: payload.username,
      });
    });
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        new JwtStrategy(userService);
      }).toThrow('JWT_SECRET is not defined');
    });
  });
});

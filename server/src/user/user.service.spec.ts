import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';

      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue({
        id: 1,
        ...registerDto,
        password: hashedPassword,
      });

      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue(hashedPassword);

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          password: hashedPassword,
        },
      });
      expect(result).toEqual({
        id: 1,
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        ...registerDto,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        username: 'testuser',
        email: loginDto.email,
        password: 'hashedPassword',
      };

      const token = 'jwt-token';

      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      jwtService.sign = jest.fn().mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      );
      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        username: 'testuser',
        email: loginDto.email,
        password: 'hashedPassword',
      };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});

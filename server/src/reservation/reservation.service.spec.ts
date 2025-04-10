import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dtos/reservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createReservation', () => {
    it('should create a reservation if no previous reservation exists', async () => {
      const reservationDto: ReservationDto = {
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      const createdReservation = {
        id: 1,
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      prismaService.reservation.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.reservation.create = jest
        .fn()
        .mockResolvedValue(createdReservation);

      const result = await service.createReservation(reservationDto);

      expect(prismaService.reservation.findFirst).toHaveBeenCalledWith({
        orderBy: {
          reservationDate: 'desc',
        },
      });
      expect(prismaService.reservation.create).toHaveBeenCalledWith({
        data: reservationDto,
      });
      expect(result).toEqual(createdReservation);
    });

    it('should create a reservation if previous reservation is older than 2 hours', async () => {
      const reservationDto: ReservationDto = {
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      const oldDate = new Date();
      oldDate.setHours(oldDate.getHours() - 3);

      const oldReservation = {
        id: 1,
        movieName: 'Old Movie',
        userId: 1,
        reservationDate: oldDate,
      };

      const createdReservation = {
        id: 2,
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      prismaService.reservation.findFirst = jest
        .fn()
        .mockResolvedValue(oldReservation);
      prismaService.reservation.create = jest
        .fn()
        .mockResolvedValue(createdReservation);

      jest.spyOn(Date.prototype, 'getTime').mockImplementation(function (
        this: Date,
      ) {
        if (this === oldDate) {
          return oldDate.valueOf();
        }
        return new Date().valueOf();
      });

      const result = await service.createReservation(reservationDto);

      expect(prismaService.reservation.findFirst).toHaveBeenCalledWith({
        orderBy: {
          reservationDate: 'desc',
        },
      });
      expect(prismaService.reservation.create).toHaveBeenCalledWith({
        data: reservationDto,
      });
      expect(result).toEqual(createdReservation);
    });

    it('should throw BadRequestException if previous reservation is less than 2 hours old', async () => {
      const reservationDto: ReservationDto = {
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      const recentDate = new Date();
      recentDate.setMinutes(recentDate.getMinutes() - 30);

      const recentReservation = {
        id: 1,
        movieName: 'Recent Movie',
        userId: 1,
        reservationDate: recentDate,
      };

      prismaService.reservation.findFirst = jest
        .fn()
        .mockResolvedValue(recentReservation);

      await expect(service.createReservation(reservationDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.reservation.findFirst).toHaveBeenCalledWith({
        orderBy: {
          reservationDate: 'desc',
        },
      });
    });
  });

  describe('getAllReservationsByUser', () => {
    it('should return all reservations for a user', async () => {
      const userId = '1';
      const userReservations = [
        {
          id: 1,
          movieName: 'Movie 1',
          userId: 1,
          reservationDate: new Date(),
        },
        {
          id: 2,
          movieName: 'Movie 2',
          userId: 1,
          reservationDate: new Date(),
        },
      ];

      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });

      prismaService.reservation.findMany = jest
        .fn()
        .mockResolvedValue(userReservations);

      const result = await service.getAllReservationsByUser(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(userId) },
      });
      expect(prismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: parseInt(userId) },
      });
      expect(result).toEqual(userReservations);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '999';

      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.getAllReservationsByUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(userId) },
      });
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation', async () => {
      const reservationId = '1';
      const reservation = {
        id: 1,
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      prismaService.reservation.findUnique = jest
        .fn()
        .mockResolvedValue(reservation);
      prismaService.reservation.delete = jest
        .fn()
        .mockResolvedValue(reservation);

      const result = await service.deleteReservation(reservationId);

      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(reservationId) },
      });
      expect(prismaService.reservation.delete).toHaveBeenCalledWith({
        where: { id: parseInt(reservationId) },
      });
      expect(result).toEqual(reservation);
    });

    it('should throw NotFoundException if reservation does not exist', async () => {
      const reservationId = '999';

      prismaService.reservation.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.deleteReservation(reservationId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: parseInt(reservationId) },
      });
    });
  });
});

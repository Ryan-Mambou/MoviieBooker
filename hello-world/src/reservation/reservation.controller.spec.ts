import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dtos/reservation.dto';

jest.mock('../guards/jwt-auth.guard', () => {
  return {
    JwtAuthGuard: jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    })),
  };
});

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            createReservation: jest.fn(),
            getAllReservationsByUser: jest.fn(),
            deleteReservation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      const dto: ReservationDto = {
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      const result = {
        id: 1,
        ...dto,
      };

      jest.spyOn(service, 'createReservation').mockResolvedValue(result);

      expect(await controller.createReservation(dto)).toBe(result);
      expect(service.createReservation).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllReservationsByUser', () => {
    it('should get all reservations for a user', async () => {
      const userId = '1';
      const result = [
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

      jest.spyOn(service, 'getAllReservationsByUser').mockResolvedValue(result);

      expect(await controller.getAllReservationsByUser(userId)).toBe(result);
      expect(service.getAllReservationsByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation', async () => {
      const id = '1';
      const result = {
        id: 1,
        movieName: 'Test Movie',
        userId: 1,
        reservationDate: new Date(),
      };

      jest.spyOn(service, 'deleteReservation').mockResolvedValue(result);

      expect(await controller.deleteReservation(id)).toBe(result);
      expect(service.deleteReservation).toHaveBeenCalledWith(id);
    });
  });
});

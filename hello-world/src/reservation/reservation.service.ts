import { Injectable, BadRequestException } from '@nestjs/common';
import { ReservationDto } from './dtos/reservation.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async createReservation(reservationDto: ReservationDto) {
    const latestReservation = await this.prisma.reservation.findFirst({
      orderBy: {
        reservationDate: 'desc',
      },
    });

    if (!latestReservation) {
      return this.prisma.reservation.create({
        data: reservationDto,
      });
    }

    const currentTime = new Date().getTime();

    if (
      currentTime - latestReservation.reservationDate.getTime() >
      2 * 60 * 60 * 1000
    ) {
      return this.prisma.reservation.create({
        data: reservationDto,
      });
    }

    throw new BadRequestException(
      'Reservation is not possible, Time frame taken',
    );
  }
}

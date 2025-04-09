import { Controller, Post, Body } from '@nestjs/common';
import { ReservationDto } from './dtos/reservation.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Create a reservation' })
  @Post()
  createReservation(@Body() reservationDto: ReservationDto) {
    return this.reservationService.createReservation(reservationDto);
  }
}

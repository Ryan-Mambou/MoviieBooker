import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get all reservations' })
  @Get('/:userId')
  getAllReservationsByUser(@Param('userId') userId: string) {
    return this.reservationService.getAllReservationsByUser(userId);
  }

  @ApiOperation({ summary: 'Delete Operations' })
  @Delete('/:id')
  deleteReservation(@Param('id') id: string) {
    return this.reservationService.deleteReservation(id);
  }
}

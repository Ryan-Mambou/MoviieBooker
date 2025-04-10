import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReservationDto } from './dtos/reservation.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Create a movie reservation' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createReservation(@Body() reservationDto: ReservationDto) {
    return this.reservationService.createReservation(reservationDto);
  }

  @ApiOperation({ summary: 'Get all movie reservations by a user' })
  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getAllReservationsByUser(@Param('userId') userId: string) {
    return this.reservationService.getAllReservationsByUser(userId);
  }

  @ApiOperation({ summary: 'Delete a movie reservation' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteReservation(@Param('id') id: string) {
    return this.reservationService.deleteReservation(id);
  }
}

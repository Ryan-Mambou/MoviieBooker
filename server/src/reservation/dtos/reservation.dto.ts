import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  @ApiProperty({
    description: 'The name of the movie',
    example: 'Gladiator II',
  })
  @IsNotEmpty()
  @IsString()
  movieName: string;

  @ApiProperty({
    description: 'The user id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'The reservation date',
  })
  @IsOptional()
  @IsDate()
  reservationDate: Date;
}

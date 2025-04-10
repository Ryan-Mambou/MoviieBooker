import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MoviesModule } from './movies/movies.module';
import { ReservationModule } from './reservation/reservation.module';
@Module({
  imports: [UserModule, MoviesModule, ReservationModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService, JwtService],
})
export class AppModule {}

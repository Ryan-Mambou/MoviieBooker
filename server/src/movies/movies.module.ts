import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { HttpModule } from '@nestjs/axios';
import { MoviesController } from './movies.controller';

@Module({
  imports: [HttpModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}

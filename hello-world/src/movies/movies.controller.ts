import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { MovieResponse } from './types';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'All movies' })
  getMovies(
    @Query('page') page: number,
    @Query('sort_by') sortBy: string,
  ): Observable<MovieResponse> {
    return this.moviesService.getMovies(page, sortBy);
  }
}

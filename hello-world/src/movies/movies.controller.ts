import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Genre, Movie, MovieResponse } from './types';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Movies')
@Controller('/')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/movies')
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'All movies' })
  getMovies(
    @Query('page') page: number,
    @Query('sort_by') sortBy: string,
  ): Observable<MovieResponse> {
    return this.moviesService.getMovies(page, sortBy);
  }

  @Get('movie/now_playing')
  @ApiOperation({ summary: 'Get movies playing now' })
  @ApiResponse({ status: 200, description: 'Movies playing now' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getNowPlayingMovies(): Observable<MovieResponse> {
    return this.moviesService.getNowPlayingMovies();
  }

  @Get('/search/movie')
  @ApiOperation({ summary: 'Search for a movie' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  searchMovie(@Query('query') movieName: string): Observable<MovieResponse> {
    return this.moviesService.searchMovie(movieName);
  }

  @Get('/movie/:movie_id')
  @ApiOperation({ summary: 'Get a movie by id' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMovieById(@Param('movie_id') movieId: string): Observable<Movie> {
    return this.moviesService.getMovieById(movieId);
  }

  @Get('/genre/movie/list')
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'All genres' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getGenres(): Observable<Genre[]> {
    return this.moviesService.getGenres();
  }
}

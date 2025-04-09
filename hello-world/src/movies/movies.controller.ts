import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Genre, Movie, MovieResponse } from './types';

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
  getNowPlayingMovies(): Observable<MovieResponse> {
    return this.moviesService.getNowPlayingMovies();
  }

  @Get('/search/movie')
  @ApiOperation({ summary: 'Search for a movie' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  searchMovie(@Query('query') movieName: string): Observable<MovieResponse> {
    return this.moviesService.searchMovie(movieName);
  }

  @Get('/movie/:movie_id')
  @ApiOperation({ summary: 'Get a movie by id' })
  @ApiResponse({ status: 200, description: 'Movie found' })
  getMovieById(@Param('movie_id') movieId: string): Observable<Movie> {
    return this.moviesService.getMovieById(movieId);
  }

  @Get('/genre/movie/list')
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'All genres' })
  getGenres(): Observable<Genre[]> {
    return this.moviesService.getGenres();
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Genre, Movie, MovieResponse } from './types';

@Injectable()
export class MoviesService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  constructor(private readonly httpService: HttpService) {}

  getMovies(page: number, sortBy: string): Observable<MovieResponse> {
    return this.httpService
      .get<MovieResponse>(`${this.baseUrl}/discover/movie`, {
        headers: {
          Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
        },
        params: {
          page,
          sort_by: sortBy,
        },
      })
      .pipe(map((response: AxiosResponse<MovieResponse>) => response.data));
  }

  getNowPlayingMovies(): Observable<MovieResponse> {
    return this.httpService
      .get<MovieResponse>(`${this.baseUrl}/movie/now_playing`, {
        headers: {
          Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
        },
      })
      .pipe(map((response: AxiosResponse<MovieResponse>) => response.data));
  }

  searchMovie(movieName: string): Observable<MovieResponse> {
    return this.httpService
      .get<MovieResponse>(`${this.baseUrl}/search/movie`, {
        headers: {
          Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
        },
        params: {
          query: movieName,
        },
      })
      .pipe(map((response: AxiosResponse<MovieResponse>) => response.data));
  }

  getMovieById(movieId: string): Observable<Movie> {
    return this.httpService
      .get<Movie>(`${this.baseUrl}/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
        },
      })
      .pipe(map((response: AxiosResponse<Movie>) => response.data));
  }

  getGenres(): Observable<Genre[]> {
    return this.httpService
      .get<Genre[]>(`${this.baseUrl}/genre/movie/list`, {
        headers: {
          Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
        },
      })
      .pipe(map((response: AxiosResponse<Genre[]>) => response.data));
  }
}

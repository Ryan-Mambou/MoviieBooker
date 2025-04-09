import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { MovieResponse } from './types';

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
}

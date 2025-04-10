import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies based on page and sort criteria', () => {
      const mockMovieResponse = {
        results: [
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ],
        page: 1,
        total_pages: 10,
        total_results: 100,
      };

      const axiosResponse: AxiosResponse = {
        data: mockMovieResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      const page = 1;
      const sortBy = 'popularity.desc';

      service.getMovies(page, sortBy).subscribe((result) => {
        expect(result).toEqual(mockMovieResponse);
        expect(httpService.get).toHaveBeenCalledWith(
          'https://api.themoviedb.org/3/discover/movie',
          {
            headers: {
              Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
            },
            params: {
              page,
              sort_by: sortBy,
            },
          },
        );
      });
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', () => {
      const mockMovieResponse = {
        results: [
          { id: 3, title: 'Now Playing Movie 1' },
          { id: 4, title: 'Now Playing Movie 2' },
        ],
        page: 1,
        total_pages: 5,
        total_results: 50,
      };

      const axiosResponse: AxiosResponse = {
        data: mockMovieResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      service.getNowPlayingMovies().subscribe((result) => {
        expect(result).toEqual(mockMovieResponse);
        expect(httpService.get).toHaveBeenCalledWith(
          'https://api.themoviedb.org/3/movie/now_playing',
          {
            headers: {
              Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
            },
          },
        );
      });
    });
  });

  describe('searchMovie', () => {
    it('should return movies matching the search query', () => {
      const mockMovieResponse = {
        results: [
          { id: 5, title: 'Search Result 1' },
          { id: 6, title: 'Search Result 2' },
        ],
        page: 1,
        total_pages: 1,
        total_results: 2,
      };

      const axiosResponse: AxiosResponse = {
        data: mockMovieResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      const searchQuery = 'test query';

      service.searchMovie(searchQuery).subscribe((result) => {
        expect(result).toEqual(mockMovieResponse);
        expect(httpService.get).toHaveBeenCalledWith(
          'https://api.themoviedb.org/3/search/movie',
          {
            headers: {
              Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
            },
            params: {
              query: searchQuery,
            },
          },
        );
      });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by its ID', () => {
      const mockMovie = {
        id: 7,
        title: 'Specific Movie',
        overview: 'Movie description',
        release_date: '2023-01-01',
      };

      const axiosResponse: AxiosResponse = {
        data: mockMovie,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      const movieId = '7';

      service.getMovieById(movieId).subscribe((result) => {
        expect(result).toEqual(mockMovie);
        expect(httpService.get).toHaveBeenCalledWith(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
            },
          },
        );
      });
    });
  });

  describe('getGenres', () => {
    it('should return movie genres', () => {
      const mockGenres = [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
      ];

      const axiosResponse: AxiosResponse = {
        data: mockGenres,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      service.getGenres().subscribe((result) => {
        expect(result).toEqual(mockGenres);
        expect(httpService.get).toHaveBeenCalledWith(
          'https://api.themoviedb.org/3/genre/movie/list',
          {
            headers: {
              Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
            },
          },
        );
      });
    });
  });
});

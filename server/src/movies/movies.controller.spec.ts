import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { of } from 'rxjs';
import { Movie, MovieResponse, Genre } from './types';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const createMockMovie = (id: number, title: string): Movie => ({
    id,
    title,
    adult: false,
    backdrop_path: `/path${id}.jpg`,
    genre_ids: [28, 12],
    original_language: 'en',
    original_title: title,
    overview: `Overview for ${title}`,
    popularity: 100.0,
    poster_path: `/poster${id}.jpg`,
    release_date: '2023-01-01',
    video: false,
    vote_average: 8.5,
    vote_count: 1000,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn(),
            getNowPlayingMovies: jest.fn(),
            searchMovie: jest.fn(),
            getMovieById: jest.fn(),
            getGenres: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies based on page and sort criteria', () => {
      const page = 1;
      const sortBy = 'popularity.desc';
      const mockResponse: MovieResponse = {
        results: [createMockMovie(1, 'Movie 1'), createMockMovie(2, 'Movie 2')],
        page: 1,
        total_pages: 10,
        total_results: 100,
      };

      jest.spyOn(service, 'getMovies').mockReturnValue(of(mockResponse));

      const result = controller.getMovies(page, sortBy);

      result.subscribe((value) => {
        expect(value).toEqual(mockResponse);
      });

      expect(service.getMovies).toHaveBeenCalledWith(page, sortBy);
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', () => {
      const mockResponse: MovieResponse = {
        results: [
          createMockMovie(3, 'Now Playing Movie 1'),
          createMockMovie(4, 'Now Playing Movie 2'),
        ],
        page: 1,
        total_pages: 5,
        total_results: 50,
      };

      jest
        .spyOn(service, 'getNowPlayingMovies')
        .mockReturnValue(of(mockResponse));

      const result = controller.getNowPlayingMovies();

      result.subscribe((value) => {
        expect(value).toEqual(mockResponse);
      });

      expect(service.getNowPlayingMovies).toHaveBeenCalled();
    });
  });

  describe('searchMovie', () => {
    it('should return movies matching the search query', () => {
      const query = 'test query';
      const mockResponse: MovieResponse = {
        results: [
          createMockMovie(5, 'Search Result 1'),
          createMockMovie(6, 'Search Result 2'),
        ],
        page: 1,
        total_pages: 1,
        total_results: 2,
      };

      jest.spyOn(service, 'searchMovie').mockReturnValue(of(mockResponse));

      const result = controller.searchMovie(query);

      result.subscribe((value) => {
        expect(value).toEqual(mockResponse);
      });

      expect(service.searchMovie).toHaveBeenCalledWith(query);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by its ID', () => {
      const movieId = '7';
      const mockMovie: Movie = createMockMovie(7, 'Specific Movie');

      jest.spyOn(service, 'getMovieById').mockReturnValue(of(mockMovie));

      const result = controller.getMovieById(movieId);

      result.subscribe((value) => {
        expect(value).toEqual(mockMovie);
      });

      expect(service.getMovieById).toHaveBeenCalledWith(movieId);
    });
  });

  describe('getGenres', () => {
    it('should return movie genres', () => {
      const mockGenres: Genre[] = [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
      ];

      jest.spyOn(service, 'getGenres').mockReturnValue(of(mockGenres));

      const result = controller.getGenres();

      result.subscribe((value) => {
        expect(value).toEqual(mockGenres);
      });

      expect(service.getGenres).toHaveBeenCalled();
    });
  });
});

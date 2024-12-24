type Films = {
    ageRating: string
    directorFirstName: string
    directorId: number
    directorLastName: string
    filmId: number
    genreId: number
    rating: number
    releaseDate: string
    title: string

}

type Film = {
    ageRating: string
    description: string
    directorFirstName: string
    directorId: number
    directorLastName: string
    filmId: number
    genreId: number
    numReviews: number
    rating: number
    releaseDate: string
    runtime: number
    title: string
}

type GetFilmsResponse = {
  data: Films[];
};

type UserBadgeProps = {
  id: number;
  firstName: string;
  lastName: string;
};

type filmSearchQuery = {
  q?: string,
  directorId?: number,
  reviewerId?: number,
  genreIds?: Array<number>,
  ageRatings?: Array<string>,
  sortBy?: string
  count?: number,
  startIndex?: number
}

type SimilarFilmSearchQuery = {
  q?: string,
  directorId?: number,
  reviewerId?: number,
  genreIds?:number,
  ageRatings?: Array<string>,
  sortBy?: string
  count?: number,
  startIndex?: number
}

type FetchFilmsResponse = {
  films: Films[];
  count: number;
};

type reviewResponse = {
  reviewerId: number;
  rating: number;
  review: string;
  reviewerFirstName: string;
  reviewerLastName: string;
  timestamp:string;
}
type genre = {
  genreId: number;
  name:string;
}
export {Film, Films, filmSearchQuery, GetFilmsResponse, UserBadgeProps, FetchFilmsResponse, genre, SimilarFilmSearchQuery, reviewResponse}
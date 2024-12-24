type film = {
    filmId: number;
    title: string;
    genreId: number;
    ageRating: string;
    directorId: number;
    directorFirstName: string;
    directorLastName: string;
    rating: number;
};

type oneFilm = {
    filmId: number;
    title: string;
    genreId: number;
    ageRating: string;
    directorId: number;
    directorFirstName: string;
    directorLastName: string;
    rating: number;
    releaseDate: string;
    description: string;
    runtime: number;
    numRatings: number;
};

type allFilms = {
    film: film[];
    count: number;
};

type newFilm = {
    title: string;
    description: string;
    releaseDate?: string;
    genreId: number;
    runtime?: number;
    ageRating?: string;
};

type baseFilm = {
    title: string;
    description: string;
    releaseDate: string;
    genreId: number;
    runtime: number;
    ageRating: string;
    id: number;
    imageFileName: string;
    directorId: number;
};
type genre = {
    id: number;
    name: string;
};

type FilmReviews = {
    reviewerId: number;
    reviewerFirstName: string;
    reviewerLastName: string;
    rating: number;
    review: string;
    timestamp: string;
};

type addfilmReview = {
    user_id: number;
    rating: number;
    review: string;
    timestamp: Date;
};

type review = {
    rating: number;
    review: string;
};

type paramsQuery = {
    startIndex: number;
    count: number;
    q: string;
    directorId: number;
    reviewerId: number;
    sortBy: string;
    genreIds: number[];
    ageRatings: string[];
};

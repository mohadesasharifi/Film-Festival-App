import { getPool } from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { camelizeKeys, decamelizeKeys } from "humps";
import Logger from "../../config/logger";

const viewAll = async (searchQuery: paramsQuery): Promise<allFilms> => {
    let query = `SELECT DISTINCT A.id as filmId,
    A.title as title,
    A.genre_id as genreId,
    A.director_id as directorId,
    B.first_name as directorFirstName,
    B.last_name as directorLastName,
    A.release_date as releaseDate,
    A.age_rating as ageRating,
    (SELECT cast(COALESCE(cast(AVG(film_review.rating)as decimal(10,2)),0) AS float) FROM film_review WHERE A.id = film_review.film_id) as rating
    FROM film as A LEFT JOIN user as B ON A.director_id = B.id LEFT JOIN film_review as C ON A.id = C.film_id\n`;

    const whereConditions: any[] = [];
    const values: any[] = [];

    if (searchQuery.reviewerId !== -1) {
        query +=
            "INNER JOIN film_review ON A.id = film_review.film_id AND film_review.user_id = ?\n";
        values.push(searchQuery.reviewerId);
    }

    if (searchQuery.q) {
        query += "INNER JOIN film ON A.title LIKE ? OR A.description LIKE ?\n";
        values.push(`%${searchQuery.q}%`);
        values.push(`%${searchQuery.q}%`);
    }

    if (searchQuery.directorId !== -1) {
        whereConditions.push("A.director_id =?\n");
        values.push(searchQuery.directorId);
    }

    if (searchQuery.genreIds.length) {
        whereConditions.push("A.genre_id IN (?)\n");
        values.push(searchQuery.genreIds);
    }
    if (searchQuery.ageRatings.length) {
        whereConditions.push("A.age_rating IN (?)\n");
        values.push(searchQuery.ageRatings);
    }

    if (whereConditions.length !== 0) {
        query += "WHERE " + whereConditions.join("AND ");
    }

    const allowedSorts = (sort: string) =>
        ({
            ALPHABETICAL_ASC: `ORDER BY title ASC`,
            ALPHABETICAL_DESC: `ORDER BY title DESC`,
            RELEASED_ASC: `ORDER BY releaseDate ASC`,
            RELEASED_DESC: `ORDER BY releaseDate DESC`,
            RATING_ASC: `ORDER BY rating ASC`,
            RATING_DESC: `ORDER BY rating DESC`,
        }[sort]);
    query += allowedSorts(searchQuery.sortBy) + ", filmId\n";
    // countQuery and countValues are the query and values we want to send to the database before adding the pagination
    const countQuery = query;
    const countValues = values;

    if (searchQuery.count !== -1) {
        query += "LIMIT ?\n";
        values.push(searchQuery.count);
    }

    if (searchQuery.startIndex !== -1) {
        if (searchQuery.count === -1) {
            query += "LIMIT ?\n";
            values.push(1000000000);
        }
        query += "OFFSET ?\n";
        values.push(searchQuery.startIndex);
    }
    // count fetches the data from databse without pagination. We send the count.length in the response
    const count = await getPool().query(countQuery, countValues);
    const result = await getPool().query(query, values);
    return result[0].length === 0
        ? null
        : ({ films: result[0], count: count[0].length } as unknown as allFilms);
};

const viewOne = async (id: number): Promise<oneFilm> => {
    const query = `SELECT DISTINCT A.id as filmId,
    A.title as title,
    A.genre_id as genreId,
    A.age_rating as ageRating,
    A.director_id as directorId,
    B.first_name as directorFirstName,
    B.last_name as directorLastName,
    (SELECT cast(COALESCE(cast(AVG(film_review.rating)as decimal(10,2)),0) AS float) FROM film_review WHERE A.id = film_review.film_id) as rating,
    A.release_date as releaseDate,
    A.description as description,
    A.runtime as runtime,
    (SELECT COUNT(film_review.rating) FROM film_review WHERE A.id = film_review.film_id) as numReviews
    FROM film as A LEFT JOIN user as B ON A.director_id = B.id LEFT JOIN film_review as C ON A.id = C.film_id
    WHERE A.id=?`;
    const result = await getPool().query(query, [id]);
    return result[0].length === 0 ? null : (result[0][0] as unknown as oneFilm);
};

const findFilmByTitle = async (title: string): Promise<number> => {
    const query = "SELECT id as filmId FROM film WHERE title = ?";
    const id = await getPool().query(query, [title]);
    return id[0].length === 0 ? null : (id[0][0] as unknown as number);
};

const findFilmByGenreId = async (genreId: number): Promise<genre> => {
    const query = "SELECT * from genre where id=?";
    const genre = await getPool().query(query, [genreId]);
    return genre[0].length === 0 ? null : (genre[0][0] as unknown as genre);
};

const findFilmById = async (filmId: number): Promise<baseFilm> => {
    const query =
        "SELECT title, description, release_date, genre_id, runtime, age_rating, id, director_id FROM film WHERE id = ?";
    const film = await getPool().query(query, [filmId]);
    return film[0].length === 0
        ? null
        : (camelizeKeys(film[0][0]) as unknown as baseFilm);
};

const findFilmReviews = async (filmId: number): Promise<number> => {
    const query =
        "SELECT COUNT(*) as noReviews FROM film_review WHERE film_id = ?";
    const noReviews = await getPool().query(query, [filmId]);
    return noReviews[0][0].noReviews;
};

const addAFilm = async (value: newFilm, id: number): Promise<void> => {
    const query = `INSERT INTO \`film\` ( title, description, release_date, genre_id, runtime, age_rating, director_id) VALUES (?,?,?,?,?,?,?)`;
    await getPool().query(query, [
        value.title,
        value.description,
        value.releaseDate,
        value.genreId,
        value.runtime,
        value.ageRating,
        id,
    ]);
};

const editFilm = async (value: any, id: number): Promise<void> => {
    const query = `UPDATE \`film\` SET title=?, description=?, release_date=?, genre_id=?, runtime=?, age_rating=? WHERE id = ?`;
    await getPool().query(query, [
        value.title,
        value.description,
        value.releaseDate,
        value.genreId,
        value.runtime,
        value.ageRating,
        id,
    ]);
};

const deleteOne = async (filmId: number): Promise<void> => {
    const query = "DELETE FROM `film` WHERE `film`.`id` = ?";
    await getPool().query(query, [filmId]);
};

const getGenres = async (): Promise<genre> => {
    const query = "SELECT id as genreId, name FROM genre";
    const result = await getPool().query(query);
    return result[0];
};

const fetchFilmFilename = async (filmId: number): Promise<string> => {
    const query = "SELECT image_filename FROM film WHERE id =?";
    const result = await getPool().query(query, [filmId]);
    return result[0].length === 0 ? null : result[0][0].image_filename;
};

const setImageFileName = async (
    filmId: number,
    newFileName: string
): Promise<void> => {
    const query = "UPDATE film SET image_filename =? WHERE id =?";
    const result = await getPool().query(query, [newFileName, filmId]);
};

const deleteImageFilename = async (filmId: number): Promise<void> => {
    const query = "UPDATE film SET image_filename =? WHERE id =?";
    const result = await getPool().query(query, [null, filmId]);
};

export {
    viewAll,
    viewOne,
    findFilmByTitle,
    findFilmByGenreId,
    findFilmById,
    addAFilm,
    findFilmReviews,
    editFilm,
    deleteOne,
    getGenres,
    fetchFilmFilename,
    setImageFileName,
    deleteImageFilename,
};

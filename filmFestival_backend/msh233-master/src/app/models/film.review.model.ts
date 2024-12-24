import { getPool } from "../../config/db";

const getReviews = async (filmId: number): Promise<FilmReviews> => {
    const query =
        "SELECT A.user_id as reviewerId, B.first_name as reviewerFirstName, B.last_name as reviewerLastName, A.rating, A.review, A.timestamp FROM `film_review` as A LEFT JOIN `user` as B ON A.user_id = B.id WHERE A.film_id  = ? ORDER BY A.timestamp DESC";
    const result = await getPool().query(query, [filmId]);
    return result[0];
};

const addReview = async (
    filmId: number,
    addFilmReview: review,
    id: number
): Promise<void> => {
    const query =
        "INSERT INTO `film_review` SET film_id =?, user_id =?, rating=?, review=?";
    const result = await getPool().query(query, [
        filmId,
        id,
        addFilmReview.rating,
        addFilmReview.review,
    ]);
};
export { getReviews, addReview };

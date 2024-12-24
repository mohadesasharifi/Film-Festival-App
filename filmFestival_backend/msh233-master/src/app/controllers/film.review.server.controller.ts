import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as Film from "../models/film.model";
import * as Joi from "./joiValidation";
import * as FilmReviews from "../models/film.review.model";
import { validateParams } from "./parameterValidation";

const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        // Your code goes here
        const filmId = await validateParams(req.params.id, res);

        const film = await Film.findFilmById(filmId);
        if (film === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }
        const reviews = await FilmReviews.getReviews(filmId);
        res.statusMessage = "OK";
        res.status(200).send(reviews);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const addReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.authorizedId;
        const filmId = await validateParams(req.params.id, res);

        const { value, error } = await Joi.validateAddReview(req.body);
        if (error) {
            res.statusMessage = "Bad Request. Invalid information";
            res.status(400).send();
            return;
        }

        if (isNaN(filmId)) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }

        const film = await Film.findFilmById(filmId);
        if (film === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }

        if (film.directorId === id) {
            res.statusMessage =
                "Forbidden. Cannot review your own film, or cannot post a review on a film that has not yet released";
            res.status(403).send();
            return;
        }
        if (value.review === undefined) {
            value.review = null;
        }
        await FilmReviews.addReview(filmId, value, id);
        res.statusMessage = "Created";
        res.status(201).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

export { getReviews, addReview };

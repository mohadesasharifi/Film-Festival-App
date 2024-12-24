import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as Film from "../models/film.model";
import * as Joi from "./joiValidation";
import { validateParams } from "./parameterValidation";
import * as validateQueries from "./queriesValidation"
const viewAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchQuery = await validateQueries.validateSearch(req, res);
        const films = await Film.viewAll(searchQuery);
        if (films === null) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        }
        res.statusMessage = "OK";
        res.status(200).send(films);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};


const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const filmId = await validateParams(req.params.id, res);
        const result = await Film.viewOne(filmId);
        if (result === null) {
            res.statusMessage = "Not Found. No film with id";
            res.status(404).send();
            return;
        }
        res.statusMessage = "OK";
        res.status(200).send(result);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const addOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.authorizedId;
        const newFilm: newFilm = req.body;
        const { value, error } = await Joi.validateNewFilm(newFilm);
        if (error) {
            Logger.info(error);
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        }
        const exsitedGenre = await Film.findFilmByGenreId(value.genreId);
        const newFilmTitle = value.title;
        const newFilmReleaseDate = value.releaseDate;
        const duplicateTitle = await Film.findFilmByTitle(newFilmTitle);
        const ageRatingExt = ["G", "PG", "M", "R16", "R18", "TBC"];
        if (
            exsitedGenre === null ||
            (req.hasOwnProperty("ageRating") &&
                !ageRatingExt.includes(value.ageRating))
        ) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        }
        if (
            duplicateTitle !== null ||
            Date.parse(newFilmReleaseDate) < Date.now()
        ) {
            res.statusMessage =
                "Forbidden. Film title is not unique, or cannot release a film in the past";
            res.status(403).send();
            return;
        }
        // Your code goes here

        if (!value.releaseDate) {
            value.releaseDate = new Date();
        }
        if (!value.runtime) {
            value.runtime = null;
        }
        if (!value.ageRating) {
            value.ageRating = "TBC";
        }
        await Film.addAFilm(value, id);
        const filmId = await Film.findFilmByTitle(value.title);
        res.statusMessage = "Created";
        res.status(201).send(filmId);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const editOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const directorId = req.authorizedId;
        const filmId = await validateParams(req.params.id, res);
        const updateFilm: newFilm = {
            title: req.body.title,
            description: req.body.description,
            releaseDate: req.body.releaseDate,
            genreId: req.body.genreId,
            runtime: req.body.runtime,
            ageRating: req.body.ageRating,
        };
        const { value, error } = await Joi.validateUpdateFilm(updateFilm);
        if (error || isNaN(filmId)) {
            res.statusMessage = "Bad request. Invalid information";
            res.status(400).send();
            return;
        }

        const film = await Film.findFilmById(filmId);
        if (film === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }
        const noReviews = await Film.findFilmReviews(filmId);

        if (
            film.directorId !== directorId ||
            Date.parse(film.releaseDate) < Date.now() ||
            (value.releaseDate !== undefined &&
                Date.parse(value.releaseDate) < Date.now()) ||
            noReviews > 0
        ) {
            res.statusMessage =
                "Forbidden. Only the director of an film may change it, cannot change the releaseDate since it has already passed, cannot edit a film that has a review placed, or cannot release a film in the past";
            res.status(403).send();
            return;
        }
        const filmEntries = Object.entries(film);
        const filmEditEntries = Object.entries(value);
        for (let i = 0; i < filmEditEntries.length; i++) {
            if (filmEditEntries[i][1] === undefined) {
                filmEditEntries[i][1] = filmEntries[i][1];
            }
        }
        const filmEditObj = Object.fromEntries(filmEditEntries);
        await Film.editFilm(filmEditObj, filmId);
        res.statusMessage = "OK";
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const deleteOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const filmId = await validateParams(req.params.id, res);
        const directorId = req.authorizedId;
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
        if (directorId !== film.directorId) {
            res.statusMessage =
                "Forbidden. Only the director of an film can delete it";
            res.status(403).send();
            return;
        }
        // Your code goes here
        await Film.deleteOne(filmId);
        res.statusMessage = "OK";
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const getGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = await Film.getGenres();
        // Your code goes here
        res.statusMessage = "OK";
        res.status(200).send(genres);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

export { viewAll, getOne, addOne, editOne, deleteOne, getGenres };

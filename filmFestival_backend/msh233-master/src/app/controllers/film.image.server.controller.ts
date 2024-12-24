import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as Film from "../models/film.model";
import * as ImgExt from "./imageExtension";
import * as FilmImage from "../models/image.model";
import {validateParams} from "./parameterValidation";
const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const filmId = await validateParams(req.params.id, res);
        const film = await Film.findFilmById(filmId);
        if (film === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }
        const filename = await Film.fetchFilmFilename(filmId);
        if (filename === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }
        const [image, contentType] = await FilmImage.readImage(filename);
        res.statusMessage = "OK";


        res.status(200).contentType(contentType).send(image);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const setImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.authorizedId;
        const filmId = await validateParams(req.params.id, res);
        const contentTypeExt = req.header("Content-Type");
        const fileExt = ImgExt.getImageExension(contentTypeExt);
        const image = req.body;
        let isNewImage = true;
        const film = await Film.findFilmById(filmId);

        if (film.directorId !== id) {
            res.statusMessage =
                "Forbidden. Only the director of a film can change the hero image";
            res.status(403).send();
            return;
        }

        if (fileExt.length === 0 || image.length === undefined) {
            res.statusMessage =
                "Bad Request. Invalid image supplied (possibly incorrect file type)";
            res.status(400).send();
            return;
        }
        if (film === null) {
            res.statusMessage = "Not Found. No film found with id";
            res.status(404).send();
            return;
        }

        const filename = await Film.fetchFilmFilename(filmId);
        if (filename !== null) {
            await FilmImage.removeImage(filename);
            await Film.deleteImageFilename(filmId);
            isNewImage = false;
        }

        const newFileName = await FilmImage.addImage(filmId, image, fileExt);
        Film.setImageFileName(filmId, newFileName);
        if (isNewImage) {
            res.statusMessage = "Created. New image created";
            res.status(201).send();
            return;
        } else {
            res.statusMessage = "OK. Updated";
            res.status(200).send();
            return;
        }
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

export { getImage, setImage };

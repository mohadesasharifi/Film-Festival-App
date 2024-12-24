import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as UserImage from "../models/image.model";
import * as User from "../models/user.model";
import * as ImgExt from "./imageExtension";
import { validateParams } from "./parameterValidation";

const getImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = await validateParams(req.params.id, res);
        const user = await User.view(userId);
        const userImageFilename = await User.getImageFilename(userId);
        if (user === null || userImageFilename === null) {
            res.statusMessage =
                "Not Found. No user with specified ID, or user has no image";
            res.status(404).send();
            return;
        }

        res.statusMessage = "OK";
        const [image, contentType] = await UserImage.readImage(
            userImageFilename
        );

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
        const userId = await validateParams(req.params.id, res);
        const user = await User.findUserById(userId);
        const contentTypeExt = req.header("Content-Type");
        const fileExt = ImgExt.getImageExension(contentTypeExt);
        const image = req.body;
        let isNewImage = true;

        if (fileExt.length === 0 || image.length === undefined) {
            res.statusMessage =
                "Bad Request. Invalid image supplied (possibly incorrect file type)";
            res.status(400).send();
            return;
        }
        if (user === null) {
            res.statusMessage = "Not Found. No such user with ID given";
            res.status(404).send();
            return;
        }
        if (id !== userId) {
            res.statusMessage =
                "Forbidden. Can not delete another user's profile photo";
            res.status(403).send();
            return;
        }

        const imageFilename = user.imageFilename;
        if (imageFilename !== null) {
            await UserImage.removeImage(imageFilename);
            await User.deleteImageFilename(id);
            isNewImage = false;
        }

        const newFileName = await UserImage.addImage(id, image, fileExt);
        User.setImageFileName(id, newFileName);
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

const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.authorizedId;
        const userId = await validateParams(req.params.id, res);
        const user = await User.findUserById(userId);
        if (user === null) {
            res.statusMessage = "Not Found. No such user with ID given";
            res.status(404).send();
            return;
        }

        if (id !== userId) {
            res.statusMessage =
                "Forbidden. Can not delete another user's profile photo";
            res.status(403).send();
            return;
        }

        await UserImage.removeImage(user.imageFilename);
        await User.deleteImageFilename(id);
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

export { getImage, setImage, deleteImage };

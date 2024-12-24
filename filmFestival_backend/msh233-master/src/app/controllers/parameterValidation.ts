import { Request, Response } from "express";
import Logger from "../../config/logger";

export const validateParams = async (
    param: string,
    res: Response
): Promise<any> => {
    try {
        const intParam = parseInt(param, 10);
        if (isNaN(intParam) || intParam < 0) {
            throw new Error("invalid parameter");
        }
        return intParam;
    } catch (err) {
        Logger.info(err);
        res.statusMessage = "Not Found. No film found with id";
        res.status(404).send();
        return;
    }
};

export const validateQueryParams = async (
    param: string,
    res: Response
): Promise<any> => {
    try {
        const intParam = parseInt(param, 10);
        if (isNaN(intParam) || intParam < 0) {
            throw new Error("invalid parameter");
        }
        return intParam;
    } catch (err) {
        Logger.info(err);
        res.statusMessage = "Bad request";
        res.status(400).send();
        return;
    }
};

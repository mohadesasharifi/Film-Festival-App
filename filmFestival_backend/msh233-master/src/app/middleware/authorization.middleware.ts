import { findUserByToken } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import Logger from "../../config/logger";

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header("X-Authorization");
        const user = await findUserByToken(token);
        if (user === null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
            return;
        }
        req.authorizedId = user.id;
        next();
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const AuthenticateButNotRequired = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header("X-Authorization");
        const user = await findUserByToken(token);
        if (user !== null) {
            req.authorizedId = user.id;
            next();
        } else {
            req.authorizedId = -1;
            next();
        }
    } catch (err) {
        req.authorizedId = -1;
        next();
    }
};

export { authenticate, AuthenticateButNotRequired };

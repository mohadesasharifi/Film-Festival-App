import { Request, Response } from "express";
import Logger from "../../config/logger";
import * as User from "../models/user.model";
import { uid } from "rand-token";
import * as Passwords from "./passwords";
import * as Joi from "./joiValidation";
import { validateParams } from "./parameterValidation";

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRejInputs: userRegister = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        };

        const { value, error } = await Joi.validateUserRegister(userRejInputs);
        if (error) {
            res.statusMessage = "Bad Request. Invalid information";
            res.status(400).send();
            return;
        }

        const FoundEmailResult = await User.FindUserByEmail(value.email);
        if (FoundEmailResult !== null) {
            res.statusMessage = "Forbidden. Email already in use";
            res.status(403).send();
            return;
        }

        value.password = await Passwords.hash(value.password);
        const result = await User.register(value);
        res.status(201).send({ userId: result.insertId });
        res.statusMessage = "Created";
        return;
    } catch (err) {
        Logger.info(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const loginUser: LoginUser = {
            email: req.body.email,
            password: req.body.password,
        };

        const { value, error } = await Joi.validateUserLogin(loginUser);
        if (error) {
            res.statusMessage = "Bad request. Invalid information";
            res.status(400).send();
            return;
        }

        const user = await User.FindUserByEmail(loginUser.email);
        const matchedPasswords = await Passwords.compare(
            loginUser.password,
            user.password
        );

        if (user === null || !matchedPasswords) {
            res.statusMessage = "Not Authorised. Incorrect email/password";
            res.status(401).send();
            return;
        }

        const token = uid(64);
        await User.login(user.id, token);
        res.status(200).send({ userId: user.id, token });
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.authorizedId;
        const result = await User.logout(id);
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

const view = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = await validateParams(req.params.id, res);

        const user = await User.view(userId);

        if (user === null) {
            res.statusMessage = "Not Found. No user with specified ID";
            res.status(404).send();
            return;
        }

        if (req.authorizedId === userId) {
            delete user.id;
            res.statusMessage = "OK";
            res.status(200).send(user);
            return;
        } else {
            delete user.email;
            res.statusMessage = "OK";
            res.status(200).send(user);
            return;
        }
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = await validateParams(req.params.id, res);
        const userPatchInputs: UserPatch = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            current_password: req.body.currentPassword,
        };

        const { value, error } = await Joi.validateUserPatch(userPatchInputs);
        // 400: bad request. We check the inputs in validateUserPatch function
        if (error) {
            res.statusMessage = "Bad Request. Invalid information";
            res.status(400).send();
            return;
        }

        // 401: if the client is  unauthorized or the header's token does not match any tokens in the database the auth_middleware will throw 401 error.
        const id = req.authorizedId;
        // 404: If the params_id does not exist in the database
        const user = await User.view(userId);
        if (user === null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
            return;
        }

        // 403:
        // findByEmail function sends query to the database with the given email to see if the email is in use
        // if result1 is null it means database could not found a user with the given email
        // elif result1 is not null it means the email is alreay in use.
        const result1 = await User.FindUserByEmail(userPatchInputs.email);
        // 403: in the if statement we check
        // - if email is not already in use
        // - if the id of the authorized user who sent the request match the id of user he/she wants to update
        // current_password should not be identical to password.
        if (
            result1 !== null ||
            id !== userId ||
            userPatchInputs.password === userPatchInputs.current_password
        ) {
            res.statusMessage =
                "Forbidden. This is not your account, or the email is already in use, or identical current and new passwords";
            res.status(403).send();
            return;
        }

        // 401: check if the current password match the user's password in the database
        const result = await User.fetchPassword(id);
        const matchedPasswords = await Passwords.compare(
            userPatchInputs.current_password,
            result.password
        );
        if (!matchedPasswords) {
            res.statusMessage = "Unauthorized or Invalid currentPassword";
            res.status(401).send();
            return;
        }

        const userEntries = Object.entries(user);
        const userPatchEntries = Object.entries(userPatchInputs);
        for (let i = 0; i < 4; i++) {
            if (userPatchEntries[i][1] === undefined) {
                userPatchEntries[i][1] = userEntries[i][1];
            }
        }
        const userPatchObj: UserPatch = Object.fromEntries(userPatchEntries);
        userPatchObj.password = await Passwords.hash(userPatchObj.password);
        const result3 = await User.update(userPatchObj, id);
        res.statusMessage = "Ok";
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
};

export { register, login, logout, update, view };

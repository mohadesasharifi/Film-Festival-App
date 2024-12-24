import { Request, Response } from "express";
import Logger from "../../config/logger";
import {validateQueryParams } from "./parameterValidation";

const validateSearch = async (
    req: Request,
    res: Response
): Promise<paramsQuery> => {
    const search: paramsQuery = {
        startIndex: -1,
        count: -1,
        q: "",
        directorId: -1,
        reviewerId: -1,
        sortBy: "RELEASED_ASC",
        genreIds: [],
        ageRatings: [],
    };
    const allowedSorts: string[] = [
        "ALPHABETICAL_ASC",
        "ALPHABETICAL_DESC",
        "RELEASED_ASC",
        "RELEASED_DESC",
        "RATING_ASC",
        "RATING_DESC",
    ];
    const allowedAgeRating: string[] = [
        "G",
        "PG",
        "M",
        "R13",
        "R16",
        "R18",
        "TBC",
    ];
    try {
        if (req.query.hasOwnProperty("count")) {
            search.count = await validateQueryParams(req.query.count as string, res);
        }

        if (req.query.hasOwnProperty("start")) {
            search.startIndex = await validateQueryParams(req.query.start as string, res);
        }

        if (req.query.hasOwnProperty("directorId")) {
            search.directorId = await validateQueryParams(req.query.directorId as string, res);
        }
        if (req.query.hasOwnProperty("reviewerId")) {
            search.reviewerId = await validateQueryParams(req.query.reviewerId as string, res);
        }

        if (req.query.hasOwnProperty("genreIds")) {
            if (!Array.isArray(req.query.genreIds)) {
                search.genreIds.push(await validateQueryParams(req.query.genreIds as string, res));
            } else {
                for (const id of req.query.genreIds) {
                    if (
                        isNaN(parseInt(id as string, 10)) ||
                        parseInt(id as string, 10) < 0
                    )
                        throw new Error("Invalid genreIds parameter");
                    search.genreIds.push(await validateQueryParams(id as string, res));
                }
            }
        }

        if (req.query.hasOwnProperty("q")) search.q = req.query.q as string;

        if (req.query.hasOwnProperty("sortBy")) {
            if (allowedSorts.includes(req.query.sortBy as string))
                search.sortBy = req.query.sortBy as string;
            else throw new Error("Invalid sortBy parameter");
        }

        if (req.query.hasOwnProperty("ageRatings")) {
            if (!Array.isArray(req.query.ageRatings)) {
                if (allowedAgeRating.includes(req.query.ageRatings as string)) {
                    search.ageRatings.push(req.query.ageRatings as string);
                } else throw new Error("Invalid age rating parameter");
            } else {
                for (const age of req.query.ageRatings) {
                    if (allowedAgeRating.includes(age as string)) {
                        search.ageRatings.push(age as string);
                    } else throw new Error("Invalid age rating parameter");
                }
            }
        }

        return search;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Bad Request";
        res.status(400).send();
        return;
    }
};

export { validateSearch };

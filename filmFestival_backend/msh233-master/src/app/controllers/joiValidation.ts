import Joi, { number } from "joi";

async function validateUserRegister(userRejInputs: userRegister) {
    const schema = Joi.object({
        first_name: Joi.string().required().max(64),
        last_name: Joi.string().required().max(64),
        email: Joi.string().email().required().max(256),
        password: Joi.string().required().min(6).max(256),
    });
    return schema.validate(userRejInputs);
}

async function validateUserLogin(loginUser: LoginUser) {
    const schema = Joi.object({
        email: Joi.string().required().max(256),
        password: Joi.string().required().min(6).max(256),
    });
    return schema.validate(loginUser);
}

async function validateUserPatch(userPatch: UserPatch) {
    const schema = Joi.object({
        first_name: Joi.string().optional().max(64).min(1),
        last_name: Joi.string().optional().max(64).min(1),
        email: Joi.string().optional().email().max(256).min(1),
        password: Joi.string().optional().max(256).min(6),
        current_password: Joi.string().optional().max(256).min(6),
    });
    return schema.validate(userPatch);
}

async function validateUserSetImage(userImageFilename: userImageFilename) {
    const schema = Joi.object({
        filename: Joi.string().required(),
    });
    return schema.validate(userImageFilename);
}

async function validateNewFilm(newFilm: newFilm) {
    const schema = Joi.object({
        title: Joi.string().required().max(64).min(1),
        description: Joi.string().required().max(512).min(1),
        releaseDate: Joi.date().optional(),
        genreId: Joi.number().required().max(99999999999).min(1),
        runtime: Joi.number().optional().max(99999999999).min(1),
        ageRating: Joi.string().optional().max(3),
    });
    return schema.validate(newFilm);
}

async function validateUpdateFilm(newFilm: newFilm) {
    const schema = Joi.object({
        title: Joi.string().optional().max(64).min(1),
        description: Joi.string().optional().max(512).min(1),
        releaseDate: Joi.date().optional(),
        genreId: Joi.number().optional().max(99999999999).min(1),
        runtime: Joi.number().optional().max(99999999999).min(1),
        ageRating: Joi.string().optional().max(3).min(1),
    });
    return schema.validate(newFilm);
}

async function validateAddReview(addReview: review) {
    const schema = Joi.object({
        rating: Joi.number().integer().required().max(10).min(1),
        review: Joi.string().optional().max(512).min(1),
    });
    return schema.validate(addReview);
}


export {
    validateUserLogin,
    validateUserPatch,
    validateUserRegister,
    validateUserSetImage,
    validateNewFilm,
    validateUpdateFilm,
    validateAddReview,
};

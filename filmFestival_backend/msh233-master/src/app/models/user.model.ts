import { getPool } from "../../config/db";
import { ResultSetHeader } from "mysql2";
import { camelizeKeys, decamelizeKeys } from "humps";

const register = async (
    userRejInputs: userRegister
): Promise<ResultSetHeader> => {
    const query =
        "INSERT INTO user (first_name, last_name, email, password) VALUES (?)";

    const [result] = await getPool().query(query, [
        [
            userRejInputs.first_name,
            userRejInputs.last_name,
            userRejInputs.email,
            userRejInputs.password,
        ],
    ]);
    return result;
};

const FindUserByEmail = async (email: string): Promise<user> => {
    const query = "SELECT * FROM user WHERE email = ?";
    const result = await getPool().query(query, [email]);

    return result[0].length === 0
        ? null
        : (camelizeKeys(result[0][0]) as unknown as user);
};

const login = async (id: number, token: string): Promise<ResultSetHeader> => {
    const query = `UPDATE user SET auth_token =? WHERE id = ?`;
    const [result] = await getPool().query(query, [token, id]);
    return result;
};

const findUserByToken = async (token: string): Promise<user> => {
    const query = "SELECT * FROM `user` WHERE `auth_token` = ?";
    const result = await getPool().query(query, [token]);
    return result[0].length === 0
        ? null
        : (camelizeKeys(result[0][0]) as unknown as user);
};

const logout = async (userId: number): Promise<ResultSetHeader> => {
    const query = "UPDATE user SET auth_token = ? WHERE id = ?";
    const [result] = await getPool().query(query, [null, userId]);
    return result;
};

const view = async (userId: number): Promise<userFetch> => {
    const query =
        "SELECT `first_name`, `last_name`, `email` FROM `user` WHERE `id` = ?";
    const result = await getPool().query(query, [userId]);
    return result[0].length === 0
        ? null
        : (camelizeKeys(result[0][0]) as unknown as user);
};

const fetchPassword = async (userId: number): Promise<userFetchPassword> => {
    const query = "SELECT `password` FROM `user` WHERE `id` = ?";
    const result = await getPool().query(query, [userId]);
    return result[0].length === 0
        ? null
        : (camelizeKeys(result[0][0]) as unknown as userFetchPassword);
};

const update = async (
    userPatch: UserPatch,
    userId: number
): Promise<ResultSetHeader> => {
    const query =
        "UPDATE user SET first_name=?, last_name=?, email=?, password=? WHERE id = ?";
    const [result] = await getPool().query(query, [
        userPatch.first_name,
        userPatch.last_name,
        userPatch.email,
        userPatch.password,
        userId,
    ]);
    return result;
};

const findUserById = async (id: number): Promise<user> => {
    const query = "SELECT * FROM user WHERE id = ?";
    const result = await getPool().query(query, [id]);

    return result[0].length === 0
        ? null
        : (camelizeKeys(result[0][0]) as unknown as user);
};

const getImageFilename = async (id: number): Promise<string> => {
    const query = "SELECT `image_filename` FROM `user` WHERE id = ?";
    const rows = await getPool().query(query, [id]);
    return rows[0].length === 0 ? null : rows[0][0].image_filename;
};
const deleteImageFilename = async (id: number): Promise<void> => {
    const query = `UPDATE \`user\` SET image_filename = NULL WHERE id = ?`;
    const result = await getPool().query(query, [id]);
};

const setImageFileName = async (
    id: number,
    filename: string
): Promise<void> => {
    const query = `UPDATE \`user\` SET image_filename = ? WHERE id = ?`;
    const result = await getPool().query(query, [filename, id]);
};

export {
    register,
    FindUserByEmail,
    findUserByToken,
    login,
    logout,
    view,
    fetchPassword,
    update,
    getImageFilename,
    deleteImageFilename,
    setImageFileName,
    findUserById,
};

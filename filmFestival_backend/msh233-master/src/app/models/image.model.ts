import { fs } from "mz";
import Logger from "../../config/logger";
import * as ImgExt from "../controllers/imageExtension";

const filepath = "./storage/images/";

const readImage = async (fileName: string): Promise<[Buffer, string]> => {
    const image = await fs.readFile(filepath + fileName);
    const contentType = ImgExt.getImageContentType(fileName);
    return [image, contentType];
};

const removeImage = async (filename: string): Promise<void> => {
    if (filename) {
        if (await fs.exists(filepath + filename)) {
            await fs.unlink(filepath + filename);
        }
    }
};

const addImage = async (
    id: number,
    image: any,
    fileExt: string
): Promise<string> => {
    const filename = `user_${id}` + fileExt;

    try {
        await fs.writeFile(filepath + filename, image);
        return filename;
    } catch (err) {
        Logger.error(err);
        fs.unlink(filepath + filename).catch((err) => Logger.error(err));
        throw err;
    }
};

export { removeImage, addImage, readImage };

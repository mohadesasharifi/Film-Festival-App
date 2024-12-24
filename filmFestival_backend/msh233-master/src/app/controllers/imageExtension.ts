const getImageContentType = (filename: string): string => {
    if (filename.endsWith(".jpeg") || filename.endsWith(".jpg")) {
        return "image/jpeg";
    }
    if (filename.endsWith(".png")) {
        return "image/png";
    }
    if (filename.endsWith(".gif")) {
        return "image/gif";
    } else {
        return "";
    }
};

const getImageExension = (imgContentType: string): string => {
    if (imgContentType === "image/png") {
        return ".png";
    } else if (imgContentType === "image/jpeg") {
        return ".jpeg";
    } else if (imgContentType === "image/gif") {
        return ".gif";
    } else {
        return "";
    }
};

export { getImageExension, getImageContentType };

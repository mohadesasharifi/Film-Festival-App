type userRegister = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

type LoginUser = {
    email: string;
    password: string;
};

type user = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFilename: string;
    authToken: string;
};

type userFetch = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type UserPatch = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    current_password?: string;
};

type UserPatchPasswords = {
    password: string;
    current_password: string;
};

type userFetchPassword = {
    password: string;
};

type userImageFilename = {
    filename: string;
};

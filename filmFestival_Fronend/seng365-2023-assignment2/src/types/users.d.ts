type UserType = {
    /**
     * User id as defined by the database
     */
    user_id: number;
    /**
     * Users username as entered when created
     */
    username: string;
};

type NameType = {
    firstName: string;
    lastName: string;
    email: string;
};

export type { UserType, NameType };

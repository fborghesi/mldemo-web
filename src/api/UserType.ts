
export interface UserType {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    changed: number;
    is_admin: boolean;
    is_active: boolean;
};

export interface LoggedUserType extends UserType {
    token: string;
};


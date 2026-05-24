export declare enum UserRole {
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}

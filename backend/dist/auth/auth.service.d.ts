import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export interface JwtPayload {
    sub: string;
    email: string;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(email: string, password: string): Promise<Omit<User, 'password'>>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
        };
    }>;
    validateUser(payload: JwtPayload): Promise<User | null>;
    countUsers(): Promise<number>;
}

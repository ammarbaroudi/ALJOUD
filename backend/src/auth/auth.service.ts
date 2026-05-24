import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<Omit<User, 'password'>> {
    const hashed = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({ email, password: hashed });
    const saved = await this.userRepository.save(user);
    const { password: _omit, ...result } = saved;
    return result;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: { id: string; email: string } }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: { id: user.id, email: user.email },
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  async register(@Body() dto: LoginDto) {
    const existing = await this.authService.countUsers();
    if (existing > 0) {
      throw new ForbiddenException('Registration is closed');
    }
    return this.authService.register(dto.email, dto.password);
  }
}

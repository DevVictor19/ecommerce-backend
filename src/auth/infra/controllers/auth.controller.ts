import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { LoginUseCase } from '@/auth/application/usecases/login.usecase';
import { SignupUseCase } from '@/auth/application/usecases/signup.usecase';

import { LoginDto } from '../dtos/login.dto';
import { SignupDto } from '../dtos/signup.dto';
import { TokenDto } from '../dtos/token.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('/signup')
  async signup(@Body() dto: SignupDto) {
    await this.signupUseCase.execute(dto.username, dto.email, dto.password);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() dto: LoginDto): Promise<TokenDto> {
    const token = await this.loginUseCase.execute(dto.email, dto.password);

    const tokenDto = new TokenDto();
    tokenDto.token = token;

    return tokenDto;
  }
}

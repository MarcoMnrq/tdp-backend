import {
  Controller,
  Post,
  Res,
  Body,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { ExposedEndpoint } from 'src/decorators/exposed-endpoint.decorator';
import { SignIn2faDto } from './dto/sign-in-2fa.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RealIp } from 'src/decorators/realip.decorator';

@ApiTags('Authentication & Authorization Controller')
@Controller({
  path: 'auth',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ExposedEndpoint()
  async login(@Body() signInDto: SignInEmailDto, @RealIp() ipAddress) {
    return this.authService.loginWithEmail(signInDto, ipAddress);
  }

  @Post('login-totp')
  @ExposedEndpoint()
  async loginTotp(
    @Body() signInDto: SignIn2faDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginWithTotp(signInDto, response);
  }

  @Post('register')
  @ExposedEndpoint()
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.registerUser(signUpDto);
  }

  @Get('user')
  async me(@Req() req) {
    return this.authService.getUserDetails(req.user.id);
  }

  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(changePasswordDto, req.user.id);
  }

  @Post('refresh')
  @ExposedEndpoint()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  async logout(@Res() res) {
    return this.authService.logout(res);
  }
}

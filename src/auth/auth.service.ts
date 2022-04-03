import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from './auth-provider.enum';
import { SignUpDto } from './dto/sign-up.dto';
import { SignIn2faDto } from './dto/sign-in-2fa.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import axios from 'axios';

/*
References:
  https://github.com/Vivify-Ideas/nestjs-boilerplate/tree/master/src/modules/auth
  https://github.com/chnirt/nestjs-graphql-best-practice/blob/cicd/src/auth/jwt/index.ts
*/

@Injectable()
export class AuthService {
  private logger = new Logger();
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /*
    	Login with Email & Password
  	*/
  async loginWithEmail(signInDto: SignInEmailDto, ipAddress: string) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.provider !== AuthProvider.EMAIL) {
      throw new UnauthorizedException('Invalid authentication provider');
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    /*
		if (user.verified === false) {
			throw new UnauthorizedException('Please verify your email');
		}
		*/
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidCaptcha = await this.validateCaptcha(
      signInDto.token,
      ipAddress,
    );
    if (!isValidCaptcha) {
      throw new BadRequestException('Invalid captcha');
    }
    this.logger.log(
      `User with id:${user.id} and email:${user.email} has logged in successfully. IpAddress:${ipAddress}`,
    );
    return this.generateTokens(user);
  }
  /*
	 	Refresh Token
	*/
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const decodedToken = (await this.jwtService.decode(
      refreshTokenDto.refreshToken,
    )) as any;
    const user = await this.usersService.findOne(decodedToken.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const secretKey = 'Heldsansasc' + user.password;
    const isValidRefreshToken = await this.jwtService.verify(
      refreshTokenDto.refreshToken,
      {
        secret: secretKey,
      },
    );
    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }
    // TODO: check if refresh token is being re generated too often
    return this.generateTokens(user);
  }
  /*
		Generate access & refresh tokens
	*/
  generateTokens(user: User) {
    const accessToken = this.jwtService.sign({
      email: user.email,
      role: user.role,
      sub: user.id,
    });
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        role: user.role,
        sub: user.id,
      },
      {
        expiresIn: '30d',
        secret: 'Heldsansasc' + user.password,
      },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      authenticatedUser: user,
    };
  }
  /*
    	Login with TOTP
  	*/
  async loginWithTotp(signInDto: SignIn2faDto, response: Response) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.provider !== AuthProvider.TOTP) {
      throw new UnauthorizedException('Invalid authentication provider');
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    /*
		if (user.verified === false) {
			throw new UnauthorizedException('Please verify your email');
		}
		*/
    if (isValidPassword) {
      const token = this.jwtService.sign({
        username: user.email,
        role: user.role,
        sub: user.id,
      });
      response.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        //signed: true,
        secure: true,
      });

      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  /*
    	Register a new user
  	*/
  async registerUser(signUpDto: SignUpDto) {
    const user = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.usersService.register({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: await bcrypt.hash(signUpDto.password, 10),
      role: signUpDto.role,
    });
  }
  /*
    	Get authenticated user
  	*/
  async getUserDetails(userId: number) {
    this.logger.log(`Getting user details for id #${userId}`);
    const user = await this.usersService.findOne(userId);
    return { authenticatedUser: user };
  }
  /*
    	Change password
  	*/
  async validateCaptcha(captcha: string, ip: string) {
    const captchaSecretKey = '6LenLgUeAAAAAMlkMsj6ciABbsKN5NDGUCkGLzcm';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecretKey}&response=${captcha}&remoteip=${ip}`;
    const response = await axios.get(url);
    return response.data.success;
  }
  /*
    	Change password
  	*/
  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    this.logger.log(`Changing password for userId: ${userId}`);
    const user = await this.usersService.findOne(userId);
    const isValidPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (
      !isValidPassword ||
      changePasswordDto.newPassword != changePasswordDto.confirmPassword
    ) {
      throw new UnauthorizedException('Invalid operation');
    }
    await this.usersService.updatePassword(
      user.id,
      await bcrypt.hash(changePasswordDto.newPassword, 10),
    );
    return {
      message: 'Password changed successfully',
    };
  }
  /*
		Logout
	*/
  logout(res: Response) {
    res.clearCookie('accessToken');
    res.json({
      message: 'Logout successful',
    });
  }
}

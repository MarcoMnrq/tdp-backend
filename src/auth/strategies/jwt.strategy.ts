import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // Jwt Configuration
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'dsadsadsa',
    });
  }

  /*
  Validate the JWT token payload
  */
  async validate(payload: any) {
    /*
    const timeDiff = payload.exp - payload.iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    */
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Delete,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.model';
import { AuthGuard } from '@nestjs/passport';
import { CreditsService } from 'src/credits/credits.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly creditsService: CreditsService,
  ) {}

  @Put('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('phone_number') phone: string,
    @Body('password') password: string,
  ): Promise<User> {
    console.log('/register endpoint called');
    const user = await this.authService.register(
      username,
      email,
      phone,
      password,
    );
    await this.creditsService.createAccount(user);
    return user;
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.login(username, password);
  }

  @Post('refresh-token')
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string } | { message: string }> {
    const result = await this.authService.refreshAccessToken(refreshToken);

    if (result) {
      return result;
    } else {

      throw new UnauthorizedException(
        'Could not to generate new access token!',
      );
    }
  }

  @Delete('logout')
  async logout(@Request() req) {
    await this.authService.logout(req.user);
  }

  // To test a protected route with access token
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protected(@Request() req) {
    return { message: 'You are authorized to be here', user: req.user };
  }
}

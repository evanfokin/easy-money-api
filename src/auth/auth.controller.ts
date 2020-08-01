import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post(['sign-in', 'login'])
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-token')
  async updateToken(@Request() req) {
    return this.authService.login(req.user)
  }
}

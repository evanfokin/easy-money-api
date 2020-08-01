import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return req.user
  }
}

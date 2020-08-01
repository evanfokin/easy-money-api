import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { UpdateDto } from './dto/update.dto'
import { SyncService } from './sync.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private service: SyncService) {}

  @Post('/')
  update(@Request() req, @Body() updateDto: UpdateDto) {
    return this.service.update({ ...updateDto, user: req.user })
  }
}

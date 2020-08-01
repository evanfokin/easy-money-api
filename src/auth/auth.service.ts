import * as crypto from 'crypto'
import * as _ from 'lodash'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/user.entity'
import { ConfigService } from '@nestjs/config'
import { SignUpDto } from './dto/sign-up.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async login(user: User) {
    const payload = _.pick(user, ['id', 'email'])
    return { accessToken: this.jwtService.sign(payload) }
  }

  async signUp(data: SignUpDto): Promise<User> {
    const user = await this.usersRepository.findOne({ email: data.email })
    if (user) throw new BadRequestException('Пользователь с таким email уже существует')

    const passwordHash = await this.hashPassword(data.password)

    return this.usersRepository.save({
      ...data,
      password: passwordHash
    })
  }

  async hashPassword(password: string) {
    const salt = this.configService.get<string>('secret')
    return new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) return reject(err)
        return resolve(derivedKey.toString('hex'))
      })
    })
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ email })

    if (user && user.password === (await this.hashPassword(password))) {
      return _.omit(user, ['password'])
    }

    return null
  }
}

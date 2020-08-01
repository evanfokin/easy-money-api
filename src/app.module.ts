import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { configuration } from './config/configuration'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UsersModule } from './users/users.module'
import { TransactionsModule } from './transactions/transactions.module'
import { CategoriesModule } from './categories/categories.module'
import { AuthModule } from './auth/auth.module'
import { SyncModule } from './sync/sync.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      async useFactory(configService: ConfigService) {
        return {
          ...configService.get('database'),
          type: 'postgres',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true
        } as Partial<TypeOrmModuleOptions>
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UsersModule,
    TransactionsModule,
    CategoriesModule,
    SyncModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

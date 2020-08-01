import { Injectable } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from './transaction.entity'

@Injectable()
export class TransactionsService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo) {
    super(repo)
  }
}

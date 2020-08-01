import { Controller, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud'
import { User } from '../users/user.entity'
import { Transaction } from './transaction.entity'
import { TransactionsService } from './transactions.service'

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Transaction
  },
  routes: {
    only: ['getManyBase', 'getOneBase']
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true
    }
  },
  query: {
    join: {
      category: { eager: true }
    }
  }
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    'category.userId': user.id
  })
})
@Controller('transactions')
export class TransactionsController implements CrudController<Transaction> {
  constructor(public service: TransactionsService) {}
}

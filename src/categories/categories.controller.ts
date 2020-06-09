import { Controller, UseGuards } from '@nestjs/common';
import { Category } from './category.entity';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Category
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
  }
})
@CrudAuth({
  property: 'user',
  filter: (user: User) => ({
    userId: user.id
  }),
  persist: (user: User) => ({
    userId: user.id
  })
})
@Controller('categories')
export class CategoriesController implements CrudController<Category> {
  constructor(public service: CategoriesService) {}
}

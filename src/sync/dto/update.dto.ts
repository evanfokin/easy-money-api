import { Category } from '../../categories/category.entity';
import { Transaction } from '../../transactions/transaction.entity';
import { IsArray } from 'class-validator';

export class UpdateDto {
  @IsArray()
  transactions: Partial<Transaction>[];

  @IsArray()
  categories: Partial<Category>[];
}

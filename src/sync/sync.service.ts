import * as _ from 'lodash';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>
  ) {}

  async update(data: UpdateDto & { user: User }) {
    const {
      user,
      categories: localCategories,
      transactions: localTransactions
    } = data;
    let categories = await this.categoriesRepo.find({
      relations: ['transactions']
    });
    const transactions = _.flatten(categories.map(c => c.transactions));

    await Promise.all(
      localCategories
        .filter(category => {
          const savedCategory = categories.find(({ id }) => id === category.id);
          return (
            !savedCategory ||
            savedCategory.userId !== user.id ||
            moment(savedCategory.updatedAt).isBefore(moment(category.updatedAt))
          );
        })
        .map(async category => {
          category.userId = user.id;
          delete category.transactions;
          await this.categoriesRepo.save(category);
        })
    );

    await Promise.all(
      localTransactions
        .filter(transaction => {
          const savedTransaction = transactions.find(
            ({ id }) => id === transaction.id
          );
          return (
            !savedTransaction ||
            moment(savedTransaction.updatedAt).isBefore(
              moment(transaction.updatedAt)
            )
          );
        })
        .map(transaction => {
          return this.transactionsRepo.save(transaction);
        })
    );

    categories = await this.categoriesRepo.find({
      relations: ['transactions']
    });

    return {
      categories: categories.filter(c => {
        const local = localCategories.find(({ id }) => id === c.id);
        return !local || moment(c.updatedAt).isAfter(local.updatedAt);
      }),
      transactions: transactions.filter(t => {
        const local = localTransactions.find(({ id }) => id === t.id);
        return !local || moment(t.updatedAt).isAfter(local.updatedAt);
      }),
      result: true
    };
  }
}

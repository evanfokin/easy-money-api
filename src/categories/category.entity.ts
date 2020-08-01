import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TransactionType } from './types/transaction-type.type'
import { Transaction } from '../transactions/transaction.entity'
import { User } from '../users/user.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: number

  @Column()
  name: string

  @Column()
  icon: string

  @Column()
  type: TransactionType

  @Column({ nullable: true })
  budget: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  deletedAt: Date

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[]

  @ManyToOne(() => User, user => user.categories)
  user: User
}

import { Repository } from "@nx-ddd/common/domain/repository";
import { FirestoreRepository } from "../repository";
import { Transaction, UserTransaction } from "./domain";

@FirestoreRepository({
  Entity: Transaction,
  path: 'transactions',
})
export class TransactionRepository extends Repository<Transaction> { }

@FirestoreRepository({
  Entity: UserTransaction,
  path: `users/:userId/transactions`,
})
export class UserTransactionRepository extends Repository<UserTransaction> { }

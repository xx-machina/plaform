import { TestBed } from '@nx-ddd/core/test-bed';
import { BankAccountRepository } from './bank-account.repository';

describe('BankAccountRepository', () => {
  let repository: BankAccountRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repository = TestBed.inject(BankAccountRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });
});

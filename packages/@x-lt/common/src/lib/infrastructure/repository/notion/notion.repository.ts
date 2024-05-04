import { Injectable } from "@nx-ddd/core/di";
import { BankAccountRepository } from "./bank-account";
import { EntryRepository } from "./entry";
import { FirstEntryRepository } from "./first-entry";
import { ScholarshipRepository } from "./scholarship";
import { SecondEntryRepository } from "./second-entry";

@Injectable({providedIn: 'root'})
export class NotionRepository {
  constructor(
    public bankAccount: BankAccountRepository,
    public entry: EntryRepository,
    public firstEntry: FirstEntryRepository,
    public scholarship: ScholarshipRepository,
    public secondEntry: SecondEntryRepository,
  ) { }
}

import { Entry, EntryStatus } from '@x-lt/common/domain/models/notion';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import { Injectable } from '@nx-ddd/core/di';

@Injectable({providedIn: 'root'})
export abstract class BaseService {
  protected abstract OBSERVE_STATUS: EntryStatus;
  
  constructor(
    protected infra: InfrastructureService,
  ) { }

  async observe() {
    const entries = await this.infra.repo.notion.entry.listByStatus(this.OBSERVE_STATUS);
    for (const entry of entries) await this.handle(entry);
  }

  protected abstract handle(entry: Entry): Promise<void>;

  protected async sendMessage(entry: Entry) {
    // TODO(nontangent): TwitterでDMを送る
  }
}
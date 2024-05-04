import { Injectable } from "@nx-ddd/core/di";
import { EntryService } from "./entry";
import { ScholarshipService } from "./scholarship";
import { SelectionService } from "./entry/selection";
import { CommunityService } from "./community";
import { MessageEventService } from "./message-event";

@Injectable({providedIn: 'root'})
export class UsecaseService {

  constructor(
    public community: CommunityService,
    public messageEvent: MessageEventService,
    public entry: EntryService,
    public scholarship: ScholarshipService,
    public selection: SelectionService,
    ) { }

  async startAutomation() {
    // ツイートから一次選考データの作成
    // console.log('createByTweet');
    // await this.entry.first.createByTweet();
    
    // 一次選考データから選考データの作成
    console.log('firstObserve');
    await this.entry.first.observe();

    // 一次選考の開始
    console.log('firstSelection');
    await this.selection.first.observe();

    // 二次選考データの選考データとの紐付け
    console.log('secondObserve');
    await this.entry.second.observe();

    // 二次選考の開始
    console.log('secondSelection');
    await this.selection.second.observe();

    // 口座情報データと選考データの紐付け
    console.log('bankAccountObserve');
    await this.entry.bankAccount.observe();
  }
}

import { Entry, EntryStatus, FirstEntry, Scholarship } from "@x-lt/common/domain/models/notion";
import { InfrastructureService } from "@x-lt/common/infrastructure";
import { Injectable } from "@nx-ddd/core/di";
import dayjs from 'dayjs';

@Injectable({providedIn: 'root'})
export class ScholarshipService {
  constructor(
    protected infra: InfrastructureService,
  ) { }

  async create(scholarship: Scholarship): Promise<Scholarship> {
    return this.infra.repo.notion.scholarship.create(scholarship);
  }

  async get(scholarshipId: string): Promise<Scholarship> {
    return this.infra.repo.notion.scholarship.get({id: scholarshipId});
  }

  async list(): Promise<Scholarship[]> {
    return this.infra.repo.notion.scholarship.list();
  }

  async update(scholarship: Scholarship): Promise<void> {
    return this.infra.repo.notion.scholarship.update(scholarship);
  }

  async checkEntry(scholarship: Scholarship): Promise<void> {
    const URL = encodeURIComponent(scholarship.tweetUrl);
    const firstEntry = await this.infra.repo.notion.firstEntry.getLatestFirstEntry();
    const sinceId = firstEntry.tweetedAt.isAfter(dayjs().add(-5, 'day')) ? firstEntry.tweetId : null;
    const client = await this.makeCommunityTwitterClient('default');
    const tweets = await this.infra.twitter.searchTweets(client, `url:${URL} is:quote -RT`, sinceId);
    console.debug('tweets:', tweets);

    await Promise.all((tweets ?? []).map(tweet => {
      return this.infra.repo.notion.firstEntry.create(FirstEntry.from<FirstEntry>({
        tweetId: tweet.id,
        title: tweet.text,
        tweetURL: `https://twitter.com/${tweet.author.username}/status/${tweet.id}`,
        authorId: tweet.authorId,
        name: tweet.author.name,
        userName: tweet.author.username,
        tweetedAt: tweet.createdAt,
        scholarshipId: scholarship.id,
      })).then((firstEntry) => {
        return this.infra.repo.notion.entry.create(Entry.from<Entry>({
          title: firstEntry.title,
          status: EntryStatus._201_受付連絡中,
          firstEntryId: firstEntry.id,
          scholarshipId: firstEntry.scholarshipId,
        }));
      });
    }));
  }

  private async makeCommunityTwitterClient(id: string) {
    const community = await this.infra.repo.firestore.community.get({id});
    let token = community.twitter.token;
    if (this.infra.twitter.isExpired(token)) {
      token = await this.infra.twitter.refreshToken(token);
      await this.infra.repo.firestore.community.update({...community, twitter: {token}});
    }
    return this.infra.twitter.getClientV2Next(token);
  }
}

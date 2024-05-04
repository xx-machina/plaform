import { Entry, EntryStatus, SecondEntry } from '@x-lt/common/domain/models/notion';
import { Injectable } from '@nx-ddd/core/di';
import { InfrastructureService } from '@x-lt/common/infrastructure';
import dayjs from 'dayjs';
import ffmpeg from 'fluent-ffmpeg';
import { extname, join, parse, resolve } from 'path';
import { readdirSync } from 'fs';

@Injectable({providedIn: 'root'})
export class SecondEntryService {
  constructor(
    protected infra: InfrastructureService,
  ) { }

  protected lastUpdatedAt: dayjs.Dayjs = dayjs('2022-11-04');

  async observe() {
    // 最終観察時刻以降に変更があったデータを取得
    const results = await this.infra.repo.notion.secondEntry.listByEditedAtAfter(this.lastUpdatedAt);
    
    // 取得した各データに対して処理を実行
    await Promise.all(results.map(result => this.handle(result)));
  }

  async handle(secondEntry: SecondEntry) {
    if (secondEntry.entryIds.length) return;
    await this.linkWithEntry(secondEntry);
  }

  async linkWithEntry(secondEntry: SecondEntry) {
    // TODO(nontangent): scholashipIdを動的に変更できる用に修正
    const scholarship = await this.infra.repo.notion.scholarship.get({id: 'd51c97fe-6fda-451c-9f04-9f60257d101b'});
    const entries = await this.infra.repo.notion.entry.listByTwitterScreenName(secondEntry.twitterId, scholarship.id);
    const entry = entries[0] ?? null;
    
    if(!entry) return;
    if(entry.status !== EntryStatus._204_二次選考応募待ち) return;

    await this.infra.repo.notion.entry.update(Entry.from<Entry>({
      id: entry.id,
      title: entry.title,
      status: EntryStatus._205_二次選考受付連絡中,
      secondEntryIds: [secondEntry.id]
    }));
  }

  async convertVideo() {
    const path = resolve(__dirname, '../../../../../../');
    const SRC_PATH = resolve(path, './videos')
    const DIST_PATH = resolve(path, './dist/videos')
    const EXTENSIONS = ['.mov', '.mp4', '.m4v'];
    const filenames = readdirSync(SRC_PATH)
      .filter(name => EXTENSIONS.includes(extname(name).toLocaleLowerCase()));
    console.debug('filenames:', filenames);

    for (const filename of filenames) {
      const src = join(SRC_PATH, filename);
      const dist = join(DIST_PATH, `${parse(filename).name}.mp4`);
      await this.convertToMp4(src, dist);
      console.log(`変換完了: ${src} => ${dist}`);
    }
    // console.debug('convertVideo start!');
  }

  async convertToMp4(src: string, dist: string) {
    return new Promise((resolve) => {
      ffmpeg(src)
        .duration(140)
        .toFormat('mp4')
        .on('end', () => resolve(null))
        .save(dist);
    });
  }

}


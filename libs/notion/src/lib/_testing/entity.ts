import { NotionConverter } from '../converter';
import { Title, Relation, Status, Formula, RichText } from '../decorators';

export class Entity {
  @Title({name: 'タイトル'})
  title: string;

  @Status({name: 'ステータス'})
  status: string;

  @Relation({name: '一次選考'})
  firstSelectionIds: string[];

  @Formula({name: '一次選考開始文(Discord)'})
  discordFirstSelectionMessage: string;

  @Formula({name: '二次選考開始文(Discord)'})
  discordSecondSelectionMessage: string;

  @RichText({name: 'discordChannelId'})
  discordChannelId: string;

  static from(obj: Partial<Entity>) {
    return Object.assign(new Entity(), {...obj});
  }
}

export class EntityConverter extends NotionConverter<Entity> {
  protected Entity = Entity;
}

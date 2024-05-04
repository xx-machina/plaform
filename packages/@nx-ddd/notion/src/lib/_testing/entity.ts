import { NotionConverter } from '../converter';
import { Title, Relation, Status, Formula, RichText } from '../decorators';

export class Entity {
  @Title('タイトル')
  title: string;

  @Status('ステータス')
  status: string;

  @Relation('一次選考')
  firstSelectionIds: string[];

  @Formula('一次選考開始文(Discord)')
  discordFirstSelectionMessage: string;

  @Formula('二次選考開始文(Discord)')
  discordSecondSelectionMessage: string;

  @RichText('discordChannelId')
  discordChannelId: string;

  static from(obj: Partial<Entity>) {
    return Object.assign(new Entity(), {...obj});
  }
}

export class EntityConverter extends NotionConverter<Entity> {
  protected Entity = Entity;
}

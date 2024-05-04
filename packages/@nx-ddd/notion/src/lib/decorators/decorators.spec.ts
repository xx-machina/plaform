import { NOTION_ANNOTATIONS } from './decorators';
import { Entity } from './_testing/entity';

describe('Decorators', () => {
  it('Title', () => {
    const expected = [
      {type: 'title', fieldName: 'タイトル', propName: 'title'},
      {type: 'status', fieldName: 'ステータス', propName: 'status'},
      {type: 'relation', fieldName: '一次選考', propName: 'firstSelectionIds'},
      {type: 'formula', fieldName: '一次選考開始文(Discord)', propName: 'discordFirstSelectionMessage'},
      {type: 'formula', fieldName: '二次選考開始文(Discord)', propName: 'discordSecondSelectionMessage'},
      {type: 'rich_text', fieldName: 'discordChannelId', propName: 'discordChannelId'},
    ];
    expect(Entity[NOTION_ANNOTATIONS]).toEqual(expected);
  });
});

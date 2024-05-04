import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { EntityConverter, Entity } from '../_testing/entity';

describe('NotionConverter', () => {
  const converter = new EntityConverter();

  it('toNotion()', () => {
    const expected = {
      タイトル: [{text: {content: 'example-title'}}],
      ステータス: {name: 'example-status-01'},
      一次選考: [{id: 'example-relation-01'}],
      discordFirstSelectionMessage: 'example-formula-message',
      discordSecondSelectionMessage: 'example-formula-message',
    };
  
    const entity = Entity.from({
      title: 'example-title',
      status: 'example-status-01',
      firstSelectionIds: ['example-relation-01'],
    });

    expect(converter.toNotion(entity)).toEqual(expected);
  });

  describe('fromNotion', () => {
    const input: PageObjectResponse = {
      properties: {
        タイトル: {
          id: '',
          type: 'title',
          title: [
            { 
              type: 'text',
              text: {
                content: 'example-title-01',
                link: {url: ''},
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: null,
              },
              plain_text: 'example-title-01',
              href: null,
            }
          ],
        },
        ステータス: {
          id: 'test',
          type: 'status',
          status: {
            id: 'uuid',
            name: 'example-status-01',
            color: 'default',
          }
        },
        一次選考: {
          id: 'test',
          type: 'relation',
          relation: [{id: 'example-relation-01'}],
          // has_more: false,
        },
        fomula: {
          id: '%3Ejm',
          type: 'formula',
          formula: {
            type: 'string',
            string: 'example-formula-text',
          },
        }
      }
    } as any;

    const expected = Entity.from({
      title: 'example-title-01',
      status: 'example-status-01',
      firstSelectionIds: ['example-relation-01'],
    });
    expect(converter.fromNotion(input)).toEqual(expected);
  });
});

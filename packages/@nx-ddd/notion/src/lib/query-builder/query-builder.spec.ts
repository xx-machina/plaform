import dayjs from "dayjs";
import { Formula, Rollup, Timestamp, Number, Status } from "../decorators";
import { Entity as _Entity } from "../entity";
import { Query } from '../query';
import { NotionQueryBuilder } from './query-builder';

class Entity extends _Entity {
  @Rollup({name: '表示名'})
  screenName: string;

  @Formula({name: '合計'})
  sum: string;

  @Timestamp({name: 'last_edited_time'})
  lastEditedTime: dayjs.Dayjs;

  @Number({name: '回数'})
  count: number;

  @Status({name: 'ステータス'})
  status: string;
}

describe('Query', () => {
  const { And, Filter } = Query(Entity);

  describe('NotionFilter', () => {
    describe('RollUp', () => {
      it('', () => {
        expect(Filter('screenName', '==', 'nontangent').build()).toEqual({
          property: '表示名',
          rollup: { every: { rich_text: { equals: 'nontangent' } } },
        });
      });
    });

    describe('LastEditedTime', () => {
      it('', () => {
        expect(Filter('lastEditedTime', '>', '2022').build()).toEqual({
          timestamp: 'last_edited_time',
          last_edited_time: {after: '2022'},
        });
      });
    });

    describe('Status', () => {
      it('', () => {
        expect(Filter('status', '==', 'wip').build()).toEqual({
          property: 'ステータス',
          status: {equals: 'wip'} 
        });
      });
    });
  });

  describe('NotionAnd', () => {
    it('', () => {
      expect(And(Filter('screenName', '==', 'nontangent'), Filter('status', '==', 'wip')).build()).toEqual({
        and: [
          {
            property: '表示名',
            rollup: {
              every: { rich_text: { equals: 'nontangent' } },
            },
          },
          {
            property: 'ステータス',
            status: {equals: 'wip'} 
          },
        ]
      })
    })
  });
});

describe('QueryBuilder', () => {
  const builder = new NotionQueryBuilder();
  const { And, Filter } = Query(Entity);

  it('', () => {
    expect(builder.build(Filter('screenName', '==', 'nontangent'))).toEqual({
      filter: {
        and: [
          {
            property: '表示名',
            rollup: {
              every: { rich_text: { equals: 'nontangent' } },
            },
          },
        ],
      },
    });

    expect(builder.build(And(Filter('screenName', '==', 'nontangent')))).toEqual({
      filter: {
        and: [
          {
            property: '表示名',
            rollup: {
              every: { rich_text: { equals: 'nontangent' } },
            },
          },
        ],
      },
    });
  });
});


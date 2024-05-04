import { reconstruct, flattenExcludeDayjs } from './walk-obj';
import dayjs from 'dayjs';

describe('reconstruct', () => {
  it('should be defined', () => {
    expect(reconstruct({
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 'exclude',
      },
      items: [
        'test',
      ],
    }, (paths, value) => {
      if (paths.join('.') === 'd.e') return [true, undefined];
      return [false];
    })).toEqual({
      a: 1,
      b: 2,
      c: 3,
      items: [
        'test',
      ]
    });
  });
})

describe('flattenExcludeDayjs', () => {
  it('should be defined', () => {
    expect(flattenExcludeDayjs({
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: dayjs('2023-01-01'),
      },
      items: [
        'test',
      ],
    })).toEqual({
      a: 1,
      b: 2,
      c: 3,
      'd.e': dayjs('2023-01-01').toISOString(),
      'items.0': 'test',
    });
  });
});

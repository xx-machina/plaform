import { Entity } from '@nx-ddd/common/domain/models';
import { Converter } from '@nx-ddd/common/infrastructure';

export class IndexedDbConverter<E extends Entity> extends Converter<E> {
  fromRecord(): E {
    throw new Error('Not implemented!');
  }

  toRecord(): any {
    throw new Error('Not implemented!');
  }
}
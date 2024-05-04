export abstract class Converter<E> {
  abstract fromRecord(record: object): E
  abstract toRecord(entity: E): object
}

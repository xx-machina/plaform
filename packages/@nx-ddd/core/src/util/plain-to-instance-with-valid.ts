import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { reconstructAsISOString } from './walk-obj';

export function plainToInstanceWithValid<T extends object>(cls: ClassConstructor<T>, plain: object) {
    const instance = plainToInstance(cls, reconstructAsISOString(plain));
    const errors = validateSync(instance);
    if (errors.length) throw errors;
    return instance;
}

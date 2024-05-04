import { Injectable } from "@nx-ddd/core";
import { RedisRepository } from '../../redis';
import { Operator } from "@x-x-machina/common/domain/models";

@Injectable({providedIn: 'root'})
export class OperatorRepository extends RedisRepository<Operator> {
  protected entityName: string = 'operator';
}

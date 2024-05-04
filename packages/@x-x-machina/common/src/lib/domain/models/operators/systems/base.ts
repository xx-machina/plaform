import { Operator, OperatorType } from "../base";

export interface SystemOperator extends Operator {
  type: OperatorType.SYSTEM;
  kind: 'graphql' | 'rest';
}

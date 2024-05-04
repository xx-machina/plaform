import { SystemOperator } from './base';

export interface GraphqlOperator extends SystemOperator {
  kind: 'graphql';
  endpoint: string;
}

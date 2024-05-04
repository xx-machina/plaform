import { SystemOperator } from "./base";

export interface RestOperator extends SystemOperator {
  kind: 'rest';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}
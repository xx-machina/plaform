import { Operator, OperatorType } from '../base';

export interface AssistantOperator extends Operator {
  type: OperatorType.ASSISTANT;
}

export const GRAPHQL_QUERY_MAKER: AssistantOperator = {
  id: 'graphql-query-maker',
  type: OperatorType.ASSISTANT,
  name: 'graphql-query-maker',
  description: 'Make a graphql query',
  inputInterfaceId: 'interfaces:default:plain',
  outputInterfaceId: 'interfaces:default:graphql',
}

export * from './operators';
export * from './project';

export interface Context {
  id: string;
  instructions: string;
  context: string;
  embedding?: number[];
  score?: number;
}

export * from './spec';

export interface OperatorTags {
  id: string;
  operatorId: string;
  tag: string;
}

export interface Interface {
  id: string;
  type: 'plain' | 'markdown' | 'graphql' | 'json';
}

export interface Connector {
  id: string;
  type: 'azure-bot' | 'discord';
  inputId: string;
  inputInterfaceId: string; 
  output: string;
  outputInterfaceId: string;
}

export interface AzureConnector extends Connector {

}

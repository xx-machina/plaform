export enum OperatorType {
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  WORKFLOW = 'workflow',
}

export interface Operator {
  id: string;
  type: OperatorType;
  
  name: string;
  description: string;

  inputInterfaceId: string;
  outputInterfaceId: string; 
}

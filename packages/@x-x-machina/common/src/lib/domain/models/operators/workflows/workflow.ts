import { Operator, OperatorType } from "../base";

export interface WorkflowOperator extends Operator {
  type: OperatorType.WORKFLOW;
  workflow: {
    name: string;
    operatorId: string;
    input: string;
  }[]
}

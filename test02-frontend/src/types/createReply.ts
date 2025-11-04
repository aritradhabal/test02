export type OperationType = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE";

export type CreateReplyDto = {
  parentId: string;
  operationType: OperationType;
  rightHandNumber: number;
};

export type CreateReplyResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

import { OperationType } from "./createReply";

export interface Comment {
  id: string;
  authorId: string;
  parentId: string | null;
  resultValue: number;
  operationType: OperationType | null;
  rightHandNumber: number | null;
  createdAt: string;
  author: {
    username: string;
  };
  replies?: Comment[];
}

export type CreatePostDto = {
  startingNumber: number;
};

export type CreatePostResponse = {
  success: boolean;
  error: string | null;
  data: string | null;
};

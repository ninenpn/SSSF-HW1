type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UploadResponse = MessageResponse & {
  id: number;
};

export {MessageResponse, ErrorResponse, UploadResponse};

// utils/sendResponse.ts
interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: object;
}

export const sendResponse = <T>(
  res: any,
  {
    statusCode = 200,
    success = true,
    message,
    data,
    meta,
  }: IApiResponse<T> & { statusCode?: number }
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    ...(meta && { meta }),
  });
};

// Example response structure:
// {
//   "success": true,
//   "message": "User created successfully",
//   "data": {
//     "email": "example@email.com",
//     "name": "John Doe",
//     ...
//   }
// }

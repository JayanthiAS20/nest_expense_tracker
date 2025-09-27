/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * @description common response function to send the success & error data
 * @param res
 * @param statusCode
 * @param data
 * @param message
 * @param submessage
 * @returns
 */
export function apiResponse(
  res: any,
  statusCode: number,
  data: any,
  message: string | null = null,
  success: boolean = false,
  submessage: string | null = null,
): any {
  return res.status(statusCode).json({
    ...data,
    success,
    message,
    submessage,
  });
}

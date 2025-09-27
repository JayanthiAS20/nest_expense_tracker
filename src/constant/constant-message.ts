export const MessageContent = {
  USER_DOESNT_EXIST: (field: string) => `${field} doesn't exist`,
  CREATE_UPDATE_DELETE_FETCHED_SUCCESS: (field1: string, field2: string) =>
    `${field1} ${field2} successfully`,
  USER_EXIST: (field: string) => `${field} exist`,
  MOBILE_NUMBER_ALREADY_EXIST: `Mobile number already exist`,
  INVALID: (field: string) => `Invalid ${field}`,
  LOGIN_SUCCESS: `Login Success`,
};

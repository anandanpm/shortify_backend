export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}
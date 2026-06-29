export interface ApiResponse<T> {
  result: T;
  status: string;
  message: string;
}

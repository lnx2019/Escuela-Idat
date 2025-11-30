export interface DynamicResponse<T = any> {
  success: boolean;
  route: string;
  data: T;
}
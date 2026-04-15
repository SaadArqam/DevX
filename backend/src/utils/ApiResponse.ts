export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;

  constructor(statusCode: number, data: T, message: string = "Success", meta?: any) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}

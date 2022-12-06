export class IResponse {
  success: boolean;
  message: string;
  data: any;

  constructor() {
    this.success = false;
    this.message = '';
  }
}

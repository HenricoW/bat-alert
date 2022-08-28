import { Panic } from "./app.types";

export interface LoginResponseData {
  api_access_token: string;
}
export interface NewPanicResponseData {
  panic_id: number;
}
export interface PanicListResponseData {
  panics: Panic[];
}

export interface ApiResponse {
  status: "success" | "error";
  message: string;
  //   data: LoginResponseData | NewPanicResponseData | PanicListResponseData | {};
  data: any;
}

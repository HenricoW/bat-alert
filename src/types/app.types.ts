export interface PanicStatus {
  id: 1 | 2 | 3;
  name: "In progress" | "Cancelled" | "Resolved";
}

export interface Panic {
  id: number;
  longitude: string;
  latitiude: string;
  panic_type: string;
  details: string;
  created_at: string;
  status: PanicStatus["name"];
}

export interface User {
  access_token: string;
}

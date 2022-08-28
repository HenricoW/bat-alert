export interface PanicStatus {
  id: 1 | 2 | 3;
  name: "In progress" | "Cancelled" | "Resolved";
}

export interface Panic {
  id: number;
  longitude: string;
  latitude: string;
  panic_type: string;
  details: string;
  created_at: string;
  status: PanicStatus;
}

export interface User {
  access_token: string;
}

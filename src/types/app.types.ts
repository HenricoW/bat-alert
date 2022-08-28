export interface PanicStatus {
  id: 1 | 2 | 3;
  name: "In progress" | "Cancelled" | "Resolved";
}

export interface NewPanic {
  longitude: string;
  latitude: string;
  panic_type: string;
  details: string;
}

export interface Panic extends NewPanic {
  id: number;
  created_at: string;
  status: PanicStatus;
}

export interface User {
  access_token: string;
}

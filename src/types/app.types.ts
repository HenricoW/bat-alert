export interface PanicStatusField {
  id: 1 | 2 | 3;
  name: "In Progress" | "Canceled" | "Resolved";
}

export enum PanicStatus {
  "In Progress" = 1,
  "Canceled",
  "Resolved",
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
  status: PanicStatusField;
}

export interface User {
  access_token: string;
}

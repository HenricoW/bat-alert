import { baseURL } from "../config";
import store from "../store/store";
import type { ApiResponse } from "../types/api.types";
import type { NewPanic, Panic, PanicStatus } from "../types/app.types";

const getUserToken = () => {
  const storeToken = store.getState().user.token_id;
  if (!storeToken) {
    // TODO: check in localStorage
    return "";
  }

  return storeToken;
};

export const getPanics = async (status_id?: PanicStatus) => {
  const userToken = getUserToken();

  try {
    const resp = await fetch(baseURL + "panic/history", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(status_id ? { status_id } : {}),
    });

    return (await resp.json()) as ApiResponse;
  } catch (error: any) {
    console.log("Error fetching panic data:", error);
    throw Error(error.message.includes("Failed to fetch") ? "You may be offline" : "Error fetching panic data");
  }
};

export const raisePanic = async (values: NewPanic) => {
  const userToken = getUserToken();
  console.log(values);

  try {
    const resp = await fetch(baseURL + "panic/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(values),
    });

    return (await resp.json()) as ApiResponse;
  } catch (error: any) {
    console.log("Error raising panic:", error);
    throw Error(error.message.includes("Failed to fetch") ? "You may be offline" : "Error raising panic");
  }
};

export const reversePanics = (panicList: Panic[]) => [...panicList].reverse();

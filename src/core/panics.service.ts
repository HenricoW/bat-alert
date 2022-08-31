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

const fetchPanic = async (endPoint: string, data?: any) => {
  const userToken = getUserToken();

  try {
    const resp = await fetch(endPoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data ? data : {}),
    });

    return (await resp.json()) as ApiResponse;
  } catch (error) {
    throw error;
  }
};

const panicError = (error: any, message: string) => {
  return Error(error.message.includes("Failed to fetch") ? "You may be offline" : message);
};

export const getPanics = async (status_id?: PanicStatus) => {
  try {
    const apiResponse = await fetchPanic(baseURL + "panic/history", { status_id });
    const latestFirst = reversePanics(apiResponse.data.panics);

    return { ...apiResponse, data: { panics: latestFirst } } as ApiResponse;
  } catch (error: any) {
    console.log("Error fetching panic data:", error);
    throw panicError(error, "Error fetching panic data");
  }
};

export const raisePanic = async (values: NewPanic) => {
  try {
    const apiResponse: ApiResponse = await fetchPanic(baseURL + "panic/send", values);
    return apiResponse;
  } catch (error: any) {
    console.log("Error raising panic:", error);
    throw panicError(error, "Error raising panic");
  }
};

export const reversePanics = (panicList: Panic[]) => [...panicList].reverse();

export const cancelPanic = async (panicId: number) => {
  try {
    const apiResponse: ApiResponse = await fetchPanic(baseURL + "panic/cancel", { panic_id: panicId });
    return apiResponse;
  } catch (error: any) {
    console.log("Error cancelling panic:", error);
    throw panicError(error, "Error raising panic");
  }
};

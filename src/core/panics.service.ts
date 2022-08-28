import { baseURL } from "../config";
import store from "../store/store";
import { ApiResponse } from "../types/api.types";

const getUserToken = () => {
  const storeToken = store.getState().user.token_id;
  if (!storeToken) {
    // TODO: check in localStorage
    return "";
  }

  return storeToken;
};

export const getPanics = async () => {
  const userToken = getUserToken();

  try {
    const resp = await fetch(baseURL + "panic/history", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    return (await resp.json()) as ApiResponse;
  } catch (error: any) {
    console.log("Error fetching panic data:", error);
    throw Error(error.message.includes("Failed to fetch") ? "You may be offline" : "Error fetching panic data");
  }
};

import { baseURL } from "../config";
import { userActions } from "../store/slices/userSlice";
import store from "../store/store";
import { ApiResponse } from "../types/api.types";

export const saveUserToken = (token: string) => {
  store.dispatch(userActions.logIn(token));

  // TODO: Add localStorage? => persist between refreshes
};

export const loginRequest = async (email: string, password: string) => {
  try {
    const resp = await fetch(baseURL + "login", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const respBody = (await resp.json()) as ApiResponse;
    if (respBody.status === "error") {
      return { status: respBody.status, message: respBody.message };
    } else {
      saveUserToken(respBody.data.api_access_token);
      return { status: respBody.status, message: "Successfully logged in" };
    }
  } catch (error: any) {
    console.log("Error logging in:", error);
    throw Error(error.message.includes("Failed to fetch") ? "You may be offline" : "Error logging in");
  }
};

export const logUserOut = () => {
  store.dispatch(userActions.logOut());

  // TODO: unset localStorage token
};

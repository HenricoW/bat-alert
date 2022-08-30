import dotenv from "dotenv-safe";
import store from "../store/store";
import { loginRequest } from "./user.service";

dotenv.config();

const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

xdescribe("User service", () => {
  describe("Login", () => {
    it("Should NOT save an access token for invalid credentials", async () => {
      const response = await loginRequest("aa@b.c", "laskdjf");
      expect(response.status).toBe("error");

      const access_token = store.getState().user.token_id;
      expect(access_token).toBe("");
    });

    it("Should save an access token for correct credentials", async () => {
      const response = await loginRequest(email, password);
      expect(response.status).toBe("success");

      const access_token = store.getState().user.token_id;
      expect(typeof access_token).toBe("string");
      expect(access_token.length).toBeGreaterThan(10);
    });

    // not testing missing fields, will check in UI tests for those error cases
  });
});

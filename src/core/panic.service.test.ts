import dotenv from "dotenv-safe";

import { userActions } from "../store/slices/userSlice";
import store from "../store/store";
import { getPanics } from "./panics.service";
import { PanicStatus } from "../types/app.types";

dotenv.config();

describe("Panic service", () => {
  beforeAll(() => {
    const token = process.env.API_TOKEN || "";
    store.dispatch(userActions.logIn(token));
  });

  describe("Get panic history", () => {
    it("Should return all panics", async () => {
      const response = await getPanics();
      const data = response.data;

      expect(data).toBeDefined();
      expect(Array.isArray(data.panics)).toBe(true);
      expect(data.panics.length).toBeGreaterThan(0);
    });

    it("Should return only In progress panics", async () => {
      const response = await getPanics(PanicStatus["In Progress"]);
      const data = response.data;
      expect(data).toBeDefined();
      expect(data.panics).toBeDefined();

      const thePanics = data.panics;
      expect(Array.isArray(thePanics)).toBe(true);
      expect(thePanics.length).toBeGreaterThan(0);

      for (let i = 0; i < thePanics.length; i++) {
        expect(thePanics[i].status.name).toEqual("In Progress");
      }
    });

    it("Should return only Cancelled panics", async () => {
      const response = await getPanics(PanicStatus["Canceled"]);
      const data = response.data;
      expect(data).toBeDefined();
      expect(data.panics).toBeDefined();

      const thePanics = data.panics;
      expect(Array.isArray(thePanics)).toBe(true);
      expect(thePanics.length).toBeGreaterThan(0);

      for (let i = 0; i < thePanics.length; i++) {
        expect(thePanics[i].status.name).toEqual("Canceled");
      }
    });

    it("Should return no panics", async () => {
      const response = await getPanics(PanicStatus["Resolved"]);
      const data = response.data;
      expect(data).toBeDefined();
      expect(data.panics).toBeDefined();

      const thePanics = data.panics;
      expect(Array.isArray(thePanics)).toBe(true);
      expect(thePanics.length).toEqual(0);
    });
  });
});

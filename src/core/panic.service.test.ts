import dotenv from "dotenv-safe";

import { userActions } from "../store/slices/userSlice";
import store from "../store/store";
import { cancelPanic, getPanics } from "./panics.service";
import { Panic, PanicStatus } from "../types/app.types";

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

  describe("Cancel panic", () => {
    it("Should cancel a panic by id", async () => {
      const response = await getPanics();
      const panicList = response.data.panics as Panic[];

      // get 1st 'in progress' panic's id
      const thePanic = panicList.find((panic) => panic.status.name === "In Progress");

      const response2 = await cancelPanic(thePanic?.id || 0);
      expect(response2.status).toBe("success");

      const response3 = await getPanics();
      const panicList2 = response3.data.panics as Panic[];

      // check that panic's status was updated
      const thePanic2 = panicList2.find((panic) => panic.id === thePanic?.id);
      expect(thePanic2?.status.name).toBe("Canceled");
    });

    it.todo("Should leave already cancelled panics unchanged");
  });
});

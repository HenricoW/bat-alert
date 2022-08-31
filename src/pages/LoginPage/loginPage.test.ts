import puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";
import dotenv from "dotenv-safe";
dotenv.config();

const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

describe("Dashboard page", () => {
  let browser: Browser, page: Page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 35,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[name=email]");
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("Login page", () => {
    jest.setTimeout(10_000);

    it("Should show error help text for a missing email", async () => {
      await page.click("input[name=email]");
      await page.click("input[name=password]");

      const helperTextElement = await page.$("p#email-helper-text");
      expect(helperTextElement).toBeDefined();
      expect(await page.$eval("p#email-helper-text", (el) => el.textContent)).toBe("E-mail required");
      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(true);
    });

    it("Should show error help text for a missing password", async () => {
      await page.click("input[name=password]");
      await page.click("input[name=email]");

      const helperTextElement = await page.$("p#password-helper-text");
      expect(helperTextElement).toBeDefined();
      expect(await page.$eval("p#password-helper-text", (el) => el.textContent)).toBe("Password required");
      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(true);
    });

    it("Should show error help text for an invalid email", async () => {
      await page.click("input[name=email]");
      await page.keyboard.type("aaaaaa");

      const helperTextElement = await page.$("p#email-helper-text");
      expect(helperTextElement).toBeDefined();
      expect(await page.$eval("p#email-helper-text", (el) => el.textContent)).toBe("Invalid e-mail");
      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(true);
    });

    it("Should show an error message when using invalid credentials", async () => {
      await page.click("input[name=email]");
      await page.keyboard.type("a@b.c");
      await page.click("input[name=password]");
      await page.keyboard.type("alksjioe");

      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(false);
      await page.click("button[type=submit]");

      await page.waitForSelector(".MuiAlert-message");
      expect(await page.$eval(".MuiAlert-message", (el) => el.textContent)).toBe(
        "Incorrect login details. Please try again."
      );
    });

    it("Should sign in", async () => {
      await page.click("input[name=email]");
      await page.keyboard.type(email);
      await page.click("input[name=password]");
      await page.keyboard.type(password);

      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(false);
      await page.click("button[type=submit]");

      await page.waitForSelector("button#panicHistory");
      // look for element only on dashboard page
      expect(await page.$eval("button#panicHistory", (btn) => btn.textContent)).toEqual("Refresh history");
    });

    it("Should sign out", async () => {
      await page.click("button#logout-btn");
      await page.click("button[type=submit]");

      await page.waitForSelector("button[type=submit]");
      // look for element only on dashboard page
      expect(await page.$eval("button[type=submit]", (btn) => btn.textContent)).toEqual("Sign In");
      // @ts-ignore
      expect(await page.$eval("button[type=submit]", (el) => el.disabled)).toBe(true);
    });
  });
});

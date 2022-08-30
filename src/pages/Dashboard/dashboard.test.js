import puppeteer from "puppeteer";
// import type { Browser, Page } from "puppeteer";
import dotenv from "dotenv-safe";
dotenv.config();

const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

describe("Dashboard page", () => {
  let browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 35,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[name=email]");

    await page.focus("input[name=email]");
    await page.keyboard.type(email);
    await page.focus("input[name=password]");
    await page.keyboard.type(password);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("Panic detail view", () => {
    jest.setTimeout(10_000);

    it("Should sign in", async () => {
      expect(await page.$eval("button[type=submit]", (btn) => btn.textContent)).toEqual("Sign In");
      expect(await page.$eval("button[type=submit]", (btn) => btn.disabled)).toBe(false);

      await page.click("button[type=submit]");
      await page.waitForNavigation();
    });

    let panicText;
    it("Shows panic list button", async () => {
      expect(await page.$eval("button#panicHistory", (btn) => btn.textContent)).toEqual("Refresh history");
      await page.click("button#panicHistory");
      await page.waitForSelector("tbody tr");
      panicText = await page.$eval("tbody tr td", (cell) => cell.textContent);
    });

    it("Shows modal when clicking on title in panic list", async () => {
      await page.waitForTimeout(300);
      await page.click("tbody tr td");
      await page.waitForSelector("h5#panicTitle");
      // await page.screenshot({ path: "capture.png" });

      expect(await page.$eval("#panicTitle", (el) => el.textContent)).toEqual(panicText);
    });

    it("Closes panic modal", async () => {
      expect(await page.$eval("#closeDetail", (el) => el.textContent)).toEqual("Close");
      await page.click("#closeDetail");

      expect(await page.$("#panicDetail")).toBe(null);
    });

    it("Should show a 'Cancel Panic' button on 'in progress' panics", async () => {
      await page.click("#history-type-select");
      await page.click("li[data-value='In Progress']");
      await page.waitForTimeout(500);
      await page.click("button#panicHistory");
      await page.waitForTimeout(500);

      await page.click("tbody tr td");
      await page.waitForSelector("h5#panicTitle");

      expect((panicText = await page.$eval("#panicStatus", (el) => el.textContent))).toMatch("In Progress");
      expect((panicText = await page.$eval("#cancelPanic", (el) => el.textContent))).toMatch("Cancel Panic");

      await page.click("#closeDetail");
    });

    it("Should NOT show a 'Cancel Panic' button on cancelled panics", async () => {
      await page.click("#history-type-select");
      await page.click("li[data-value='Canceled']");
      await page.waitForTimeout(500);
      await page.click("button#panicHistory");

      await page.waitForTimeout(500);
      await page.click("tbody tr td");
      await page.waitForSelector("h5#panicTitle");

      expect((panicText = await page.$eval("#panicStatus", (el) => el.textContent))).toMatch("Canceled");
      expect(await page.$("#cancelPanic")).toBe(null);

      await page.click("#closeDetail");
    });

    xit("Should cancel a panic when clicking 'Cancel Panic'", async () => {
      await page.waitForTimeout(300);
      await page.click("#history-type-select");
      await page.click("li[data-value='In Progress']");
      await page.waitForTimeout(300);
      await page.click("button#panicHistory");

      await page.waitForTimeout(500);
      await page.click("tbody tr td");
      await page.waitForSelector("h5#panicTitle");

      expect((panicText = await page.$eval("#panicStatus", (el) => el.textContent))).toMatch("In Progress");
      expect((panicText = await page.$eval("#cancelPanic", (el) => el.textContent))).toMatch("Cancel Panic");

      await page.click("#closeDetail");
    });
  });
});

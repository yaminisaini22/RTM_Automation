const { Builder, By, Key, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");
const fs = require("fs");
const sharp = require("sharp");

async function loginToJira(driver) {
  await driver.get(
    "https://id.atlassian.com/login?prompt=login&continue=https%3A%2F%2Firdeto.atlassian.net"
  );
  await driver.sleep(10000);

  // Wait for the email input and enter the email
  await driver.wait(until.elementLocated(By.id("username")), 10000);
  const usernameInput = await driver.findElement(By.id("username"));
  await usernameInput.sendKeys("yamini.saini@irdeto.com", Key.RETURN);

  // Wait for the continue button and click it
  await driver.wait(until.elementLocated(By.id("login-submit")), 10000);
  const continueButton = await driver.findElement(By.id("login-submit"));
  await continueButton.click();
  await driver.sleep(10000);
}

async function generateReport(driver) {
  await driver.get(
    "https://irdeto.atlassian.net/plugins/servlet/ac/com.deviniti.atlassian.apps.rtm/tce-report?project.key=AAAE&project.id=24415"
  );
  await driver.sleep(20000);

  // Locate the iframe and switch to it
  const iframes = await driver.findElements(By.tagName("iframe"));
  for (let iframe of iframes) {
    await driver.switchTo().frame(iframe);
    try {
      const inputElement = await driver.findElement(
        By.xpath("//input[@id='react-select-11-input']")
      );
      if (inputElement) {
        console.log("Element found inside iframe");
        await inputElement.click(); // Click on the input field to open the dropdown
        await inputElement.sendKeys("AAAE-");
        await driver.sleep(2000); // Short wait to ensure dropdown options load

        // Wait for the dropdown menu to appear
        const dropdownMenu = await driver.wait(
          until.elementLocated(By.css(".css-x50wjx-menu")),
          10000
        );
        await driver.wait(until.elementIsVisible(dropdownMenu), 10000);

        // Locate the first suggestion and click it
        const firstSuggestion = await driver.findElement(
          By.xpath("//div[@role='option']")
        );
        await driver.wait(until.elementIsVisible(firstSuggestion), 10000);
        await firstSuggestion.click();

        // Locate the "Generate" button within the same iframe using its class name
        const generateButton = await driver.wait(
          until.elementLocated(By.css(".css-1yeatxf")),
          30000
        );
        await generateButton.click();

        // Wait for the report to generate
        await driver.wait(
          until.elementLocated(By.css(".sc-LzLrR.hZDVwN")),
          30000
        ); // Wait for the report element

        // Scroll to a specific position on the page before taking the screenshot
        await driver.executeScript("window.scrollTo(10, 610);");

        // Take a screenshot of the generated report
        const reportScreenshot = await driver.takeScreenshot();
        await driver.sleep(2000);
        await driver.executeScript("window.scrollTo(10, 1500);");
        await driver.sleep(2000);
        const testcasescreenshot = await driver.takeScreenshot();
        await driver.sleep(2000);

        const nextButton = await driver.wait(
          until.elementLocated(By.css(".css-9snh2d")),
          30000
        );
        await nextButton.click();
        const testcasescreenshot1 = await driver.takeScreenshot();
        await driver.sleep(2000);

        // Crop and resize the screenshots
        const croppedReportScreenshot = await sharp(
          Buffer.from(reportScreenshot, "base64")
        )
          .extract({
            left: 90,
            top: 70,
            width: 1000,
            height: 780,
          })
          .resize({ width: 650 })
          .jpeg({ quality: 90, progressive: true })
          .toFile("generated_report_screenshot.png");

        const croppedTestcaseScreenshot = await sharp(
          Buffer.from(testcasescreenshot, "base64")
        )
          .extract({
            left: 30,
            top: 70,
            width: 1050,
            height: 700,
          })
          .resize({ width: 650 })
          .jpeg({ quality: 90, progressive: true })
          .toFile("generated_test_case_screenshot.png");

        const croppedTestcaseScreenshot1 = await sharp(
          Buffer.from(testcasescreenshot1, "base64")
        )
          .extract({
            left: 30,
            top: 200,
            width: 1050,
            height: 550,
          })
          .resize({ width: 650 })
          .jpeg({ quality: 90, progressive: true })
          .toFile("generated_test_case_screenshot1.png");

        console.log(
          "Report screenshot saved to generated_report_screenshot.png"
        );
        console.log(
          "Test case screenshot saved to generated_test_case_screenshot.png"
        );

        return {
          reportImagePath: "generated_report_screenshot.png",
          testcaseImagePath: "generated_test_case_screenshot.png",
          testcaseImagePath1: "generated_test_case_screenshot1.png",
        };
      }
    } catch (e) {
      // Element not found in this iframe, continue to the next iframe
      console.error("Error:", e);
      await driver.switchTo().defaultContent();
    }
  }

  await driver.sleep(5000); // Additional wait to ensure the report is fully loaded if necessary
}

module.exports = { generateReport, loginToJira };

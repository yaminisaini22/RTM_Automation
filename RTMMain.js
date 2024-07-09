const fs = require("fs");
const path = require("path");
const {
  fetchTestPlanPayload,
  createTestExecution,
  moveTestExecutionToFolder,
} = require("./src/RTM_Automation/RTMAPI.ts");
const {
  executeAndGetTestDetails,
} = require("./src/RTM_Automation/RTM_to_get_the_tree.ts");
// Test key of the new folder
const keyFilePath = path.resolve(__dirname, "testExecutionKey.json"); // Path to store the key

async function initializeTestExecution() {
  try {
    const { lastTestKey, testPlanId } = await executeAndGetTestDetails();
    console.log("lasttestkey", lastTestKey);
    console.log("testplanid", testPlanId);
    const payload = await fetchTestPlanPayload(testPlanId);
    console.log("payloas", payload);
    const testExecution = await createTestExecution(payload);
    console.log("testexecution", testExecution);
    const testExecutionKey = testExecution.testKey;
    console.log("testexecutionkeyu", testExecutionKey);
    await moveTestExecutionToFolder(testExecutionKey, lastTestKey);
    // Store the key in a file
    fs.writeFileSync(
      keyFilePath,
      JSON.stringify({ testExecutionKey }),
      "utf-8"
    );

    console.log("Process completed successfully");
    return testExecutionKey;
  } catch (error) {
    console.error("An error occurred during the process:", error);
    throw error;
  }
}

initializeTestExecution();

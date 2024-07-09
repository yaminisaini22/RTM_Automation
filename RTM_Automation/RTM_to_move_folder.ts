import axios, { AxiosError } from "axios";
test("Time to Get Irdeto Message", async () => {
  async function moveTestExecutionToFolder(
    testExecutionId: string,
    newFolderTestKey: string,
    apiKey: string
  ) {
    try {
      // Fetch details of the test execution to get its current folder ID
      const response = await axios.get(
        `https://rtm-api.hexygen.com/api/v2/test-execution/${testExecutionId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const currentFolderId = response.data.parentTestKey;

      // Fetch the new folder details using its test key
      const folderResponse = await axios.get(
        `https://rtm-api.hexygen.com/api/tree/${newFolderTestKey}/folder`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newFolderId = folderResponse.data.testKey;

      // Update the test execution with the new folder ID
      await axios.put(
        `https://rtm-api.hexygen.com/api/v2/test-execution/${testExecutionId}`,
        {
          parentTestKey: newFolderId,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `Test execution ${testExecutionId} moved to folder ${newFolderId}`
      );
    } catch (error) {
      console.error("Error moving test execution:", error);
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        console.error("Error response:", axiosError.response?.data);
      }
    }
  }

  // Example usage:
  const testExecutionId = "AAAE-1095"; // ID of the test execution to be moved
  const newFolderTestKey = "F-AAAE-TE-2"; // Test key of the new folder
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC"; // Replace with your actual API key
  moveTestExecutionToFolder(testExecutionId, newFolderTestKey, apiKey);
});

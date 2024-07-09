import axios, { AxiosResponse, AxiosError } from "axios";

// Define the base URL for the RTM API
const baseURL = "https://rtm-api.hexygen.com/api";

// Define your API key
const apiKey =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

// Define types for the payload and responses
interface Payload {
  testKey: string;
  [key: string]: any;
}

interface TestExecution {
  testKey: string;
  [key: string]: any;
}

interface FolderResponse {
  testKey: string;
  [key: string]: any;
}

/**
 * Fetch the payload data of a test plan
 * @param {string} testPlanId
 * @returns {Promise<Payload>}
 */
export async function fetchTestPlanPayload(
  testPlanId: string
): Promise<Payload> {
  try {
    const response: AxiosResponse<Payload> = await axios.get(
      `${baseURL}/test-plan/${testPlanId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch test plan payload");
    }
  } catch (error) {
    console.error(
      "An error occurred while fetching the test plan payload:",
      error
    );
    throw error;
  }
}

/**
 * Create a test execution with the fetched payload data
 * @param {Payload} payload
 * @returns {Promise<TestExecution>}
 */
export async function createTestExecution(
  payload: Payload
): Promise<TestExecution> {
  try {
    const response: AxiosResponse<TestExecution> = await axios.post(
      `${baseURL}/v2/test-execution/execute/${payload.testKey}`,
      { payload }, // Directly passing the payload object
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to create test execution");
    }
  } catch (error) {
    console.error(
      "An error occurred while creating the test execution:",
      error
    );
    throw error;
  }
}

/**
 * Move a test execution to a new folder
 * @param {string} testExecutionId
 * @param {string} newFolderTestKey
 * @returns {Promise<void>}
 */
export async function moveTestExecutionToFolder(
  testExecutionId: string,
  newFolderTestKey: string
): Promise<void> {
  try {
    // Fetch the new folder details using its test key
    const folderResponse: AxiosResponse<FolderResponse> = await axios.get(
      `${baseURL}/tree/${newFolderTestKey}/folder`,
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
      `${baseURL}/v2/test-execution/${testExecutionId}`,
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

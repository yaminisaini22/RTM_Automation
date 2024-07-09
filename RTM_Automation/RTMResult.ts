import axios, { AxiosError } from "axios";

const updateTestCaseExecution = async (
  combinedKey: string,
  testCaseResult: string
): Promise<void> => {
  const url = `https://rtm-api.hexygen.com/api/test-case-execution/${combinedKey}`;

  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const payload = {
    result: {
      statusName: testCaseResult,
    },
  };

  try {
    const response = await axios.put(url, payload, { headers });
    console.log("Test case execution updated successfully");
    console.log("Response data:", response.data);
  } catch (error) {
    // Handle AxiosError type
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("An error occurred:", axiosError.response.data);
      } else {
        console.error("An error occurred:", axiosError.message);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
};

export { updateTestCaseExecution };

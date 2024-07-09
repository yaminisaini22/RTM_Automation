import axios, { AxiosResponse } from "axios";
test("Time to Get Irdeto Message", async () => {
  // Define the base URL for the RTM API
  const baseURL = "https://rtm-api.hexygen.com/api";

  // Define your API key (replace 'YOUR_API_KEY' with your actual API key)
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

  async function fetchTestData() {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `${baseURL}/test-plan/AAAE-858`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Request was successful");
        console.log("Response data:", response.data);
      } else {
        console.log("Request was not successful");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // Call the function to fetch test data
  fetchTestData();
});

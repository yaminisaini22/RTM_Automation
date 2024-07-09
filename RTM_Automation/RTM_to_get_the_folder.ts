import axios from "axios";

test("Get Folder by Test Key", async () => {
  // Define the base URL for the RTM API
  const baseURL = "https://rtm-api.hexygen.com/api";

  // Define your API key
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

  // Specify the test key for which you want to retrieve the folder
  const testKey = "F-AAAE-TE-2-1";

  try {
    // Make the GET request to retrieve the folder
    const response = await axios.get(`${baseURL}/tree/${testKey}/folder`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Check if the request was successful
    if (response.status === 200) {
      console.log("Folder retrieved successfully:");
      console.log("Response data:", response.data);
    } else {
      console.log("Request was not successful");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

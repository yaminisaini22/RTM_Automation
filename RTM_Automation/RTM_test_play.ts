import axios from "axios";
import promptSync from "prompt-sync";

// Initialize prompt
const prompt = promptSync();

const fetchAndPrintTestPlans = async () => {
  // Define the base URL for the RTM API
  const baseURL = "https://rtm-api.hexygen.com/api";

  // Define your API key
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

  try {
    // Fetch the list of test plans
    const response = await axios.get(`${baseURL}/tree/24415/test-plans`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.status === 200) {
      const testPlans = response.data;
      console.log("Test Plans Data:");
      console.log(JSON.stringify(testPlans, null, 2)); // Pretty print the JSON data
    } else {
      console.log("Failed to retrieve test plans.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

fetchAndPrintTestPlans();

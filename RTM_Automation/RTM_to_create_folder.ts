import axios from "axios";

// Define the base URL and API key
const baseURL = "https://rtm-api.hexygen.com/api";
const apiKey =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";
const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

// Function to create folder
export async function createFolder(parentTestKey: string, folderName: string) {
  const payload = {
    parentTestKey: parentTestKey,
    folderName: folderName,
    treeType: "TEST_EXECUTIONS",
  };

  try {
    const response = await axios.post(`${baseURL}/tree/24415/folder`, payload, {
      headers,
    });
    console.log("Folder created successfully");
    console.log("Response data:", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Propagate the error
  }
}

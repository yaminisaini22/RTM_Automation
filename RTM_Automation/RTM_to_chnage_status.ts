import axios from "axios";
import promptSync from "prompt-sync";

// Initialize prompt
const prompt = promptSync();

// Function to recursively collect folder names by their level
const collectFolderNamesByLevel = (
  folder: any,
  level: number,
  levels: string[][]
): void => {
  if (folder.folderName) {
    // Ensure the levels array has a sub-array for the current level
    if (!levels[level]) {
      levels[level] = [];
    }
    levels[level].push(folder.folderName);
  }
  if (folder.children) {
    for (const child of folder.children) {
      collectFolderNamesByLevel(child, level + 1, levels);
    }
  }
};

// Function to find a folder by name
const findFolderByName = (folder: any, name: string): any => {
  if (folder.folderName === name) {
    return folder;
  }
  if (folder.children) {
    for (const child of folder.children) {
      const result = findFolderByName(child, name);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

test("Get Folder Hierarchy by Test Key", async () => {
  // Define the base URL for the RTM API
  const baseURL = "https://rtm-api.hexygen.com/api";

  // Define your API key
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

  try {
    // Make the GET request to retrieve the folder hierarchy
    const response = await axios.get(`${baseURL}/tree/24415/test-executions`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Check if the request was successful
    if (response.status === 200) {
      console.log("Folder retrieved successfully:");
      const data = response.data;

      // Collect the folder names by their level
      const levels: string[][] = [];
      collectFolderNamesByLevel(data, 0, levels);

      // Start navigation from the root folder
      let currentFolder = data;

      while (true) {
        if (!currentFolder.children || currentFolder.children.length === 0) {
          console.log("No more subfolders to navigate.");
          break;
        }

        const nextLevelFolders = currentFolder.children
          .map((child: any) => child.folderName)
          .filter(Boolean);
        console.log(`Current folder: ${currentFolder.folderName}`);
        console.log("Subfolders:", nextLevelFolders);

        // Prompt user to select a subfolder
        const userInput = prompt(
          "Enter the name of the subfolder to navigate into (or type 'exit' to quit): "
        );
        if (userInput.toLowerCase() === "exit") {
          break;
        }

        // Find the selected subfolder
        const selectedFolder = findFolderByName(currentFolder, userInput);
        if (selectedFolder) {
          currentFolder = selectedFolder;
        } else {
          console.log("Invalid folder name. Please try again.");
        }
      }
    } else {
      console.log("Request was not successful");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

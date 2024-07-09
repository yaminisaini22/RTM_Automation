import axios from "axios";
import promptSync from "prompt-sync";

interface Folder {
  testKey: string;
  folderName: string;
  children?: Folder[];
}

const prompt: Function = promptSync();

let lastTestKey: string | null = null;
let testPlanId: string | null = null;

async function createFolder(
  parentTestKey: string,
  folderName: string
): Promise<Folder | null> {
  const url = "https://rtm-api.hexygen.com/api/tree/24415/folder";
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": `application/json`,
  };
  const payload = {
    parentTestKey,
    folderName,
    treeType: "TEST_EXECUTIONS",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error("An error occurred while creating the folder:", error);
    return null;
  }
}

async function createTestExecution(
  parentTestKey: string,
  testPlanId: string
): Promise<void> {
  const url = "https://rtm-api.hexygen.com/api/test-executions";
  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": `application/json`,
  };
  const payload = {
    parentTestKey,
    testPlanId,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log(
      `Test execution ${response.data.testKey} created in folder ${parentTestKey}`
    );
  } catch (error) {
    console.error(
      "An error occurred while creating the test execution:",
      error
    );
  }
}

async function executeAndGetTestDetails(): Promise<{
  lastTestKey: string | null;
  testPlanId: string | null;
}> {
  const collectFolderNamesByLevel = (
    folder: Folder,
    level: number,
    levels: string[][]
  ) => {
    if (folder.folderName) {
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

  const findFolderByName = (folder: Folder, name: string): Folder | null => {
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

  try {
    const baseURL: string = "https://rtm-api.hexygen.com/api";
    const apiKey =
      "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";

    const userInput1: string = prompt(
      `Which Test Plan you want to execute(IMW provider/ Flora provider) `
    );

    if (userInput1.toLowerCase() === "imw provider") {
      testPlanId = "AAAE-858";
    } else if (userInput1.toLowerCase() === "flora provider") {
      testPlanId = "AAAE-859";
    }

    const response = await axios.get(`${baseURL}/tree/24415/test-executions`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log("Folder retrieved successfully:");
    const data: Folder = response.data;

    const levels: string[][] = [];
    collectFolderNamesByLevel(data, 0, levels);

    let currentFolder: Folder = data;

    while (true) {
      const nextLevelFolders: string[] = currentFolder.children
        ? currentFolder.children
            .map((child: Folder) => child.folderName)
            .filter(Boolean)
        : [];
      console.log(`Current folder: ${currentFolder.folderName}`);
      console.log(
        `Current folder test key (folder ID): ${currentFolder.testKey}`
      );
      console.log("Subfolders:", nextLevelFolders);
      if (currentFolder.children) {
        console.log(
          `Subfolders test key (folder ID): ${currentFolder.children.map((child: Folder) => child.testKey)}`
        );
      }

      const userInput: string = prompt(
        `Do you want to create a new folder, create a new test execution, navigate into an existing subfolder, or continue? (folder/test/continue/exit): `
      );

      if (userInput.toLowerCase() === "folder") {
        const newFolderName: string = prompt(
          "Enter the name of the new folder: "
        );
        console.log(
          `Creating folder '${newFolderName}' in ${currentFolder.folderName}...`
        );
        const newFolder = await createFolder(
          currentFolder.testKey,
          newFolderName
        );
        if (newFolder) {
          console.log(
            `Folder '${newFolderName}' created successfully in ${currentFolder.folderName}.`
          );
          currentFolder.children = currentFolder.children || [];
          currentFolder.children.push(newFolder);
          currentFolder = newFolder; // Navigate into the new folder
        }
      } else if (userInput.toLowerCase() === "test") {
        console.log("Creating a new test execution...");
        await createTestExecution(currentFolder.testKey, testPlanId!);
        lastTestKey = currentFolder.testKey;
        break;
      } else if (userInput.toLowerCase() === "exit") {
        break;
      } else if (userInput.toLowerCase() === "continue") {
        const subfolderInput: string = prompt(
          "Enter the name of the subfolder to navigate into (or type 'exit' to quit): "
        );
        if (subfolderInput.toLowerCase() === "exit") {
          break;
        }

        const selectedFolder: Folder | null = findFolderByName(
          currentFolder,
          subfolderInput
        );
        if (selectedFolder) {
          currentFolder = selectedFolder;
        } else {
          console.log("Invalid folder name. Please try again.");
        }
      }
    }

    console.log(lastTestKey);
    console.log(testPlanId);

    return { lastTestKey, testPlanId };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

export { executeAndGetTestDetails };

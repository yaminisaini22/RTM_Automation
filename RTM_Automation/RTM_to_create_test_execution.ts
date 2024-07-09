import axios from "axios";

test("Time to Get Irdeto Message", async () => {
  const url1 =
    "https://rtm-api.hexygen.com/api/v2/test-execution/execute/AAAE-858";

  const apiKey =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ODY1Nzc5In0.I0zTNcJTTQlNw1WFqeSIayqAemDBQYG5JZqotSk_9lXMzWY0OEnPRWpRzU-Z6PdC";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": `application/json`,
  };

  // Define the payload for the request
  const payload = {
    projectKey: "AAAE",
    summary: "IMW_Provider",
    parentTestKey: "F-AAAE-TP-2",
    testKey: "AAAE-858",
    priority: { id: 4, name: "Minor" },
    status: { id: 10020, name: "To Do", statusName: "To Do" },
    executions: [
      { testKey: "AAAE-1070", issueId: 491403 },
      { testKey: "AAAE-1091", issueId: 493901 },
      { testKey: "AAAE-1095", issueId: 493973 },
      { testKey: "AAAE-858-1", issueId: 493888 },
      { testKey: "AAAE-858-11", issueId: 484043 },
      { testKey: "AAAE-858-2", issueId: 493898 },
      { testKey: "AAAE-858-22", issueId: 484059 },
      { testKey: "AAAE-858-28", issueId: 485618 },
      { testKey: "AAAE-858-3", issueId: 493953 },
      { testKey: "AAAE-858-35", issueId: 486516 },
      { testKey: "AAAE-858-4", issueId: 493957 },
      { testKey: "AAAE-858-5", issueId: 493965 },
    ],
    includedTestCases: [
      { testKey: "AAAE-877" },
      { testKey: "AAAE-876" },
      { testKey: "AAAE-875" },
      { testKey: "AAAE-874" },
      { testKey: "AAAE-873" },
      { testKey: "AAAE-872" },
      { testKey: "AAAE-871" },
      { testKey: "AAAE-870" },
      { testKey: "AAAE-869" },
      { testKey: "AAAE-868" },
      { testKey: "AAAE-867" },
      { testKey: "AAAE-866" },
      { testKey: "AAAE-865" },
      { testKey: "AAAE-864" },
      { testKey: "AAAE-863" },
      { testKey: "AAAE-862" },
      { testKey: "AAAE-861" },
      { testKey: "AAAE-860" },
      { testKey: "AAAE-859" },
    ],
  };

  try {
    // Send the PUT request with the payload as raw JSON in the request body
    const response = await axios.post(url1, { payload }, { headers });
    console.log("Test case execution updated successfully");
    console.log("Response data:", response.data); // Print the response data
  } catch (error) {
    console.error("An error occurred:", error);
  }

  // const response = await axios({
  //   method: "put",
  //   url: url1,
  //   data: {
  //     result: {
  //       statusName: "Pass",
  //     },
  //   },
  //   headers: {
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": `application/json`,
  //   },
  // });
  // console.log("Response data:", response.data);
});

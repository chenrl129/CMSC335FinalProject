const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: "org-bL7F0BTZOOlrk4oBavQ9upzu",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const url = "https://api.openai.com/v1/engines/davinci/completions";
// const options = {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + process.env.OPENAI_API_KEY,
//   },
// };

module.exports = openai;
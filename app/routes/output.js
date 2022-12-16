const openai = require("../config/openai");
const { client, MONGO_DB_NAME, MONGO_COLLECTION } = require("../config/mongodb");

const collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION);

function post(req, res) {
  collection.insertOne({
    input: req.body.input
  });
}

async function get(req, res) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.prompt,
    max_tokens: 3657,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  const result = response.data.choices[0].text;
  const data = {
      prompt: req.body.prompt,
      result: result
  };
  await collection.insertOne(data);
  res.render("output", data);
}

module.exports = {
  get,
  post
};
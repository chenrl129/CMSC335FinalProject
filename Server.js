const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const env = require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const { Configuration, OpenAIApi } = require("openai");

// OpenAI connection
const configuration = new Configuration({
  organization: "org-bL7F0BTZOOlrk4oBavQ9upzu",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const url = "https://api.openai.com/v1/engines/davinci/completions";
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  },
};

// MongoDB connection
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;
const PORT = 4000
const uri = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.ee7cmay.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION);

async function main() {
    await client.connect();
    app.listen(PORT);
    console.log("Web server started and running at http://localhost:" + PORT);
    process.stdout.write("Stop to shutdown the server: ");
    process.stdin.on('data', async (data) => {
      if (data.toString().trim() === 'stop') {
        console.log('Shutting down...'); 
        await client.close();
        process.exit(0);
      }
    });
  }
  main();

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.render("index");
});
app.post('/output', (req, res) => {
  collection.insertOne({
    input: req.body.input
  });
});
app.get('/history', async (req, res) => {
  let data = await collection.find({}).toArray();
        let table = `<table border="1"><tr><th><strong>Name</strong></th><th><strong>GPA</strong></th></tr>`;
        for (let i = 0; i < data.length; i++) {
          table += `<tr><td>${data[i].prompt}</td><td>${data[i].result}</td></tr>`;
        }
        table += `</table>`;
    res.render("history", {ans: table});
});
app.get('/input', (req, res) => {
  res.render("input");
});
app.post('/input', async (req, res) => {
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
    res.render("output", {result: result});
  });
const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const env = require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

// OpenAI connection
// import { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//   organization: "org-bL7F0BTZOOlrk4oBavQ9upzu",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
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
app.get('/history', (req, res) => { 
    res.render("history"); 
});
app.get('/input', (req, res) => {
  res.render("input");
});
app.post('/input', async (req, res) => {
    const json = {
        model: "text-davinci-003",
        prompt: req.body.prompt,
        max_tokens: 3657,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };
    const response = await openai.post(url, json, options);
    const result = response.data.choices[0].text;
    const data = {
        prompt: req.body.prompt,
        result: result
    };
    await collection.insertOne(data);
    res.render("result", {result: result});
  });
});
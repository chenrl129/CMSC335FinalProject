const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const env = require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;
const PORT = process.argv[2];

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
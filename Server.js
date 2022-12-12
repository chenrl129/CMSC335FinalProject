const http = require("http");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
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

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.get('/', (req, res) => {
    res.render("index");
 });
app.get('/apply', (req, res) => { 
    res.render("apply"); 
});
app.post('/apply', (req, res) => {
  req.body.gpa = parseFloat(req.body.gpa);
  collection.insertOne(req.body);
  res.render("application", {
    name: req.body.name,
    email: req.body.email,
    gpa: req.body.gpa,
    background: req.body.background,
    time: new Date().toString()
  });
});
app.get('/reviewApplication', (req, res) => { 
    res.render("review"); 
});
app.post('/processReviewApplication', async (req, res) => {
  let result = await collection.findOne(req.body) ?? {name: "NONE", email: "NONE", gpa: "NONE", background: "NONE"};
  res.render("application", { ...result, time: new Date().toString() });
});
app.get('/adminGPA', (req, res) => { 
    res.render("GPA"); 
});
app.post('/processAdminGPA', async (req, res) => {
  let applicants = await collection.find({ gpa: { $gte: parseFloat(req.body.gpa) } }).toArray();
  res.render("viewGPAS", {applicants});
});
app.get('/adminRemove', (req, res) => { 
    res.render("remove"); 
});
app.post('/processAdminRemove', async (req, res) => {
  let result = await collection.deleteMany({});
  res.render("finishRemove", { count: result.deletedCount });
});

main();
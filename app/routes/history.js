const openai = require("../config/openai");
const { client, MONGO_DB_NAME, MONGO_COLLECTION } = require("../config/mongodb");

const collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION);

async function get(req, res) {
  let data = await collection.find({}).toArray();
        let table = `<table border="1"><tr><th><strong>Name</strong></th><th><strong>GPA</strong></th></tr>`;
        for (let i = 0; i < data.length; i++) {
          table += `<tr><td>${data[i].prompt}</td><td>${data[i].result}</td></tr>`;
        }
        table += `</table>`;
    res.render("history", {ans: table});
}

module.exports = {
  get
};
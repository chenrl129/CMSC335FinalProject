const app = require("./app/config/express");
const { client } = require("./app/config/mongodb");
const routes = require('./app/routes/routes.js');


async function main() {
  const port = process.argv[2] || 4000;
  await client.connect();
  app.listen(port);
  console.log("Web server started and running at http://localhost:" + port);
  console.log("Type 'stop' to shutdown the server.");
  process.stdin.on('data', async (data) => {
    if (data.toString().trim() === 'stop') {
      console.log('Shutting down...'); 
      await client.close();
      process.exit(0);
    }
  });
}

app.get('/', (req, res) => res.render("index"));
app.post('/output', routes.output.post);
app.get('/history', routes.history.get);
app.get('/input', routes.input.get);
app.post('/input', routes.output.get);

main();
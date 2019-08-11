
declare var process: any;

const PORT = Number(process.env.PORT) || 8080;

import * as express from "express";
import * as bodyParser from "body-parser";
const {Datastore} = require('@google-cloud/datastore');

const app = express();
const datastore = new Datastore();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/schedule/", (req, res) => {
  let data = req.body;
  let time = data.time;
  let email = data.email;
  let msg = data.msg;
  datastore.save({
    key: datastore.key('schedule'),
    data
  })
  res.send("Sending message '" + msg + "' to " + email + " at " + time);
});

app.get("/execute/", async (req, res) => {
  const query = datastore
    .createQuery('schedule')
    .order('time', {descending: true})
    .limit(10);
  const result = await datastore.runQuery(query);
  console.log()
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

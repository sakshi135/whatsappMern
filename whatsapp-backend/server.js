//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//appconfig
const app = express();
const port = process.env.Port || 9000;
const pusher = new Pusher({
  appId: "1283304",
  key: "e6db8ae6a99c5cc37a47",
  secret: "3ec343fd8797566ab769",
  cluster: "ap2",
  useTLS: true,
});
//middleware
app.use(express.json());
app.use(cors());

//Db config
const connection_url =
  "mongodb+srv://admin:oKaMheidSgQrjwHl@cluster0.pphw6.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//?????
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB is connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});
//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//listener
app.listen(port, () => console.log(`Listening on localhost :${port}`));
//YVhT70eGdfRuEXow
// YjxbDJf9aB2xLx6m

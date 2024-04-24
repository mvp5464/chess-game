import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  console.log(1);
  // When the user connects
  gameManager.addUser(ws);
  // when the user disconnects
  ws.on("disconnect", () => gameManager.removeUser(ws));

  // ws.on("error", console.error);

  // ws.on("message", function message(data) {
  //   console.log("received: %s", data);
  // });

  ws.send("something");
});

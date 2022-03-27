import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
});

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
}

wss.on("connection", function connection(ws) {
  (ws as any).id = getUniqueID();

  console.log("new connection");
  wss.clients.forEach((client: any) => {
    console.log("CLIENT ID: %s", client.id);
  });

  ws.on("message", function message(data) {
    let exists: boolean = false;

    wss.clients.forEach((client: any) => {
      if (client.id === data.toString()) {
        exists = true;
      }
    });

    if (exists) {
      const data = { message: "You are online on more than one device" };
      ws.send(JSON.stringify(data));
      console.log("received: %s, from: %s, CLOSED!", data, (ws as any).id);
      ws.terminate();
    } else {
      const data = { message: "Connection approved" };
      ws.send(JSON.stringify(data));
      console.log("received: %s, from: %s", data, (ws as any).id);
    }
  });
});

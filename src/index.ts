import { createServer, IncomingMessage } from "http";
import { parse } from "url";
import { WebSocketServer } from "ws";

const server = createServer();
const wss = new WebSocketServer({ server });

function fingerprint(request: IncomingMessage) {
  let exists: boolean = false;

  const parameters = parse(request.url!, true);
  const { userId } = parameters.query;

  wss.clients.forEach((client: any) => {
    if (client.id === userId) {
      exists = true;
    }
  });

  return { exists, userId };
}

wss.on("connection", function connection(ws, request) {
  const { exists, userId } = fingerprint(request);

  (ws as any).id = userId;

  if (exists) {
    const res = { connected: false, message: "Connection exists" };
    ws.send(JSON.stringify(res));
    return;
  }

  const res = { connected: true, message: "Connection approved" };
  ws.send(JSON.stringify(res));
});

server.listen(8080);

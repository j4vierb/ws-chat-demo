import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const messages = [];

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", (ws) => {
  const clientId = wss.clients.size;
  console.log(`Client ${clientId} connected`);

  ws.on('error', console.error);

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    messages.push({ message: message.toString(), client: clientId });
    // ws.send(JSON.stringify(messages));

    // Broadcast the message to all connected clients
    console.log(`Broadcasting message to ${wss.clients.size} clients`);
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(messages.length < 8 ? messages : messages.slice(-8)));
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client ${clientId} disconnected`);
  });

  //ws.send('Hello from WebSocket server!');
  ws.send(JSON.stringify(messages));
});

import { WebSocketServer } from "ws";
import { randomUUID } from "crypto";

const wss = new WebSocketServer({ port: 8080 });
const messages = [];

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", (ws) => {
  const clientId = randomUUID();
  console.log(`New client connected: "${clientId}"`);

  ws.on('error', console.error);

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const newMessage = { message: message.toString(), client: clientId };
    messages.push(newMessage);

    // Broadcast the message to all connected clients
    console.log(`Broadcasting message to ${wss.clients.size} clients`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });
  });

  ws.on("close", () => {
    console.log(`New client disconnected: "${clientId}"`);
  });

  // Send the current messages to the newly connected clients
  ws.send(JSON.stringify({ messages: messages, client: clientId, first: true }));
});

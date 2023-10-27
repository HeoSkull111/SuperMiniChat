const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messageHistory = [];
const publicPath = path.join(__dirname);
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(express.static(publicPath));

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const messageData = JSON.parse(message);
      // messageHistory.push(`[${messageData.username}]: ${messageData.message}`);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // Gửi tên và nội dung riêng lẻ cho các máy khách
          client.send(`[${messageData.username}]: ${messageData.message}`);
        }
      });
    } catch (error) {
      console.error('Invalid message format:', error);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
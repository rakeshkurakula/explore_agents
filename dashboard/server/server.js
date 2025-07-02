import express from 'express';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());
// Read JWT secret from env so deployments can override it. Fall back to a
// predictable value for local development.
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

// simple in-memory trade store
const trades = [];

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
}

app.post('/auth/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/trades', authMiddleware, (req, res) => {
  res.json(trades);
});

app.post('/trades', authMiddleware, (req, res) => {
  const { symbol, qty, price } = req.body;

  const validSymbol =
    typeof symbol === 'string' && /^[a-zA-Z0-9._-]+$/.test(symbol);
  const validQty = typeof qty === 'number' && !Number.isNaN(qty);
  const validPrice = typeof price === 'number' && !Number.isNaN(price);

  if (!validSymbol || !validQty || !validPrice) {
    return res.status(400).json({ error: 'invalid trade fields' });
  }

  const trade = { symbol, qty, price, user: req.user.username, time: Date.now() };
  trades.push(trade);
  broadcast(JSON.stringify({ type: 'trade', data: trade }));
  res.status(201).json(trade);
});

// WebSocket setup
const server = app.listen(3000, () => console.log('API listening on 3000'));
const wss = new WebSocketServer({ server });

function broadcast(msg) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) client.send(msg);
  });
}

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', data: trades }));
});

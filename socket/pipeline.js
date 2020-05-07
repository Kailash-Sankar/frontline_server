// use for client specific messages
// each client gets an individual instance
// usage example
function individualPipeline(ctx) {
  let idx = 0;
  const interval = setInterval(() => {
    ctx.send(`ping pong ${idx}`);
    idx++;
  }, 5000);
  return interval;
}

// use for braodcasting messages
// one instance for all clients
// usage example
function broadcastPipeline(clients) {
  let idx = 0;
  const interval = setInterval(() => {
    for (c of clients.values()) {
      c.send(`broadcast message ${idx}`);
    }
    idx++;
  }, 3000);
  return interval;
}

module.exports = {
  individualPipeline,
  broadcastPipeline,
};

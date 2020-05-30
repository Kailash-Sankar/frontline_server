const WebSocket = require("ws");

const {
  individualPipeline,
  broadcastPipeline,
  authHandler,
  setupPing,
} = require("./utils");

// websocket handling functions
function demoWss() {
  const wss = new WebSocket.Server({ noServer: true });

  broadcastPipeline(wss.clients);

  // establish connection
  wss.on("connection", (ctx) => {
    console.log("connected", wss.clients.size);

    // setup authentication
    authHandler(ctx, registerActions);

    ctx.send("connection established");

    ctx.on("pong", () => {
      ctx.isAlive = true;
    });
  });

  // handle stalled connections
  setupPing(wss.clients);

  return wss;
}

// this function is invoked after successfull auth
function registerActions(ctx) {
  // turn off jwt verfication message event
  ctx.off("message", ctx.authenticate);

  // setup individual pipeline
  const interval = individualPipeline(ctx);

  ctx.on("close", () => {
    console.log("connnection closed");
    clearInterval(interval);
  });

  // register new message handler
  ctx.on("message", (message) => {
    ctx.send(`echo: ${message}`);
  });
}

module.exports = demoWss;

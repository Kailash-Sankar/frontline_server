const WebSocket = require("ws");
const { authenticateWS } = require("../middlewares/jwt");
const { individualPipeline, broadcastPipeline } = require("./pipeline");

function demoWss() {
  const wss = new WebSocket.Server({ noServer: true });

  broadcastPipeline(wss.clients);

  // establish connection
  wss.on("connection", (ctx) => {
    console.log("connected", wss.clients.size);
    ctx.is_authenticated = false;

    // receive a message
    ctx.on("message", (message) => {
      const data = JSON.parse(message);
      if (data && data.type == "jwt") {
        authenticateWS({ token: data.token }, {}, (err) => {
          if (err) {
            ctx.terminate();
            console.log("jwt validation failed");
          }
          // user information will be available in req object
          // allow upgrade to web socket
          ctx.send("authentication successfull");
          ctx.is_authenticated = true;
          register(ctx);
        });
      }
    });

    ctx.send("connection established");
  });

  return wss;
}

function register(ctx) {
  // setup individual pipeline
  const interval = individualPipeline(ctx);

  ctx.on("close", () => {
    console.log("connnection closed");
    clearInterval(interval);
  });

  ctx.on("message", (message) => {
    ctx.send(`echo: ${message}`);
  });
}

module.exports = demoWss;

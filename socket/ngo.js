const WebSocket = require("ws");
const { individualPipeline, broadcastPipeline } = require("./pipeline");

function ngoNotificationPipeline() {
  const wss = new WebSocket.Server({ noServer: true });

  // setup broadcast pipeline
  const broadcastInterval = broadcastPipeline(wss.clients);

  // establish connection
  wss.on("connection", (ctx) => {
    console.log("connected", wss.clients.size);

    // setup individual pipeline
    const interval = individualPipeline(ctx);

    // NOTE: ignored as we don't have this scenario
    // receive a message
    //ctx.on("message", (message) => {
    //  console.log(`Received message => ${message}`);
    //  ctx.send(`you said, ${message}`);
    //});

    ctx.on("close", (client) => {
      console.log("closed", wss.clients.size);
      clearInterval(interval);
    });

    ctx.send("connection established.");
  });

  return wss;
}

module.exports = ngoNotificationPipeline;

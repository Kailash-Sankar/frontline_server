const WebSocket = require("ws");
const { individualPipeline, broadcastPipeline } = require("./pipeline");

function demoPipeline() {
  const wss = new WebSocket.Server({ noServer: true });

  // setup broadcast pipeline
  // runs always, one instance per server
  broadcastPipeline(wss.clients);

  // establish connection
  wss.on("connection", (ctx) => {
    console.log("connected", wss.clients.size);

    // setup individual pipeline
    const interval = individualPipeline(ctx);

    // receive a message
    ctx.on("message", (message) => {
      for (let c of wss.clients.values()) {
        c.send(`echo : ${message} `);
      }
    });

    ctx.on("close", () => {
      console.log("closed", wss.clients.size);
      clearInterval(interval);
    });

    ctx.send("connection established.");
  });

  return wss;
}

module.exports = demoPipeline;

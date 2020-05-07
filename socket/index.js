const { authenticateWS } = require("../middlewares/jwt");
const ngoNotificationPipeline = require("./ngo");

// define all socket types and handling functions here
function setupSocketHandlers() {
  return {
    ngo_notification: ngoNotificationPipeline(),
  };
}

// extract connection type from url
// we'll only consider one param for type of socket
const getConnectionType = (path) => {
  try {
    return path.split("=")[1].trim();
  } catch (err) {
    return "na";
  }
};

// setup websocket server
function setupWebSocket(server) {
  // setup socket handlers
  const wssHandler = setupSocketHandlers();

  // upgrade will check if we have a way to handle this type of socket
  // authenticate user using the same jwt
  server.on("upgrade", function upgrade(request, socket, head) {
    try {
      const connectionType = getConnectionType(request.url);
      if (!(connectionType in wssHandler)) {
        throw "Unknow conneciton type";
      }

      const protocolHeader = request.headers["sec-websocket-protocol"];

      // authenticate client
      if (protocolHeader && protocolHeader.length > 0) {
        const req = { token: protocolHeader.trim() };

        authenticateWS(req, {}, (err) => {
          if (err) {
            throw err;
          }
          // user information will be available in req object
          // allow upgrade to web socket
          const wss = wssHandler[connectionType];
          wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit("connection", ws, request);
          });
        });
      }
    } catch (err) {
      console.log("upgrade exception", err);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
  });
}

module.exports = setupWebSocket;

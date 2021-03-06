const authWebSocketToken = require("../middlewares/ws");
const demoWss = require("./demo");
const { getParams } = require("./utils");

// define all socket types and handling functions here
function setupSocketHandlers() {
  return {
    "/demo": demoWss(),
  };
}

// setup websocket server
function setupWebSocket(server) {
  // setup socket handlers
  const wssHandler = setupSocketHandlers();

  // upgrade will check if we have a way to handle this type of socket
  // authenticate user using the same jwt
  server.on("upgrade", async function upgrade(request, socket, head) {
    try {
      const { path, token } = getParams(request);
      if (!(path in wssHandler)) {
        throw `Unknow conneciton path ${path}`;
      }
      // authenticate client
      if (token) {
        const res = await authWebSocketToken(token);
        if (res && res.user_id) {
          // allow upgrade
          const wss = wssHandler[path];
          wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit("connection", ws, request);
          });
        }
      } else {
        throw "No token found";
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

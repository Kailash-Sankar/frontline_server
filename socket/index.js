const { authenticateWS } = require("../middlewares/jwt");
const demoPipeline = require("./ngo");
const url = require("url");

// define all socket types and handling functions here
function setupSocketHandlers() {
  return {
    "/demo": demoPipeline(),
  };
}

// extract connection type from url
// we'll only consider one param for type of socket
const getParams = (request) => {
  try {
    const parsed = url.parse(request.url);
    const res = { path: parsed.pathname };
    parsed.query.split("&").forEach((param) => {
      const [k, v] = param.split("=");
      res[k] = v;
    });
    return res;
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
      const { path, token } = getParams(request);
      if (!(path in wssHandler)) {
        throw `Unknow conneciton type ${path}`;
      }
      // authenticate client
      if (token) {
        const req = { token };

        authenticateWS(req, {}, (err) => {
          if (err) {
            throw err;
          }
          // user information will be available in req object
          // allow upgrade to web socket
          const wss = wssHandler[path];
          wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit("connection", ws, request);
          });
        });
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

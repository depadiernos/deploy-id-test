const axios = require("axios");

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify;
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  return decoded;
}

exports.handler = function(event, context, callback) {
console.log(event)
        callback(null, {
          statusCode: 200,
          body: "Success"
        });
};

const axios = require("axios");

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify;
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  return decoded;
}

exports.handler = function(event, context, callback) {

        callback(null, {
          statusCode: 200,
          body: JSON.stringify(event.body)
        });
};

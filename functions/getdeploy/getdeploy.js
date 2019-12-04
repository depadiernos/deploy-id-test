const axios = require("axios");

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify;
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  return decoded;
}

function getDeploy(deployId) {
  const API_URL = "https://api.netlify.com/api/v1/deploys/";
  const get = () => {
    axios
      .get(`${API_URL}/${deployId}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      })
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .catch(err => console.log(err));
  };
  if (event.httpMethod !== "GET") {
    return "This function only supports the GET method.";
  } else {
    get();
  }
}

exports.handler = function(event, context, callback) {
  const DEPLOY_ID = event;
  console.log(event);
  const { NF_SECRET } = process.env;

  const parsedContext = extractNetlifySiteFromContext(context);
  console.log(parsedContext);
  const res = getDeploy(DEPLOY_ID);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(res)
  });
}


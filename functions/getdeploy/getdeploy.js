const axios = require("axios");

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify;
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  return decoded;
}

function getDeploy(deployId) {
  const { NF_SECRET } = process.env;
  const options = {
    headers: { Authorization: `Bearer ${NF_SECRET}` },
    baseURL: "https://api.netlify.com/api/v1/deploys/"
  };
  const get = () => {
    axios
      .get(`${deployId}`, options)
      .then(res => {
        console.log(res.data);
        return res.data;
      })
      .catch(err => console.log(err));
  };

  get()
}

exports.handler = function(event, context, callback) {
  const { deployId } = JSON.parse(event.body);
  console.log(deployId);

  const parsedContext = extractNetlifySiteFromContext(context);
  console.log(parsedContext);
  const resData = getDeploy(deployId);
  console.log(resData)

  callback(null, {
    statusCode: 200,
    body: "test"
  });
};

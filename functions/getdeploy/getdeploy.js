const axios = require("axios");

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify;
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
  return decoded;
}

exports.handler = function(event, context, callback) {
  const { deployId } = JSON.parse(event.body);
  console.log(deployId);

  const parsedContext = extractNetlifySiteFromContext(context);
  console.log(parsedContext);

  const getDeploy = async deployId => {
    const { NF_SECRET } = process.env;
    const options = {
      headers: { Authorization: `Bearer ${NF_SECRET}` },
      baseURL: "https://api.netlify.com/api/v1/deploys/"
    };
    axios
      .get(`${deployId}`, options)
      .then(res => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(res.data)
        });
      })
      .catch(err => console.log(err));
  };

  getDeploy(deployId);
};

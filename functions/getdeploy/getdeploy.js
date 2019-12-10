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
    const siteId = "78ff8456-a276-41ba-9925-55480f55ca4a";
    const { NF_SECRET } = process.env;
    const options = {
      headers: { Authorization: `Bearer ${NF_SECRET}` },
      baseURL: deployId
        ? "https://api.netlify.com/api/v1/deploys/"
        : `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
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

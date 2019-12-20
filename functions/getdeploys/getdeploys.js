const fetch = require("node-fetch")

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
  return decoded
}

exports.handler = async function(event, context) {
  const { deployId, email } = JSON.parse(event.body)

  const parsedContext = extractNetlifySiteFromContext(context)
  console.log(parsedContext)

  const { NF_SECRET } = process.env

  const headers = {
    Authorization: `Bearer ${NF_SECRET}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  }

  const fetchDeploy = async () => {
    try {
      const data = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, { headers })
      return await data.json()
    } catch (err) {
      console.log(err)
    }
  }

  const fetchFailedBuilds = async () => {
    try {
      const getAccount = await fetch(`https://api.netlify.com/api/hero/users/${email}`, {
        method: "GET",
        headers: headers,
        body: null
      })
      const {slug} = await getAccount.json()
      const data = await fetch(`https://api.netlify.com/api/v1/${slug}/builds?page=1&per_page=30`, {
        headers
      })
      const deploys = await data.json()
      return deploys
    } catch (err) {
      console.log(err)
    }
  }

  const body = deployId ? await fetchDeploy() : await fetchFailedBuilds()
console.log(body)
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

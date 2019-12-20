const fetch = require("node-fetch")

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
  return decoded
}

exports.handler = async function(event, context) {
  const { deployId, email } = event.body
  console.log(deployId)

  const parsedContext = extractNetlifySiteFromContext(context)
  console.log(parsedContext)

  const { NF_SECRET } = process.env

  const headers = {
    Authorization: `Bearer ${NF_SECRET}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  }

  const { Slug } = await fetch(`https://api.netlify.com/api/hero/users/${email}`, {
    method: "GET",
    headers: headers,
    body: null
  })

  const fetchDeploy = async () => {
    try {
      const response = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, { headers })
      return response
    } catch (err) {
      console.log(err)
    }
  }

  const fetchFailedBuilds = async () => {
    try {
      const response = await fetch(`https://api.netlify.com/api/v1/${Slug}/builds?page=1&per_page=30`, { headers })
      return response
    } catch (err) {
      console.log(err)
    }
  }

  const body = deployId ? await fetchDeploy() : await fetchFailedBuilds()

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

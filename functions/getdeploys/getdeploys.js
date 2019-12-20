const fetch = require("node-fetch")

function extractNetlifySiteFromContext(context) {
  data = context.clientContext.custom.netlify
  decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
  return decoded
}

exports.handler = async function(event, context) {
  const { deployId, email } = event.body
  console.log(event.body)

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
      const { data } = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, { headers })
      console.log(data)
      return data
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
      console.log (getAccount)
      const { data } = await fetch(`https://api.netlify.com/api/v1/${getAccount.data.slug}/builds?page=1&per_page=30`, { headers })
      console.log(data)
      return data
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

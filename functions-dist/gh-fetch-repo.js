const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

const fetch = require('node-fetch');
const auth = require('./commons/auth');

exports.handler = async function(event) {
  const code = event.queryStringParameters.code;
  const params = new URLSearchParams();
  params.append('client_secret', GITHUB_CLIENT_SECRET);
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('code', code);

  console.log(`Is token valid? ${auth.check(event)}`);

  try {

    const response = await fetch('https://api.github.com/user/repos', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + auth.getToken(event) }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}

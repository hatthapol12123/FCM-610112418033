
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-6a59a-firebase-adminsdk-8x8ci-e42eb22b82.json')
const databaseURL = 'https://fcm-6a59a.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-6a59a/messages:send'
const deviceToken =
  'cZo3r-_2A1mFFpehdCQ-rW:APA91bE0djjGTVa0NIoMkPnyeR3zfbfro-Ei0GtTLfg2i5NtjNUYBkVWA1G9oxBxvYaH9N-VDNOXvvyg5KlnZiqDpdZIzjufVHc0lh7gKWHQHIHCn0hDVc-b73MqB_lhGICoLqIaOqlQ'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
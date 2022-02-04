/* eslint-disable semi */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');
const morgan = require('morgan');
const venom = require('venom-bot');

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', async (_, response) => {
  response.json({ health: true })
});
app.post('/auth/create-session', async (request, response) => {
  const { sessionName } = request.body;
  try {
    const client = await venom.create({
      session: sessionName,
      multidevice: true,
    });
    global.client = client;
  } catch (error) {
    console.log('/auth/create-session error: ', error)
  }
  response.send();
});

app.get('/auth/get-token', async (request, response) => {
  try {
    const token = await client.getSessionTokenBrowser();
    response.json(token);
  } catch (error) {
    console.log('/auth/get-token error: ', error)
  }
});

app.post('/send-text', async (request, response) => {
  const { messages } = request.body;

  for (const message of messages) {
    const { phoneToSend, textToSend } = message;

    try {
      await client.sendText(`${phoneToSend}@c.us`, textToSend);
      response.send();
    } catch (error) {
      console.error('/send-text error: ', error);
    }
  }
});

app.post('/send-image', async (request, response) => {
  const { phoneToSend, imgURL, optionalText } = request.body;

  try {
    console.log('send image { phoneToSend, imgURL, optionalText }', { phoneToSend, imgURL, optionalText });
    await client.sendImage(`${phoneToSend}@c.us`, imgURL, optionalText);
    response.send();
  } catch (error) {
    console.log('/send-image error: ', error);
  }
});

module.exports = app;

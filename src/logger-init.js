const axios = require('axios');
const Logger = require('js-logger');
// logger.useDefaults()
Logger.setHandler(function (messages, context) {
  console.log('hello');
  axios.post('https://hooks.slack.com/services/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', JSON.stringify({text: messages}))
})

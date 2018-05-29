// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}
 function performOperation(agent) {
    // Get parameters from Dialogflow to convert
    let operation = agent.parameters.operation;
    const num1 = agent.parameters.number;
    const num2 = agent.parameters.number1;
    
    console.log(`User requested to ${operation} ${num1} and ${num2}`);

    let answer;
    if (operation === `add`) {
        answer = num1 + num2;
        operation = "plus"
    } 
    else if (operation === `subtract`) {
        answer = num1 - num2;
        operation = "subtracted by"
    } 
    else if (operation === `multiply`) {
        answer = num1 * num2;
        operation = "multiply by"
    } 
    else if (operation === `divide`) {
        answer = num1 / num2;
        operation = "divided by"
    }

    
    // Compile and send response
    agent.add(`${num1} ${operation} ${num2} is equals to ${answer}`);

  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Calculate', performOperation);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

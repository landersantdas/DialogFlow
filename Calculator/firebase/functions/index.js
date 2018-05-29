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
    //agent.add(operation);
    
    let numList, answer = 0;
    
    if (operation === `add`) {
        numList = agent.parameters.number;
        let count = 0;
        while (count < numList.length){
            answer = answer + numList[count];
            count = count + 1;
        }
    } else if (operation === `multiply`) {
        numList = agent.parameters.number;
        let count = 0;
        answer = 1;
        while (count < numList.length){
            answer = answer * numList[count];
            count = count + 1;
        }
    } else if (operation === `divide`) {        
        let divid = agent.parameters.dividend;
        let divis = agent.parameters.divisor;
        answer = divid / divis;
    } else if (operation === `subtract`) {
        let min = agent.parameters.minuend;
        let sub = agent.parameters.subtrahend;
        answer = min - sub;
    }
    
    // Compile and send response
    agent.add(`The answer is ${answer}`);

  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Add Numbers', performOperation);
  intentMap.set('Multiply Numbers', performOperation);
  intentMap.set('Subtract Two Numbers', performOperation);
  intentMap.set('Divide Two Numbers', performOperation);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

// Skill "Painel do Claude": abre o painel de consumo no navegador do Echo Show.
// Cole este arquivo inteiro em lambda/index.js na aba "Code" e clique em Deploy.

const Alexa = require('ask-sdk-core');

const URL_PAINEL = 'https://painel-claude-echo.vercel.app/?k=9aTKMtRDLj88Nb6x';

function abrirPainel(handlerInput) {
  const temTela = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL'];
  if (!temTela) {
    return handlerInput.responseBuilder
      .speak('Este aparelho não tem tela para mostrar o painel.')
      .withShouldEndSession(true)
      .getResponse();
  }
  return handlerInput.responseBuilder
    .addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      token: 'painelClaude',
      document: {
        type: 'APL',
        version: '1.8',
        mainTemplate: {
          items: [{
            type: 'Container',
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            items: [{
              type: 'Text',
              text: 'Abrindo o painel do Claude…',
              fontSize: '40dp',
              color: '#f3ede4'
            }]
          }]
        }
      }
    })
    .addDirective({
      type: 'Alexa.Presentation.APL.ExecuteCommands',
      token: 'painelClaude',
      commands: [{ type: 'OpenURL', source: URL_PAINEL }]
    })
    .getResponse();
}

const AbrirHandler = {
  canHandle(handlerInput) {
    const tipo = Alexa.getRequestType(handlerInput.requestEnvelope);
    return tipo === 'LaunchRequest'
      || (tipo === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AbrirPainelIntent');
  },
  handle: abrirPainel
};

const AjudaHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Diga: Alexa, abrir painel do Claude.')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SairHandler = {
  canHandle(handlerInput) {
    const tipo = Alexa.getRequestType(handlerInput.requestEnvelope);
    if (tipo === 'SessionEndedRequest') return true;
    if (tipo !== 'IntentRequest') return false;
    const nome = Alexa.getIntentName(handlerInput.requestEnvelope);
    return ['AMAZON.StopIntent', 'AMAZON.CancelIntent', 'AMAZON.NavigateHomeIntent', 'AMAZON.FallbackIntent'].includes(nome);
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
  }
};

const ErroHandler = {
  canHandle() { return true; },
  handle(handlerInput, error) {
    console.log('Erro:', JSON.stringify(error));
    return handlerInput.responseBuilder
      .speak('Não consegui abrir o painel agora.')
      .withShouldEndSession(true)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(AbrirHandler, AjudaHandler, SairHandler)
  .addErrorHandlers(ErroHandler)
  .lambda();

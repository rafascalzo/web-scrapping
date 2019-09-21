const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey

function robot(content) {
   // console.log(`Successfully recieved content: ${content.searchTerm}`)
   fetchContentFromWikipedia(content)
//    sanitizeContent(content)
//    breakContentIntoSentences(content)
    function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")
        const wikipediaAnswer = wikipediaAlgorithm.pipe(content.searchTerm)
        console.log('Fazendo logo do objeto "wikipediaAnser"')
        console.log(wikipediaAnswer)
        const wikipediaContent = wikipediaAnswer.get()
        console.log(wikipediaContent)
    }
}
module.exports = robot
const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")
        const wikipediaAnswer = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaAnswer.get()

        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const whithoutDatesInParentheses = removeDateInParentheses(withoutBlankLinesAndMarkdown)
        
        content.sourceContentSanitized = whithoutDatesInParentheses

        //console.log(whithoutDatesInParentheses)

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=') || line.trim().startsWith('\n')) {
                    return false
                }
                return true
            })

            return withoutBlankLinesAndMarkdown.join(' ')
            
        }
    }

    function removeDateInParentheses(text) {
       return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm,'').replace(/ /g,' ')
       
    }

    function breakContentIntoSentences(content) {
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

}
module.exports = robot
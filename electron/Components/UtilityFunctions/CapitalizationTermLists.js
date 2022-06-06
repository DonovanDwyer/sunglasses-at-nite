const articles = [ 'the', 'a', 'an' ];
const coordinating_conjunctions = [ 'for', 'and', 'nor', 'but', 'or', 'yet', 'so' ];
const correlative_conjunctions = [ 'that' ];
const subordinating_conjunctions = [ 'is', 'inasmuch', 'if', 'when' ];
const prepositions = [
    'as',
    'at',
    'but',
    'by',
    'for',
    'from',
    'in',
    'into',
    'like',
    'of',
    'on',
    'onto',
    'over',
    'per',
    'regarding',
    'than',
    'to',
    'versus',
    'via',
    'with'
];

module.exports = {
    lowercaseTerms: [].concat(articles, coordinating_conjunctions, correlative_conjunctions, subordinating_conjunctions, prepositions)
}
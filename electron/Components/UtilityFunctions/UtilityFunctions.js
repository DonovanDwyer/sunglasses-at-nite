const { lowercaseTerms } = require('./CapitalizationTermLists');

function followsColonOrPeriod(index, array){
    if (array[index--] == undefined) return false;
    let prevWord = array[index--].split("");
    let prevChar = prevWord[prevWord.length - 1];
    return ((prevChar === ':') || (prevChar === '.'));
}

function title(string){
    let segments = string.toLowerCase().split(" ");
    let processedSegs = [];
    for (const idx in segments){
        if (lowercaseTerms.includes(segments[idx]) && (idx > 0) && !(followsColonOrPeriod(idx, segments))){
            processedSegs.push(segments[idx]);
        } else {
            let chars = segments[idx].split("");
            if (chars.includes('.') && chars[chars.indexOf('.') + 1] != undefined){
                let periodIdx = chars.indexOf('.');
                chars[periodIdx + 1] = chars[periodIdx + 1].toUpperCase();
            }
            if (chars.includes('-') && chars[chars.indexOf('-') + 1] != undefined){
                let hyphenIdx = chars.indexOf('-');
                chars[hyphenIdx + 1] = chars[hyphenIdx + 1].toUpperCase();
            }
            chars[0] = chars[0].toUpperCase();
            processedSegs.push(chars.join(""));
        }
    }
    return processedSegs.join(" ");
}

function whitespace(string, targetChar=undefined, replaceChar=undefined){
    if (targetChar === undefined){
        targetChar = '_';
    }
    if (replaceChar === undefined){
        replaceChar = ' ';
    }
    let chars = string.split('');
    let newStr = '';
    for (let i = 0; i < chars.length; i++){
        if (chars[i] === targetChar){
            if (newStr[newStr.length - 1] !== replaceChar){
                newStr += replaceChar;
            }
        } else {
            newStr += chars[i];
        }
    }
    return newStr;
}

function parseFilename(string){
    let parsedStr = string.split("/");
    parsedStr = parsedStr[parsedStr.length - 1];
    parsedStr = parsedStr.split('.');
    parsedStr.pop();
    return parsedStr.length > 1 ? parsedStr.join('.') : parsedStr.join(' ');
}

function escaper(string){
    return string.split(" ").join("\\ ").split("(").join("\\(").split(")").join("\\)");
}

module.exports = {
    title: title,
    whitespace: whitespace,
    parseFilename: parseFilename,
    escaper: escaper
}
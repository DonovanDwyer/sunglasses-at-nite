function helper(){
    function sanitizeInput(input){
        return input.split(" ").join("\\ ").split("(").join("\\(").split(")").join("\\)");
    }
    
    function parseFilename(input){
        let parsedInput = input.split("/");
        return parsedInput[parsedInput.length-1].split(".")[0];
    }
}

module.exports = helper;
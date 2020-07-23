// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// http://www.w3schools.com/jsref/prop_option_value.asp

/*
 * Clear input onclick
 */
document.getElementById("input").onclick = function(){
    if(document.getElementById("input").value == "Type (or paste) here..."){
        document.getElementById("input").value = ""; //load value
    }
};

/*
 * Clear output
 */
document.getElementById("output").onclick = function(){
    if(document.getElementById("output").value == "Result goes here..."){
        document.getElementById("output").value = ""; //load value
    }
};



/*
 *
 * Functions
 *
 *
 */

function ArrayToLines(array){
    let lines = array.join("\n");
    return lines;   
}

function convertLines(strLines, option){
    var linesA = lines2Array(strLines);
    var newLines = [];
    var promise = Promise.resolve(null);
    linesA.forEach(function(value) {//function(currentValue, index, array);
        promise = promise.then(function() {
            //return codeOption(value, option);
            return input(value).code(option);
        }).then(function(newLine) {
            // ...
            newLines.push(newLine);
        });
    });
    return promise.then(function() {
        return ArrayToLines(newLines);
    });
}




/*
 *
 * CallBack
 *
 */
function updateOutput(newValue){
    document.getElementById("output").value = newValue;
}




/*
 *
 *
 *  Action
 *
 */

document.getElementById("button").onclick = function(){
    
    let x = document.getElementById("select").selectedIndex;
    let option = document.getElementsByTagName("option")[x].value;
    
    let strLines = document.getElementById("input").value;
    
    convertLines(strLines, option).then(updateOutput);
};

/*
 *
 *  Toolbar
 *
 */

document.getElementById("clear").onclick = function(){  
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
};


document.getElementById("clear-input").onclick = function(){  
    document.getElementById("input").value = "";
};

document.getElementById("clear-output").onclick = function(){  
    document.getElementById("output").value = "";
};
//https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
//https://developer.chrome.com/extensions/xhr


function supportCryptography(){
    /*
     *
     *  Test Cryptography API Support
     *
     */
    var crypto = window.crypto || window.msCrypto;
    if(!crypto.subtle){
       console.log("Cryptography API not Supported");
    }else{
       console.log("Cryptography API Supported"); 
    }
    
}



function lines2Array(str){
    let array = str.split(/\r\n|\r|\n/);
    return array;
}

/*
 *
 * Lib Base64
 *
 */


function b64EncodeASCII(str){
    return window.btoa(str);
}
function b64DecodeASCII(str){
    return window.atob(str);
}


//Solve The "Unicode Problem"
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    }).join(''));
}
//b64 <--> JSON

function b64EncodeJSON(json){
    let str = JSON.stringify(json);
    let b64 = b64EncodeUnicode(str);
    return b64;
}
function b64DecodeJSON(b64){
    let str = b64DecodeUnicode(b64);
    let json = JSON.parse(str);
    return json;
}

//arrayBufferToBase64
function b64EncodeArrayBuffer(buffer){
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[i] );
    }
    return window.btoa( binary );
}

//base64ToArrayBuffer
function b64DecodeArrayBuffer(b64){
    let binary_string =  window.atob(b64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


//convertStringToBuffer
function asciiEncodeArrayBuffer(str){
    let  bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++){
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
//convertBufferToString
function asciiDecodeArrayBuffer(buffer){
    let str = "";
    for (let i = 0; i < buffer.byteLength; i++){
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}

function unicodeEncodeArrayBuffer(str){
    let  bytes = new Uint16Array(str.length);
    for (let i = 0; i < str.length; i++){
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

function unicodeDecodeArrayBuffer(buffer){
    let str = "";
    for (let i = 0; i < buffer.byteLength; i++){
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}

/*
 *
 * Crypt Lib
 *
 */


    
function newKeyAES(){
    let algorithm = "AES-CBC";
    //let algorithm = "AES-GCM";
    //DEBUG
    console.log("# function Program testAES()..!");
    //END DEBUG
    
    /*
     *  generate k
     */
    //Parameters:
    //1. Symmetric Encryption algorithm name and its requirements
    //2. Boolean indicating extractable. which indicates whether or not the raw keying material may be exported by the application (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
    //3. Usage of the key. (https://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
    return crypto.subtle.generateKey({name: algorithm, length: 192}, true, ["encrypt", "decrypt"]).then(function(key_object){
        //DEBUG
        console.log("# generateKey().then(..");
        //console.log("# typeof key_object");
        //console.log(typeof key_object);
        console.log("# key_object");
        console.log(key_object);
        
        //END DEBUG
        
        /*
         *  export k
         */
        return crypto.subtle.exportKey("jwk", key_object).then(function(json_key){
            //DEBUG
            console.debug("# export_key(key_object).then(..");
            console.debug("# json_key");
            console.debug(json_key);
            //END DEBUG
            
            let strkey= JSON.stringify(json_key);
            
            console.debug(strkey);
            
            let b64key = b64EncodeASCII(strkey);
            console.debug(b64key);
            
            return b64key;
        });
    });
}

function newVecAES(){
    //iv: Is initialization vector. It must be 16 bytes
    let vector = crypto.getRandomValues(new Uint8Array(16));
    
    console.debug("# vector");
    console.debug(typeof vector);
    console.debug(vector);
    
    let b64str = b64EncodeArrayBuffer(vector);
    
    console.debug("# b64str");
    console.debug(typeof b64str);
    console.debug(b64str);
    
    return b64str;
}


function aesEncrypt(data, b64key, b64vec){

    let jsonkey = b64DecodeJSON(b64key);
    let vector = b64DecodeArrayBuffer(b64vec);
    
    let algorithm = "AES-CBC";
    //let algorithm = "AES-GCM";
    
    //DEBUG
    console.log("# function Program aesEncrypt()..!");
    console.log("# data");
    console.log(data);
    //END DEBUG
    
    /*
     *  import k
     */
    return crypto.subtle.importKey("jwk", jsonkey, {name: algorithm, iv: vector}, false, ["encrypt", "decrypt"]).then(function(key_object){
        //DEBUG
        console.log("# import_key(json_key).then(..");
        console.log("# key_object");
        console.log(key_object);
        //END DEBUG
        /*
         *  encrypt m
         */
        return crypto.subtle.encrypt({name: algorithm, iv: vector}, key_object, asciiEncodeArrayBuffer(data)).then(function(encrypted_ArrayBuffer){
            //DEBUG
            console.log("# encrypt_data(key_object, data).then(..!!");
            console.log("# encrypted_ArrayBuffer");
            console.log(encrypted_ArrayBuffer);
            //END DEBUG
        
            let b64 = b64EncodeArrayBuffer(encrypted_ArrayBuffer);
            //console.debug(b64);
            
            return b64;
        
            /*
             *  decrypt c
             */
        });
    });
}

function aesDecrypt(b64encodedStr, b64key, b64vec) {
    
    let jsonkey = b64DecodeJSON(b64key);
    let vector = b64DecodeArrayBuffer(b64vec);
    

    let algorithm = "AES-CBC";

    var encrypted_buffer = b64DecodeArrayBuffer(b64encodedStr);

    /*
     *  import k
     */
    //crypto.subtle.importKey("jwk", json_key, {name: algorithm, iv: vector}, false, ["encrypt", "decrypt"])
    return crypto.subtle.importKey("jwk", jsonkey, {name: algorithm, iv: vector}, false, ["encrypt", "decrypt"]).then(function(key_object){
        //DEBUG
        console.log("# import_key(json_key).then(..");
        console.log("# key_object");
        console.log(key_object);
        //END DEBUG
        /*
         *  decrypt c
         */
        return crypto.subtle.decrypt({name: algorithm, iv: vector}, key_object, encrypted_buffer).then(function(ArrayBuffer){
            
            let decrypted_buffer = new Uint8Array(ArrayBuffer);
    
            console.debug("# asciiEncodeArrayBuffer(decrypted_data)!"); 
            let str = asciiDecodeArrayBuffer(decrypted_buffer); //BUG
            console.debug(str);
            return str;
        });
    }); 
}



/*
 *
 * Callbacks
 *
 */
var callback = {
    success: function(data) {
      console.log(1, 'success', data);
    },
    error: function(data) {
      console.log(2, 'error', data);
    }
};
function printC(data){
    console.log(data);
}



/*
 * programs
 */

var b64key = "eyJhbGciOiJBMTkyQ0JDIiwiZXh0Ijp0cnVlLCJrIjoiM3g5d0hjTFE3a0IycFpBMlBWRmc0QnhHLUdrTzJ6U2kiLCJrZXlfb3BzIjpbImVuY3J5cHQiLCJkZWNyeXB0Il0sImt0eSI6Im9jdCJ9";
var b64vec = "LKUTFYuKrVBFqOzbRHp6aw==";

function input(str){
    //objects
    var core = {
        // Method that performs the code
        code: function (str, option) {
            /*
             * Select an option
             */
            switch(option){
                case "encode":
                   // Creating a promise
                   let b64encode = new Promise( function(resolve, reject){
                       let encoded = b64EncodeASCII(str);
                       resolve(encoded);
                   });
                return b64encode;
                case "decode":
                   // Creating a promise
                let b64decode = new Promise( function(resolve, reject){
                    let decoded = b64DecodeASCII(str);
                    resolve(decoded);
                });
                return b64decode;
                case "encrypt":
                    return aesEncrypt(str, b64key, b64vec);
                case "decrypt":
                    return aesDecrypt(str, b64key, b64vec);
                
                //default:
            }
        },
        encode: function (str) {
            // Creating a promise
            let b64encode = new Promise( function (resolve, reject) {
                let encoded = b64EncodeASCII(str);
                resolve(encoded);
            });
            return b64encode;
        },
        decode: function (str) {
            // Creating a promise
            let b64decode = new Promise( function (resolve, reject) {
                let decoded = b64DecodeASCII(str);
                resolve(decoded);
            });
            return b64decode;
        },
        encrypt: function (str) {
            return aesEncrypt(str, b64key, b64vec);
        },
        decrypt: function (str) {
            return aesDecrypt(str, b64key, b64vec);
        }
    };
    
    // Adapter pattern
    return {
        'code': function(args) {
            return core.code(str, args);
        },
        'encode': function(args) {
            return core.encode(str, args);
        },
        'decode': function(args) {
            return core.decode(str, args);
        },
        'encrypt': function(args) {
            return core.encrypt(str, args);
        },
        'decrypt': function(args) {
            return core.decrypt(str, args);
        }
    };
}


/*
 *
 * End Lib Base64
 *
 */

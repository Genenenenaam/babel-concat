"use strict";


/* imports
---------------------------------------------*/
const sourceMap = require("source-map");
const babel = require("@babel/core");
const SourceMapConsumer = sourceMap.SourceMapConsumer;
const SourceNode = sourceMap.SourceNode;



/* Date filename
---------------------------------------------*/
let nonceVal = Date.now();
let nonce = function() {
    return nonceVal++;
};



/* processSourceFileName
---------------------------------------------*/
let processSourceFileName = function(sourceFileName, code) {

    // If we're processing a block of code,
    // let's try to find a class name in the block to specify the sourceFileName

    let re = /class\s?([^\s]+)(\s?{|\s.*)|\s([^\s]+)\s?=\s?class/;
    let m = re.exec(code);

    return (sourceFileName || "") + (m && m[1] || nonce());
};



/* processOptions
---------------------------------------------*/
let processOptions = function(options, code) {
    let rst = JSON.parse(JSON.stringify(options)); // Let's clone options

    // 1. enable sourcemaps by default
    rst.sourceMaps = true;

    // 2. If we're processing a block of code, we need to ensure that the block will have a specific source name
    if (code) {
        rst.sourceFileName = processSourceFileName(rst.sourceFileName, code);
    }

    return rst;
};



/* transform
---------------------------------------------*/
exports.transform = function(files, options) {
    let theSourceNodes = [];

    files.forEach(function(file) {
        let theOutput = babel.transform(file, processOptions(options, file));

        let theScript = theOutput.code;
        let theSourceMap = theOutput.map;
        
        let theSourceMapConsumer = new SourceMapConsumer(theSourceMap);
		let theGeneratedNode = SourceNode.fromStringWithSourceMap(theScript, theSourceMapConsumer);

		theSourceNodes.push(theGeneratedNode);
    });

    return exports.babelConcat(theSourceNodes, options);
};



/* transformFile
---------------------------------------------*/
exports.transformFile = function(files, options, callback) {
    let deferredResults = [];
    let theSourceNodes = [];
    let theOptions = processOptions(options);

    files.forEach(function(file) {
        let promise = new Promise(function(resolve) {
            let thePath = file;
            let theOutput = babel.transformFile(thePath, theOptions, function(err, result) {

                let theScript = result.code;
                let theSourceMap = result.map;
                
                let theSourceMapConsumer = new SourceMapConsumer(theSourceMap);
                let theGeneratedNode = SourceNode.fromStringWithSourceMap(theScript, theSourceMapConsumer);

                theSourceNodes.push(theGeneratedNode);
                resolve();
            });
        });

        deferredResults.push(promise);
    });

    Promise.all(deferredResults).then(function() {
        callback(exports.babelConcat(theSourceNodes, options));
    });
};



/* transformFileSync
---------------------------------------------*/
exports.transformFileSync = function(files, options) {
    let theSourceNodes = [];
    let theOptions = processOptions(options);

    files.forEach(function(file) {
        let thePath = file;
        let theOutput = babel.transformFileSync(thePath, theOptions);

        let theScript = theOutput.code;
        let theSourceMap = theOutput.map;
        
        let theSourceMapConsumer = new SourceMapConsumer(theSourceMap);
		let theGeneratedNode = SourceNode.fromStringWithSourceMap(theScript, theSourceMapConsumer);

		theSourceNodes.push(theGeneratedNode);
    });

    return exports.babelConcat(theSourceNodes, options);
};



/* The Concat
---------------------------------------------*/
exports.babelConcat = function(theSourceNodes, options) {

    const theSourceNodeTree = new SourceNode(null, null, null, theSourceNodes).toStringWithSourceMap();
    const theCode = theSourceNodeTree.code;
    const theMappings = theSourceNodeTree.map.toString();

    const theBase64Map = Buffer.from(theMappings).toString("base64");
    const theEncodedSourceMap = "//# " + "sourceMappingURL=data:application/json;base64," + theBase64Map;

    const theFileContents = options.sourceMaps ? theCode + "\n" + theEncodedSourceMap : theCode;
    const theResult = {
        map: theSourceNodeTree.map,
        code: theFileContents
    };

    return theResult;
};

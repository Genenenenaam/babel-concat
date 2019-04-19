# babel-concat-sourcemaps
Use this plugin to pass an [Array of file path's], or an [Array of file contents] to one of Babel's transform methods. And the result will return an {Object} with two keys: 
- *{code: ... }* containing your processed & concatenated code. With inlined sourcemap if you have set the Babel option '**sourcemaps: true**'.
- *{map: ... }* containing the RAW source map object which is the concatenation of each source-map of each given file (or file contents).


Installation
============

`npm install babel-concat-sourcemaps`

```js
const concat = require("babel-concat-sourcemaps");


Usage example :

const result = concat.transformFileSync([path1, path2, ..., pathN], options);
result.code // returns the concatenation of file1, file2, ..., fileN after they have been processed by Babel (Sourcemap is inlined if the babel option has been set to true)
result.map // returns the RAW source map object which is the concatenation of each source-map of each given file (or block of code).


Babel options example:

const result = concat.transformFileSync([path1, ..., pathN], {
  "presets": [
    ["@babel/preset-env", { 
      "targets": { 
        "browsers": [
          "> 1%",
          "last 2 versions",
          "not ie < 11"
        ]
      } 
    }]
  ],
  "sourceMaps": true,
  "minified": false,
  "comments": false
});
```

API
===

### `transform(codeBlocks, options)` ###

Same as transform from babel except that you give a list of code blocks.

- `codeBlocks` : list of code blocks
- `options`: see babel options

### `transformFile(files, options, callback)` ###

Same as transformFile from babel with mutilple files.

- `files` : all files to transform
- `options`: see babel options
- `callback`: see babel callback

### `transformFileSync(files, options)` ###

Same as transformFileSync from babel with mutilple files.

- `files` : all files to transform
- `options`: see babel options

### `babelConcat(results, options)` ###

Concat all result with code and map from babel transform.

- `results` : all results from babel. Use option "both" or "true" to have the source map.
- `options`: see babel options


License
=======

[MIT License](LICENSE).

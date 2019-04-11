# babel-concat-sourcemaps
Use to concat JS files after babel transformation.

The apis (see API) take a list of files (or blocks of code) instead of a single one and process all the list to return a babel-like object ({code:..., map:...}):
- code attribute contains the concatenation of all compiled code blocks.
- map attribute contains a source map object which is the concatenation of each source-map of each given file (or block of code). This is only available if you activated the source-map option.


Installation
============

`npm install babel-concat-sourcemaps`

```js
const concat = require("babel-concat-sourcemaps");

Usage example :
const rst = concat.transformFileSync([path1, path2, ..., pathN], options)
rst.code // returns the concatenation of file1, file2, ..., fileN after they have been processed by Babel
rst.map // returns a source map, concatenation of the generated source-map of each file (only if the source-maps option has been set to true, inline or both => see babel documentation)
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

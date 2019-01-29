# Json2ts

Automatically generate Typescript Definition file from url

## Install

``` bash
npm install json2ts-core --save-dev
```

## Usage(CLI)

```
json2ts -u=your-web-url
```

```
--version       Show version number                                   [boolean]
  -u, --url       your web url                                        [required]
  -m, --method    your web url method                           [default: "get"]
  -t, --target    typescript interface target folder path       [default: "./interface"]
  -p, --property  export response property interface
  -h, --help      Show help                                           [boolean]
```

## Usage(API)

``` js
const json2ts = require('json2ts-core/src/json2ts')

json2ts({url: 'http://localhost:8002'}, ($) => {
  // url from page to generate ts
  // save method and url for each item
  $('selector').each(function(index, element) {
    ...
  })
  return arr
})
```

## License

The code is distributed under the [MIT](http://opensource.org/licenses/MIT) license
# Json2ts

Web url to generate typescript interface

## Install

``` bash
npm install json2ts-core --save-dev
```

## Usage

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
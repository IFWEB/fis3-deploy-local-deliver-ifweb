# fis3-deploy-local-deliver-ifweb

## 说明

```js
  fis.match('*', {
    deploy: fis.plugin('local-deliver-ifweb', {
      to: '../dev-out',
      other: [ 
        { from:'cssdemo/css/',
          to: '../css-dev',
          filter: /\.css$/
        },
        {
          from:'./',
          to: '../html-dev',
          filter: /\.html$/
        },
        {
          from:'jsdemo/js',
          to: '../js-dev',
          filter: /\.js$/
        }       
      ],
      // rootPath: pth.resolve(__dirname,'../')
      // rootPath: __dirname
    })
  })
});
```

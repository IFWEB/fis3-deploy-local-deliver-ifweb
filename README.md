# fis3-deploy-local-deliver-ifweb

## 说明
改写fis3-deploy-local-deliver，在导出时可以添加部分文件导出到另外的目录。以工程目录（fis-conf.js所在的文件夹）为根目录进行配置
```js
  fis.match('*', {
    deploy: fis.plugin('local-deliver-ifweb', {
      to: '../dev-out',
      other: [ 
        { from:'/cssdemo/css/',
          to: '../css-dev',
          filter: /\.css$/
        },
        {
          from:'./html/',
          to: '../html-dev',
          filter: /\.html$/
        },
        {
          from:'jsdemo/js',
          to: '../js-dev',
          filter: /\.js$/
        }       
      ],
    })
  })
});
```

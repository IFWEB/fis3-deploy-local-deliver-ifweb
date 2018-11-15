/**
 * fis.baidu.com
 */


var pth = require('path');

function getServerInfo() {
    var conf = pth.join(fis.project.getTempPath('server'), 'conf.json');
    if (fis.util.isFile(conf)) {
        return fis.util.readJSON(conf);
    }
    return {};
}

var serverRoot = (function () {
    var key = 'FIS_SERVER_DOCUMENT_ROOT';
    var serverInfo = getServerInfo();
    if (process.env && process.env[key]) {
        var path = process.env[key];
        if (fis.util.exists(path) && !fis.util.isDir(path)) {
            fis.log.error('invalid environment variable [' + key + '] of document root [' + path + ']');
        }
        return path;
    } else if (serverInfo['root'] && fis.util.is(serverInfo['root'], 'String')) {
        return serverInfo['root'];
    } else {
        return fis.project.getTempPath('www');
    }
})();

var cwd = fis.processCWD || process.cwd();

function normalizePath(to, root) {
    if (to[0] === '.') {
        to = fis.util(cwd + '/' + to);
    } else if (/^output\b/.test(to)) {
        to = fis.util(root + '/' + to);
    } else if (to === 'preview') {
        to = serverRoot;
    } else {
        to = fis.util(to);
    }
    return to;
}

 //处理相对路径，返回绝对路径
 function dealPath(partPath){
    if(partPath[0]==='/'){
        partPath='.'+(partPath);
        
    }else if(partPath[0]==='.'){
    }else{
        partPath='./'+(partPath);
    }   
    partPath = normalizePath(partPath, fis.project.getProjectPath());
    return partPath + '/';
    console.log(partPath);
}



// console.log('cwd',cwd); //E:\ww下载\myproject\fis3_tpl


function deliver(output, release, content, file, options) {
    console.log('release:-------', release);
    console.log('filefullname:-----', file.fullname);
    if (!release) {
        fis.log.error('unable to get release path of file[' + file.realpath + ']: Maybe this file is neither in current project or releasable');
    }
    if (fis.util.exists(output) && !fis.util.isDir(output)) {
        fis.log.error('unable to deliver file[' + file.realpath + '] to dir[' + output + ']: invalid output dir.');
    }
    var target;
    target = fis.util(output, release);


    fis.util.write(target, content);

    // console.log('target:------',target);

    //other 改写
    for (var i = 0, len = options.other.length; i < len; i++) {
            if ((options.other[i].filter).test(release) && file.fullname.indexOf(options.other[i].from) === 0) {
                console.log('绝对from:',options.other[i].from );
                console.log('\n');
                //判断fullname是在from文件夹下
                //eg:
                // from = 'E:/ww下载/myproject/fis3_tpl/cssdemo/css/',
                // fullname = 'E:/ww下载/myproject/fis3_tpl/cssdemo/css/css3/4.css',
                // to = 'E:/ww下载/myproject/css-dev/',
                // filter = /\.css$/;
                
                    var realPath = options.other[i].to + file.fullname.substring(options.other[i].from.length);
                    fis.util.write(realPath, content);
                
               /* var fromFolder = normalizePath(options.other[i].from, fis.project.getProjectPath());
                // // console.log(options.rootPath );  //e:\ww下载\myproject\fis3_tpl

                console.log('fromFolder', fromFolder);
                // console.log('fromFoldersubstring::::::::::::', file.fullname.substring(fromFolder.length));
                // console.log(release.substring(fromFolder.length+1));

                var toForder = normalizePath(options.other[i].to, fis.project.getProjectPath());
                // console.log('toForder', toForder);



                var newPath = fis.util(toForder, file.fullname.substring(fromFolder.length));
                console.log('newPath:++++++++:', newPath);
                console.log('\n');

                fis.util.write(newPath, content); */

               
            }
               
            
            //2
        /*     if(options.other[i].from[i]==='/'){
                options.other[i].from='.'+(options.other[i].from);
                // console.log( (options.other[i].from));  
            }else if(options.other[i].from[i]==='.'){
                
            }else{
                options.other[i].from='./'+(options.other[i].from);
                // console.log( (options.other[i].from));
            }   
            options.other[i].from = normalizePath(options.other[i].from, fis.project.getProjectPath());
            console.log(options.other[i].from); */

               
            
                //1
             /*  if (release.indexOf(options.other[i].from)!==-1) {
             if ((options.other[i].filter).test(release)) {
                 console.log('yes');
                 var newPath = '';
                 // newPath = pth.resolve(options.rootPath, options.other[i].to, release.slice(1));  
                 // console.log('newPath:++++++++:', newPath);
                 // 写入          
                 // fis.util.write(newPath, content);
             }
         } */ 


    }

    fis.log.debug(
        'release ' +
        file.subpath.replace(/^\//, '') +
        ' >> '.yellow.bold +
        target
    );
}

module.exports = function (options, modified, total, next) {

    var to = normalizePath(options.to || options.dest || 'preview', fis.project.getProjectPath());
    // console.log('to:normalizePath',to);      //  e:/ww下载/myproject/dev-out

    //   console.log("length:",modified.length);
    // for(var i  = modified.length; i--;){
    //   console.log("1:",modified[i].fullname);
    // }

    /*  console.log("length:",modified[8]);
        var count = 0; */

      for (var i = 0, len = options.other.length; i < len; i++) {
        options.other[i].from = dealPath(options.other[i].from);
        options.other[i].to = dealPath(options.other[i].to);
        // console.log( options.other[i].from);
            
        }

    modified.forEach(function (file) {
        deliver(to, file.getHashRelease(), file.getContent(), file, options);
    });


    next();
};

var express = require('express');
var router = express.Router();
var request = require('request');
var py_Shell = require('python-shell')
var async = require('async');
var fs = require('fs');
var multer = require('multer');
// 기타 express 코드
var upload = multer({ dest: './public/download_img/canvas_img/', limits: { fileSize: 5 * 1024 * 1024 } });

console.log('Capston API')

// GET 요청
router.get('/getParsing', function(req, res, next){
    var req_data = req.query.keyword;
    var py_option = {
        mnode : 'text',
        pythonOption : ['-u'],
        scriptPath : '',
        args : [req_data]
    }
    
    
    
    async.waterfall([
        function(nextCallback){
            if(req_data != null){
                nextCallback(null, req_data);
            }
        },
        function(keyword, nextCallback){
            py_Shell.run("./0.1.1/gparsing.py", py_option, function(err, result){
                console.log('Python 실행 완료');
                nextCallback();
            })
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err)
        }
        res.send(200);
    })
});

router.get('/getopenCV', function(req, res, next){
    var req_data = req.query.keyword;
    console.log(req_data)
    var py_option = {
        mnode : 'text',
        pythonOption : ['-u'],
        scriptPath : '',
        args : [req_data]
    }
    
    async.waterfall([
        function(nextCallback){
            if(req_data != null){
                nextCallback(null, req_data);
            }
        },
        function(keyword, nextCallback){
            py_Shell.run("./0.1.1/opencv.py", py_option, function(err, result){
                console.log('Python Open cv 실행 완료');
                nextCallback();
            })
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err)
        }
        res.send(200);
    })
});

router.get('/getSearchRetrain', function(req, res, next){
    var py_option = {
        mnode : 'text',
        pythonOption : ['-u'],
        scriptPath : ''
    }
    py_Shell.run("./0.1.1/search_retrain.py", py_option, function(err, result){
        console.log(err);
        res.send(200);
    });
})

router.get('/getCanvasRetrain', function(req, res, next){
    var py_option = {
        mnode : 'text',
        pythonOption : ['-u'],
        scriptPath : ''
    }
    py_Shell.run("./0.1.1/canvas_retrain.py", py_option, function(err, result){
        console.log(err);
        res.send(200);
    });
})

router.get('/getScore', function(req, res, next){
    var article = fs.readFileSync("./public/img_canvas/result.txt"); 
    var lineArray = article.toString().split('\n');
    res.send(lineArray);
})

router.get('/getNorm', function(req, res, next){
    var req_data = req.query.keyword;
    var res_data = [];
    var canvas_path = './public/bottleneck/canvas_img/canvas.jpg_https~tfhub.dev~google~imagenet~inception_v3~feature_vector~1.txt'
    var default_path = './public/bottleneck/search_img/' + req_data;
    var py_option = {
        mnode : 'text',
        pythonOption : ['-u'],
        scriptPath : '',
        args: [default_path]
    }
    py_Shell.run("./0.1.1/norm.py", py_option, function(err, result){
        console.log("err : " + err);
        console.log(result);
        res_data = result;
        res.send(result);
    });
})

router.put('/deleteImg', function(req, res, next){
    var filePath = './public/download_img/search_img/';
    var data_list = fs.readdirSync('./public/download_img/search_img');
    async.waterfall([
        function(nextCallback){
            for(var i = 0; i < data_list.length; i++){
                fs.unlinkSync(filePath + data_list[i]);
            }
            nextCallback();
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err);
        }
        res.send(200);
    })
});

router.put('/deleteCanvas', function(req, res, next){
    var filePath = './public/canvas_img/canvas_img/canvas.jpg';
    async.waterfall([
        function(nextCallback){
            fs.unlinkSync(filePath);
            nextCallback();
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err);
        }
        res.send(200);
    })
})

router.put('/deleteBottleneck', function(req, res, next){
    var filePath = "./public/bottleneck/";
    var search_list = fs.readdirSync(filePath + 'search_img');
    async.waterfall([
        function(nextCallback){
            for(var i = 0; i < search_list.length; i++){
                fs.unlinkSync(filePath + "search_img/" + search_list[i]);
            }
            nextCallback();
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err);
        }
        res.send(200);
    })
})

router.put('/deleteCanvasBottleneck', function(req, res, next){
    var filePath = "./public/bottleneck/";
    async.waterfall([
        function(nextCallback){
            fs.unlinkSync(filePath + "canvas_img/canvas.jpg_https~tfhub.dev~google~imagenet~inception_v3~feature_vector~1.txt");
            nextCallback();
        }
    ], function(err, result, field){
        if(err){
            console.log('Error : ' + err);
        }
        res.send(200);
    })
})

// router.put('/insertCanvas',upload.single('img_data'), function(req, res, next){
//     var filePath = './public/img_canvas/';
//     var img_data = req.body.img_data;
//     console.log(req.body.img_data)
    
// })
router.put('/insertCanvas', function(req, res, next){
    var filePath = './public/canvas_img/canvas_img/';
    var img_data = req.body.img_data;
    // img_data = img_data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream') 
        // 파일명을 지정한다. 
    // request(requestOptions).pipe(fs.createWriteStream('sample.jpg'));
    var data = img_data.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');   
    console.log(buf)
    fs.writeFile(filePath + 'canvas.jpg', buf);
    res.end();
})

module.exports = router;
var express = require('express')
var ejs = require("ejs")

var app = express()
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var data = {
    'Taro':'taro@yamada',
    'Hanako':'hanako@flower',
    'Sachiko':'sachico@happy',
    'Ichiro':'ichiro@baseball',
}

app.get("/", (req, res) => {
    var msg = 'This is Express Page!<br>'
        + 'これは、トップページです。';
    var url = '/other?name=taro&pass=yamada';
    // index.ejs rendering
    res.render('index.ejs',
        {
            title: 'Index', 
            content: msg,
            link:{href: url, text: '※別のページに移動'},
            data:data
    });
});

// * Post送信の処理
app.post("/", (req, res) => {

    var msg = 'This is Posted Page!<br>' +
        'あなたのは「<br>' + req.body.message +
        '<br>」と送信しました。';
    
    var url = '/other?name=taro&pass=yamada';

    // index.ejs rendering
    res.render('index.ejs',
        {
            title: 'Posted', 
            content: msg,
            link:{href: url, text: '※別のページに移動'},
            data:data
    });
});

// *otherページ
app.get("/other", (req, res) => {
    var name = req.query.name;
    var pass = req.query.pass;

    var msg = 'あなたの名前は「' + name +
        '」<br>パスワードは「' + pass + '」です。';

    // index.ejs rendering
    res.render('index.ejs',
        {
            title: 'other', 
            content: msg,
            link:{href: '/', text: '※トップに戻る'},
            data:data
    });
});

app.listen(3000, () => {
    console.log('Start server port:3000')
})

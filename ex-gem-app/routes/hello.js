var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var msg = 'test';
  if (req.session.message != undefined) {
    msg = "Last Messae: " + req.session.message;
  }


  var name = req.query.name;
  var mail = req.query.mail;

  var data = {
    title: 'Hello',
    content: 'あなたの名前は、' + name + '。<br>' + 
      'メールアドレスは、' + mail +  'です。<br>' +
      'message:' + msg
  };
  res.render('hello', data);
});

/* GET home page. */
router.post('/post', function(req, res, next) {
  var msg = req.body['message'];
  req.session.message = msg;

  var data = {
    title: 'Hello',
    content: 'あなたは、「' + req.session.message + '」と送信しました。'
  };
  res.render('hello', data);
});

module.exports = router;
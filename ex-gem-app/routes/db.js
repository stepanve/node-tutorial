var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('mydb.sqlite3');

var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mydb.sqlite3'
  }
});

var Bookshelf = require('bookshelf')(knex);

var MyData = Bookshelf.Model.extend({
  tableName: 'mydata'
});

router.get('/', (req, res, next) => {
  new MyData().fetchAll().then((collection) => {
    var data = {
      title: 'Hello',
      content: collection.toArray(), // 取得したレコードデータ
    };
    console.log(data);
    res.render('db/index', data);
  })
  .catch((err) => {
    res.status(500).json({error: true, data: {message: err.message}});
  })
})


// データベースオブジェクトの取得
// router.get('/', (req, res, next) => {
//   db.serialize(() => {
//     db.all("select * from mydata", (err, rows) => {
//       if (!err) {
//         var data = {
//           title: 'Hello!',
//           content: rows 
//         };
//         res.render('db/index', data);
//       }
//     })
//   })
// });

router.get('/add', (req, res, next) => {
  var data = {
    title: 'Hello/Add',
    content: '新しいレコード入力:',
    form: {name: '', mail: '', age: 0}
  }
  res.render('db/add', data);
});

router.post('/add', (req, res, next) => {
  var response = res;

  req.check('name', 'NAMEは必ず入力して下さい').notEmpty();
  req.check('mail', 'MAILはメールアドレスを入力して下さい').isEmail();
  req.check('age', 'AGEは年齢を入力下さい').isInt();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      var res = '<ul class="error">';
      var result_arr = result.array();
      for(var n in result_arr) {
        res += '<li>' + result_arr[n].msg + '</li>'
      }
      res += '</ul>';
      var data = {
        title: 'Hello/Add',
        content: res,
        form: req.body
      }
      response.render('db/add', data)
    } else {
      new MyData(req.body).save().then((model) => {
        response.redirect('/db');
      });
      // var nm = req.body.name;
      // var ml = req.body.mail;
      // var ag = req.body.age;
      // db.run('insert into mydata(name, mail, age) values (?, ?, ?)', nm, ml, ag);
      // res.redirect('/db');
    }
  })
});

// データベースオブジェクトの取得
router.get('/show', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if(!err) {
        var data = {
          title: 'DB/show',
          content: 'id = ' + id + ' のレコード',
          mydata: row
        }
        res.render('db/show', data);
      }
    })
  })
});

router.get('/edit', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if(!err) {
        var data = {
          title: 'DB/show',
          content: 'id = ' + id + ' のレコードを編集',
          mydata: row
        }
        res.render('db/edit', data);
      }
    })
  })
});

router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var nm = req.body.name;
  var ml = req.body.mail;
  var ag = req.body.age;
  var q = "update mydata set name = ?, mail = ?, age = ? where id = ?"
  db.run(q, nm, ml, ag, id);
  res.redirect('/db');
});

// データベースオブジェクトの取得
router.get('/delete', (req, res, next) => {
  var id = req.query.id;
  db.serialize(() => {
    var q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if(!err) {
        var data = {
          title: 'DB/Delete',
          content: 'id = ' + id + ' のレコード',
          mydata: row
        }
        res.render('db/delete', data);
      }
    })
  })
});

router.post('/delete', (req, res, next) => {
  var id = req.body.id;
  var q = "delete from mydata where id = ?"
  db.run(q, id);
  res.redirect('/db');
});


router.get('/find', (req, res, next) => {
  var data = {
    title: '/Hello/Find',
    content: '検索IDを入力',
    form: {fstr: ''},
    mydata: null
  };
  res.render('db/find', data);
})

router.post('/find', (req, res, next) => {
  new MyData().where('id', '=', req.body.fstr).fetch().then((collection) => {
      var data = {
        title: 'Hello!',
        content: '*id = ' + req.body.fstr + ' の検索結果：',
        form: req.body,
        mydata: collection
      };
      res.render('db/find', data);
    })
})

Bookshelf.plugin('pagination');
router.get('/:page', (req, res, next) => {
  var pg = req.params.page;
  pg *= 1;
  if (pg < 1) { pg = 1;}
  new MyData().fetchPage({page:pg, pageSize:3}).then((collection) => {
    var data = {
      title: 'Hello!',
      content: collection.toArray(),
      pagination: collection.pagination
    };
    console.log(collection.pagination);
    res.render('db/index', data);
  }).catch((err) => {
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

module.exports = router;
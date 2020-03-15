var express = require('express');
var router = express.Router();

var mysql = require('mysql');

const { check, validationResult } = require('express-validator');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'my-nodeapp-db',
    charset : 'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

router.get('/add', (req, res, next) => {
  var data = {
    title: 'Users/Add',
    form:{name:'', password:'', comment:''},
    content:'※登録する名前・パスワード・コメントを入力ください。'
  }
  res.render('users/add', data);
});
 
/* GET users listing. */
router.post(
  '/add',

   [
      check('name', 'NAME は必ず入力して下さい。').notEmpty(),
      check('password', 'PASSWORD は必ず入力して下さい。').notEmpty()
   ], 

   (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var content = '<ul class="error">';
    var errors_arr = errors.array();
    for(var n in errors_arr) {
      content += '<li>' + errors_arr[n].msg + '</li>'
    }
    content += '</ul>';
    var data = {
      title: 'Users/Add',
      content:content,
      form: req.body
    }
    res.render('users/add', data);
  } else {
    req.session.login = null;
    new User(req.body).save().then((model) => {
      res.redirect('/');
    });
  }
});

router.get('/', (req, res, next) => {
  console.log("/users/にアクセスしました。");
  var data = {
    title: 'Users/Login',
    form: {name:'', password:''},
    content:'名前とパスワードを入力下さい。'
  }
  res.render('users/login', data);
});

router.post(
  '/', 
  [
    check('name', 'NAME は必ず入力して下さい。').notEmpty(),
    check('password', 'PASSWORD は必ず入力して下さい。').notEmpty()
  ],
  
  (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var content = '<ul class="error">';
      var result_arr = errors.array();
      for(var n in result_arr) {
        content += '<li>' + result_arr[n].msg + '</li>'
      }
      content += '</ul>';
      var data = {
        title: 'Users/Login',
        content:content,
        form: req.body
      }
      res.render('users/login', data);
    } else {
      var nm = req.body.name;
      var pw = req.body.password;
      User.query({where: {name:nm}, andWhere: {password: pw}}).fetch().then((model) => {
        if (model == null) {
          var data = {
            title: '再入力',
            content: '<p class="error">名前またはパスワードが違います。</p>',
            form: req.body
          };
          res.render('users/login', data);
        } else {
          req.session.login = model.attributes;
          var data = {
            title: 'Users/Login',
            content:'<p>ログインしました<br>トップページに戻ってメセージを送信して下さい。</p>',
            form: req.body
          };
          res.render('users/login', data);
        }
      });
    }
  })

module.exports = router;

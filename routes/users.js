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
    title: 'Usera/Add',
    form:{name:'', password:'', comment:''},
    content:'※登録する名前・パスワード・コメントを入力ください。'
  }
  res.render('users/add', data);
});
 
/* GET users listing. */
router.post('/add', [check('name', 'NAMW は必ず入力して下さい。').notEmpty(),
check('password', 'PASSWORD は必ず入力して下さい。').notEmpty()], function(req, res, next) {
  var request = req;
  var response = res;
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      var content = '<ul class="error">';
      var result_arr = result.array();
      for(var n in result_arr) {
        content += '<li>' + result_arr[n].msg + '</li>'
      }
      content += '</ul>';
      var data = {
        title: 'Users/Add',
        content:content,
        form: req.body
      }
      response.render('users/add', data);
    } else {
      request.session.login = null;
      new User(req.body).save().then((model) => {
        response.redirect('/');
      });
    }
  });
});

router.get('/', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    form: {name:'', password:''},
    content:'名前とパスワードを入力下さい。'
  }
  res.render('users/login', data);
});

router.post('/', (rep, res, next) => {
  var request = req;
  var response = res;
  req.check('name', 'NAMW は必ず入力して下さい。').notEmpty();
  req.check('password', 'PASSWORD は必ず入力して下さい。').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      var content = '<ul class="error">';
      var result_arr = result.array();
      for(var n in result_arr) {
        content += '<li>' + result_arr[n].msg + '</li>'
      }
      content += '</ul>';
      var data = {
        title: 'Users/Login',
        content:content,
        form: req.body
      }
      response.render('users/login', data);
    } else {
      var np = req.body.name;
      var pw = req.body.password;
      User.query({where: {name:nm}, andWhere: {password: pw}}).fetch().then((model) => {
        if (model == null) {
          var data = {
            title: '再入力',
            content: '<p class="error">名前またはパスワードが違います。</p>',
            form: req.body
          };
          response.render('users/login', data);
        } else {
          request.session.login = model.attributes;
          var data = {
            title: 'Users/Login',
            content:'<p>ログインしました<br>トップページに戻ってメセージを送信して下さい。</p>',
            form: req.body
          };
          response.render('users/login', data);
        }
      });
    }
  })
});

module.exports = router;

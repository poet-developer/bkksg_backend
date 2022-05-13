const express = require('express');
const router = express.Router();
const db = require("../lib/db");

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query(
    `SELECT content.id,content.title,content.description,topic,cover_src FROM content LEFT JOIN type ON content.type_id = type.id WHERE public = 1 ORDER BY content.id DESC`,
    (err1, contents) => {
      if (err1) throw err1;
      res.status(200).render('index', {contents});
      console.log('DATA'+contents[0].title)
    });
});

module.exports = router;
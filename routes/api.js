var express = require('express');
var router = express.Router();
var Search = require('bing.search');
var util = require('util');
var moment = require('moment');
var Image = require('../models/image');

var search = new Search('Lint7Xo+eNkJGnLkg2zgr5DTCL4J0EIzJH1nm5ldizI');

/* GET users listing. */
router.get('/:term', function(req, res, next) {

  function image(url, page, text) {
    this.url = url;
    this.page = page;
    this.text = text;
  }

  var arr = [];
  var offset = req.query.offset;

  var newImage = new Image({
    term: req.params.term,
    when: moment().format('MMMM Do, YYYY, h:mm a')
  });
  Image.saveImage(newImage, function(err, docs) {
    if (err) throw err;
  });

  search.images(req.params.term, function(err, results) {
    if (!offset) {
      results.forEach(function(item) {
        arr.push(new image(item.url, item.sourceUrl, item.title));
      });
      res.send(JSON.stringify(arr, null, 4));
    } else if (offset <= 50) {
      for (var x = 0; x < offset; x++) {
        arr.push(new image(results[x].url, results[x].sourceUrl, results[x].title));
      }
      res.send(JSON.stringify(arr, null, 4));
    } else {
      res.send('You can view up to 50 image results and no more');
    }
  });
});

module.exports = router;

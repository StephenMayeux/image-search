var express = require('express');
var router = express.Router();
var Search = require('bing.search');
var util = require('util');

var search = new Search('Lint7Xo+eNkJGnLkg2zgr5DTCL4J0EIzJH1nm5ldizI');

/* GET users listing. */
router.get('/:term', function(req, res, next) {

  function image(url, page, text) {
    this.url = url;
    this.page = page;
    this.text = text;
  }

  var arr = [];

  search.images(req.params.term, function(err, results) {
    results.forEach(function(item) {
      arr.push(new image(item.url, item.sourceUrl, item.title));
    });
      res.send(JSON.stringify(arr, null, 4));
  });
});

module.exports = router;

// Required Modules
var express = require('express');
var router = express.Router();
var Search = require('bing.search');
var util = require('util');
var moment = require('moment');
var Image = require('../models/image');

// API Token for Bing Search
var search = new Search('Lint7Xo+eNkJGnLkg2zgr5DTCL4J0EIzJH1nm5ldizI');

router.get('/:term', function(req, res, next) {

  // Create new objects to store Bing data
  function image(url, page, text) {
    this.url = url;
    this.page = page;
    this.text = text;
  }

  var arr = [];
  var offset = req.query.offset;

  // Save searches to DB & do it before hitting Bing API
  var newImage = new Image({
    term: req.params.term,
    when: moment().format('MMMM Do, YYYY, h:mm a')
  });
  Image.saveImage(newImage, function(err, docs) {
    if (err) throw err;
  });

  // Bing image search API
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

// View searches that are stored in DB
router.get('/view/history', function(req, res, next) {

  var arr = [];
  function terms(term, when) {
    this.term = term;
    this.when = when;
  }

  Image.findAll({}, function(err, docs) {
    if (err) throw err;
    if (!docs.length) {
      res.send('There is no search history available');
    } else {
      docs.forEach(function(item) {
        arr.push(new terms(item.term, item.when));
      });
      res.send(JSON.stringify(arr.reverse(), null, 4));
    }
  });
});

module.exports = router;

/* Description:
 *   Loads content from Sean Martell's Mozilla logo page.
 *
 * Dependencies:
 *   none
 *
 * Author:
 *    mythmon
 */

var Promise = require('es6-promise').Promise;
var cheerio = require('cheerio');
var nunjucks = require('nunjucks');


module.exports = function(corsica) {

  nunjucks.configure(__dirname);

  var allImages = corsica.http('http://blog.seanmartell.com/brands/')
  .then(function(data) {
    var $ = cheerio.load(data);
    var imageNodes = $('.masonry-post');
    var imageData = [];
    imageNodes.each(function(i, node) {
      imageData.push({
        title: $(node).find('p').text(),
        url: $(node).find('img').attr('src') + '?utm_source=corsica',
      });
    });
    return imageData;
  });

  corsica.on('martell', function(content) {
    allImages.then(function(images) {
      var r = Math.floor(Math.random() * images.length);
      var img = images[r];
      console.log('sending', img);
      corsica.sendMessage('content', {
      // console.log('sending', {
        type: 'html',
        screen: content.screen,
        content: nunjucks.render('template.html', img),
      });
    })
    .catch(function(err) {
      console.error('AHHHH', err);
    });

    return content;
  });
};

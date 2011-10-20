var gpFavicon = com.ginpen.gpFavicon;
var $list;

module('favicon', {
  setup: function() {
    $list = $('#list');
    $links = $list.children().clone();
  },
  teardown: function() {
    $list
      .empty()
      .append($links.clone());
  }
});

test('general', function() {
  ok($().gpFavicon, 'jQuery.gpFavicon');
  ok(com.ginpen.gpFavicon, 'com.ginpen.gpFavicon');

  this.teardown();  // trim
  var html = $list.html();
  $list.empty();
  this.teardown();
  equal($list.html(), html, 'teardown() reverts elements');
});

test('find links', function() {
  $links = gpFavicon._find($list);
  equal($links.length, 8, 'Find a element without not having href attribute from target');
});

test('check available', function() {
  $link = $('<a />').attr('href', 'http://example.com');
  ok(gpFavicon._isAvailable($link), 'normal link');

  $link = $('<span />').attr('href', 'http://example.com');
  ok(!gpFavicon._isAvailable($link), 'not link');

  $link = $('<a />');
  ok(!gpFavicon._isAvailable($link), 'no href attr');

  $link = $('<a />').attr('href', 'http://example.com').addClass('gpfavicon-ignore');
  ok(!gpFavicon._isAvailable($link), 'ignore flagged');

  $link = $('<a />').attr('href', '#');
  ok(!gpFavicon._isAvailable($link), 'own site');

  $link = $('<a />').attr('href', '#');
  var settings = { self: true };
  ok(gpFavicon._isAvailable($link, settings), 'own site but specified');
});

test('make favicon url', function() {
  var own = $('<a />').attr('href', '/').prop('href') + 'favicon.ico';

  var url = gpFavicon._makeUrl($('<a href="http://example.com" />'))
  equal(url, 'http://example.com/favicon.ico', 'without path');

  var url = gpFavicon._makeUrl($('<a href="http://example.com/" />'))
  equal(url, 'http://example.com/favicon.ico', 'root');

  var url = gpFavicon._makeUrl($('<a href="http://example.com/path/to.the?target/#file/" />'))
  equal(url, 'http://example.com/favicon.ico', 'deep path');

  var url = gpFavicon._makeUrl($('<a href="" />'))
  equal(url, own, 'empty');

  var url = gpFavicon._makeUrl($('<a href="#id" />'))
  equal(url, own, 'hash');

  var url = gpFavicon._makeUrl($('<a href="/" />'))
  equal(url, own, 'self root');

  var url = gpFavicon._makeUrl($('<a href="https://example.com/" />'))
  equal(url, 'https://example.com/favicon.ico', 'ssl');

  var url = gpFavicon._makeUrl($('<a href="ftp://example.com/" />'))
  notEqual(url, null, 'ftp');
  equal(url, gpFavicon.DEFAULT.url, 'ftp');

  var settings = {
    url: 'about:blank'
  };
  var url = gpFavicon._makeUrl($('<a href="ftp://example.com/" />'), settings)
  equal(url, 'about:blank', 'ftp');
});

test('build icon img element', function() {
  var $ico = gpFavicon._buildHtml('#');
  equal($ico.attr('src'), '#', 'without width nor height');
  equal($ico.attr('alt'), '', 'without width nor height');
  ok($ico.hasClass('gpfavicon'), 'without width nor height');
  equal($ico.attr('width'), '16', 'without width nor height');
  equal($ico.attr('height'), '16', 'without width nor height');

  var $ico = gpFavicon._buildHtml('#', 32, -1, 'hoge fuga');
  equal($ico.attr('width'), '32', 'specified width');
  equal($ico.attr('height'), '16', 'minas height');
  ok($ico.hasClass('gpfavicon'), 'classes');
  ok($ico.hasClass('hoge'), 'classes');
  ok($ico.hasClass('fuga'), 'classes');

  var $ico = gpFavicon._buildHtml('#', 0, 64);
  equal($ico.attr('width'), '16', 'zero width');
  equal($ico.attr('height'), '64', 'specified height');

  var $ico = gpFavicon._buildHtml('#', '1', 3.14);
  equal($ico.attr('width'), '1', 'string width');
  equal($ico.attr('height'), '3', 'decimal height');

  var $ico = gpFavicon._buildHtml('#', null, new Date());
  equal($ico.attr('width'), '16', 'invald width');
  equal($ico.attr('height'), '16', 'invald height');
});

test('default icon when errored', function() {
  stop();
  var $ico = gpFavicon._buildHtml('about:blank');
  (function() {
    if ($ico.attr('src') == gpFavicon.DEFAULT.url) {
      start();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

test('insert icon', function() {
  var $container = $('<div />');
  var $link = $('<a />').text('text').appendTo($container);
  var $icon = gpFavicon._buildHtml('#');
  gpFavicon._insert($link, $icon);
  equal($container.children().length, 1, 'inside before');
  equal($container.children()[0], $link[0], 'inside before');
  equal($link.contents()[0], $icon[0], 'inside before');

  var $container = $('<div />');
  var $link = $('<a />').text('text').appendTo($container);
  var $icon = gpFavicon._buildHtml('#');
  gpFavicon._insert($link, $icon, false);
  equal($container.children().length, 2, 'outside before');
  equal($container.children()[0], $icon[0], 'outside before');
  equal($container.children()[1], $link[0], 'outside before');

  var $container = $('<div />');
  var $link = $('<a />').text('text').appendTo($container);
  var $icon = gpFavicon._buildHtml('#');
  gpFavicon._insert($link, $icon, true, true);
  equal($container.children().length, 1, 'inside after');
  equal($container.children()[0], $link[0], 'inside after');
  equal($link.contents()[1], $icon[0], 'inside after');

  var $container = $('<div />');
  var $link = $('<a />').text('text').appendTo($container);
  var $icon = gpFavicon._buildHtml('#');
  gpFavicon._insert($link, $icon, false, true);
  equal($container.children().length, 2, 'outside after');
  equal($container.children()[0], $link[0], 'outside after');
  equal($container.children()[1], $icon[0], 'outside after');
});

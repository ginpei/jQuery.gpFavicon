/**
 * jQuery.gpFavicon 1.0
 * http://ginpen.com/jquery/gpfavicon/
 * https://github.com/ginpei/jQuery.gpFavicon
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpFavicon) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpFavicon = com.ginpen.gpFavicon = {
        /**
         * The version of this applycation.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Default settings.
         * @type Object
         */
        DEFAULT: {
            after: false,
            classes: null,
            inside: true,
            self: false,

            url: 'data:image/gif;base64,R0lGODlhEAAQAPcAAICAgM7PzpSU'
              + 'lHJycmVlZe/v74CAgHd3d76+vubm5rm5uaqqqmxsbK6urv7+/s'
              + 'HBwdvb29bW1p6envn5+bOzs+Li4vLy8tLS0sfHx6KiomZmZgAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
              + 'AAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAi2AAEIBBBAwA'
              + 'ANAwQEGMiwgIEDCDA8SIDggIECDRlIWPCgQgIHIDMwwCjQQIMA'
              + 'CygkgADSAYYMBgRGGOAyZQMELREoGBABgAQFDhQs4DihJQQMFC'
              + 'QAMFDB5QMIH1taoBAh5oACDiwgKNrSAcoKA5Y2dVAggIWuEy5A'
              + 'iPmz5QQEKbGCVKB0Zle4QyOA5FmyQUuUQ1k2iCmwAAO/IB8swN'
              + 'lgZMOHCBIIVWCRJEOCBgkkXHi5s2eBAQEAOw=='
        },

        /**
         * @param {Object} settings
         * @returns {Object}
         */
        mergeSettings: function(settings) {
            return $.extend({}, gpFavicon.DEFAULT, settings);
        },

        /**
         * Called by jQuery interface.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings Settings map.
         */
        exec: function($el, settings) {
            if (this._isAvailable($el)) {
                this.build($el, settings);
            }
            else {
                var $links = this._find($el, settings);
                for (var i = 0, l = $links.length; i < l; i++) {
                    var $link = $links.eq(i);
                    if (this._isAvailable($link)) {
                        this.build($link, settings);
                    }
                }
            }
        },

        /**
         * Return true if $link is target element.
         * @param {HtmlElement} $link
         * @param {Object} settings Settings map.
         * @returns {Boolean}
         */
        _isAvailable: function($link, settings) {
            settings = settings || {};

            if ($link.prop('tagName') && $link.prop('tagName').toLowerCase() != 'a') {
                return false;
            }
            if ($link.attr('href') == null) {
                return false;
            }
            if ($link.hasClass('gpfavicon-ignore')) {
                return false;
            }

            var url = $link.prop('href');
            var origin = $('<a />').attr('href', '/').prop('href');
            if (url.indexOf(origin) == 0 && !settings.self) {
                return false;
            }

            return true;
        },

        /**
         * Create img element and append.
         */
        build: function($link, settings) {
            settings = settings || {};

            var imgUrl = this._makeUrl($link, settings);
            var $img = this._buildHtml(imgUrl, settings.width, settings.height);
            this._insert($link, $img, settings.inside, settings.after);
        },

        /**
         * Find links (a elements) under target.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings Settings map.
         */
        _find: function($el, settings) {
            return $el.find('a[href]');
        },

        /**
         * Make icon image URL.
         * @param {HtmlElement} $link Target element.
         * @param {Object} settings Settings map.
         */
        _makeUrl: function($link, settings) {
            settings = settings || {};

            var linkUrl = $link.prop('href');
            var matched = linkUrl.match(/^https?:\/\/[^\/]+\//);
            if (matched && matched[0]) {
                return matched[0] + 'favicon.ico';
            }
            else {
                return settings.url || this.DEFAULT.url;
            }
        },

        /**
         * Build icon image element.
         * @param {String} url For icon image.
         * @param {Number} [width] Default=16.
         * @param {Number} [height] Default=16.
         * @returns {HtmlElement} <img />
         */
        _buildHtml: function(url, width, height, classes) {
            height = parseInt(height);
            if (isNaN(height) || height < 1) {
                height = 16;
            }

            width = parseInt(width);
            if (isNaN(width) || width < 1) {
                width = 16;
            }

            return $('<img />')
                .attr({
                    alt: '',
                    height: height,
                    src: url,
                    width: width
                })
                .addClass('gpfavicon')
                .addClass(classes)
                .error(function() {
                    $(this).unbind('error', arguments.callee);
                    gpFavicon.a_onerror.apply(this, arguments);
                });
        },

        /**
         * <this> is img element.
         * @see #_buildHtml
         */
        a_onerror: function(event) {
            this.src = gpFavicon.DEFAULT.url;
        },

        /**
         * Insert img element before/after a element.
         * @param {HtmlElement} $link
         * @param {HtmlElement} $img
         * @param {Boolean} [inside] Append under if true. Default=true.
         * @param {Boolean} [after] Insert after if true. Default=false.
         */
        _insert: function($link, $img, inside, after) {
            if (inside == undefined) {
                inside = true;
            }

            if (inside) {
                if (after) {
                    $img.appendTo($link);
                }
                else {
                    $img.prependTo($link);
                }
            }
            else {
                if (after) {
                    $img.insertAfter($link);
                }
                else {
                    $img.insertBefore($link);
                }
            }
        },

        banpei: null
    };

    // jQuery method interface
    $.fn.gpFavicon = function(settings) {
        settings = gpFavicon.mergeSettings(settings);
        for (var i = 0, l = this.length; i < l; i++) {
            gpFavicon.exec(this.eq(i), settings);
        }

        return this;
    };
}(jQuery));

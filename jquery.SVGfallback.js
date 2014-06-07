/*!
 Author: Nazarkin Roman (http://nazarkin.su)
 Twitter: @nazarkin_roman
 Version: 1.0
 License: MIT
 */

(function ($) {
    jQuery.fn.svgFallback = function (options) {
        options = $.extend({
            allowExternalImages: false,
            cachePrefix        : 'svgCache_',
            cacheEnabled       : true,
            storage            : sessionStorage
        }, options);

        // check SVG support
        if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"))
            return this;

        /**
         * Save conversation result to specified storage
         * @returns {object}
         */
        var localStorageApi = function () {
            this.set = function (index, value) {
                options.storage.setItem(options.cachePrefix + index, value);
                return true;
            };

            this.get = function (index) {
                return options.storage.getItem(options.cachePrefix + index);
            };

            this.remove = function(index) {
                options.storage.removeItem(options.cachePrefix + index);
                return true;
            };

            this.checkStorage = function () {
                try {
                    return typeof options.storage            == 'object'
                        && typeof options.storage.setItem    == 'function'
                        && typeof options.storage.getItem    == 'function'
                        && typeof options.storage.removeItem == 'function';
                } catch (e) {
                    return false;
                }
            };

            // fallback
            if (!options.cacheEnabled || !this.checkStorage()) {
                if (options.cacheEnabled) console.error('svgFallback: provided storage does not match signature');

                this.set    = function(index, value) { return false; };
                this.get    = function(index) { return null; };
                this.remove = function(index) { return null; };
            }

            return this;
        };

        /**
         * Local Storage API Class
         * @type {localStorageApi}
         */
        var LS = new localStorageApi();

        /**
         * URL Validation regular expression
         * @type {RegExp}
         */
        var check_regex = new RegExp("^(ht|f)tps?:\/\/([a-z0-9-\\.]+\\.[a-z]{2,4})\/.*\\.png");

        /**
         * Regular Expression for relative URLs
         * @type {RegExp}
         */
        var check_regex_relative = new RegExp("^\/*([a-z0-9-\\.]+\/)*[a-z0-9-\\.]+\\.png$");

        /**
         * Validate Image URL
         * @param str
         * @returns {boolean}
         */
        var validateUrl = function (str) {
            str = $.trim(str); // trim useless spaces from string

            if (check_regex_relative.test(str)) return true;
            if (check_regex.test(str)) {
                var urlParts = str.match(check_regex);
                if (!options.allowExternalImages && urlParts[2] !== location.hostname) return false;
            }

            return true;
        };

        /**
         * All links in format link => array of selectors
         * @type {object}
         */
        var linksArray = {};

        /**
         * Collect URLs to array
         */
        this.each(function (index, element)
        {
            var original_src = $(element).attr('src');
            if (!original_src || !validateUrl(original_src)) return;

            var svg_src = original_src.replace(/(\.png)$/, '.svg');
            var stored = LS.get(svg_src);

            // work with cache
            if (stored == 'false') return;
            if (stored == 'true') {
                $(element).attr('src', svg_src);
                $(element).error(function() {
                    LS.remove(svg_src); // something went wrong, so delete cache for this image
                    $(this).attr('src', original_src); // oh shit, go back
                });
                return;
            }

            // add link & selector to array
            if(typeof linksArray[svg_src] != 'undefined') linksArray[svg_src].push(element);
            else linksArray[svg_src] = [element];
        });

        /**
         * Process URLs
         */
        $.each(linksArray, function(svg_src, selectors)
        {
            $.ajax({
                url    : svg_src,
                type   : 'HEAD',
                async  : true,
                success: function () {
                    $(selectors).attr('src', svg_src);
                    LS.set(svg_src, 'true');
                },
                error  : function () {
                    LS.set(svg_src, 'false');
                }
            });
        });

        return this;
    };
})(jQuery);
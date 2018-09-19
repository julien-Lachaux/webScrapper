'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _webScrapper = require('./webScrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSupremeArticles = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var supremeArticles, result, i, articleUrl, articleImg, articleDetail, articleName, articleModel, articleDescription, articlePriceBrut, articlePrice, articlePriceUnit, articlesSizes, article;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('init scrapping');
                        _webScrapper.webScrapper.setUrl('https://www.supremenewyork.com/shop/all');
                        _context.next = 4;
                        return _webScrapper.webScrapper.init();

                    case 4:
                        _context.next = 6;
                        return _webScrapper.webScrapper.getElementsArray('#container article');

                    case 6:
                        supremeArticles = _context.sent;
                        result = [];
                        i = 0;

                    case 9:
                        if (!(i < 6)) {
                            _context.next = 48;
                            break;
                        }

                        console.log('article ' + i + ' on ' + supremeArticles.length);
                        _context.next = 13;
                        return supremeArticles[i].$eval('.inner-article a', function (e) {
                            return e.href;
                        });

                    case 13:
                        articleUrl = _context.sent;
                        _context.next = 16;
                        return supremeArticles[i].$eval('.inner-article img', function (e) {
                            return e.src;
                        });

                    case 16:
                        articleImg = _context.sent;
                        _context.next = 19;
                        return _webScrapper.webScrapper.subScrapping(articleUrl);

                    case 19:
                        _context.next = 21;
                        return _webScrapper.webScrapper.getElementsArray('#container', true);

                    case 21:
                        articleDetail = _context.sent[0];
                        _context.next = 24;
                        return articleDetail.$eval('h1.protect', function (e) {
                            return e.innerText;
                        });

                    case 24:
                        articleName = _context.sent;
                        _context.next = 27;
                        return articleDetail.$eval('p[itemprop="model"]', function (e) {
                            return e.innerText;
                        });

                    case 27:
                        articleModel = _context.sent;
                        _context.next = 30;
                        return articleDetail.$eval('p[itemprop="description"]', function (e) {
                            return e.innerText;
                        });

                    case 30:
                        articleDescription = _context.sent;
                        _context.next = 33;
                        return articleDetail.$eval('p[itemprop="offers"] span', function (e) {
                            return e.innerText;
                        });

                    case 33:
                        articlePriceBrut = _context.sent;
                        articlePrice = articlePriceBrut.substring(1);
                        articlePriceUnit = articlePriceBrut.substring(0, 1);
                        _context.next = 38;
                        return _webScrapper.webScrapper.sub.page.evaluate(function () {
                            var sizes = [];
                            var sizesDomArray = document.querySelectorAll('#size option');
                            if (sizesDomArray.length !== 0) {
                                sizesDomArray.forEach(function (option) {
                                    console.log(option);
                                    sizes.push(option.innerText);
                                });
                            }

                            return sizes;
                        });

                    case 38:
                        articlesSizes = _context.sent;

                        console.log(articlesSizes);

                        if (articlesSizes.length === 0) {
                            articlesSizes.push('Unique');
                        }

                        _webScrapper.webScrapper.destroySub();

                        article = {
                            name: articleName,
                            model: articleModel,
                            description: articleDescription,
                            url: articleUrl,
                            img: articleImg,
                            price: articlePrice,
                            priceUnit: articlePriceUnit,
                            sizes: articlesSizes
                        };

                        result.push(article);

                        article = {};

                    case 45:
                        i++;
                        _context.next = 9;
                        break;

                    case 48:
                        _context.next = 50;
                        return _webScrapper.webScrapper.end();

                    case 50:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getSupremeArticles() {
        return _ref.apply(this, arguments);
    };
}();

getSupremeArticles();
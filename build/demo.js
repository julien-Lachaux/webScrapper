'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsoncache = require('@julien-lachaux/jsoncache');

var _webScrapper = require('./webScrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSupremeArticles = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var supremeArticles, result, i, articleUrl, articleImg, articleSoldOut, articleDetail, articleName, articleModel, article, articleDescription, articlePriceBrut, articlePrice, articlePriceUnit, articleSizes, finalResult;
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
                        if (!(i < 2)) {
                            _context.next = 61;
                            break;
                        }

                        console.log('article ' + (i + 1) + ' on ' + (supremeArticles.length + 1) + '\r');
                        _context.next = 13;
                        return _webScrapper.webScrapper.getElementData(supremeArticles[i], '.inner-article a', 'href');

                    case 13:
                        articleUrl = _context.sent;
                        _context.next = 16;
                        return _webScrapper.webScrapper.getElementData(supremeArticles[i], '.inner-article img', 'src');

                    case 16:
                        articleImg = _context.sent;
                        _context.prev = 17;
                        _context.next = 20;
                        return _webScrapper.webScrapper.getElementData(supremeArticles[i], '.sold_out_tag');

                    case 20:
                        articleSoldOut = _context.sent;
                        _context.next = 26;
                        break;

                    case 23:
                        _context.prev = 23;
                        _context.t0 = _context['catch'](17);

                        // DEBUG
                        // console.log(error)
                        articleSoldOut = undefined;

                    case 26:
                        _context.next = 28;
                        return _webScrapper.webScrapper.subScrapping(articleUrl);

                    case 28:
                        _context.next = 30;
                        return _webScrapper.webScrapper.getElementsArray('#container', true);

                    case 30:
                        articleDetail = _context.sent[0];
                        _context.next = 33;
                        return _webScrapper.webScrapper.getElementData(articleDetail, 'h1.protect');

                    case 33:
                        articleName = _context.sent;
                        _context.next = 36;
                        return _webScrapper.webScrapper.getElementData(articleDetail, 'p[itemprop="model"]');

                    case 36:
                        articleModel = _context.sent;

                        if (!(articleSoldOut !== undefined)) {
                            _context.next = 42;
                            break;
                        }

                        article = {
                            name: articleName,
                            model: articleModel,
                            img: articleImg,
                            url: articleUrl,
                            sold_out: true
                        };

                        _webScrapper.webScrapper.destroySub();
                        _context.next = 56;
                        break;

                    case 42:
                        _context.next = 44;
                        return _webScrapper.webScrapper.getElementData(articleDetail, 'p[itemprop="description"]');

                    case 44:
                        articleDescription = _context.sent;
                        _context.next = 47;
                        return _webScrapper.webScrapper.getElementData(articleDetail, 'p[itemprop="offers"] span');

                    case 47:
                        articlePriceBrut = _context.sent;
                        articlePrice = articlePriceBrut.substring(1);
                        articlePriceUnit = articlePriceBrut.substring(0, 1);
                        _context.next = 52;
                        return _webScrapper.webScrapper.sub.page.evaluate(function () {
                            var sizes = [];
                            var sizesDomArray = document.querySelectorAll('#size option');
                            if (sizesDomArray.length !== 0) {
                                sizesDomArray.forEach(function (option) {
                                    sizes.push(option.innerText);
                                });
                            }
                            return sizes;
                        });

                    case 52:
                        articleSizes = _context.sent;


                        if (articleSizes.length === 0) {
                            articleSizes.push('Unique');
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
                            sizes: articleSizes
                        };

                    case 56:

                        result.push(article);
                        article = {};

                    case 58:
                        i++;
                        _context.next = 9;
                        break;

                    case 61:
                        _context.next = 63;
                        return _webScrapper.webScrapper.end();

                    case 63:

                        _jsoncache.jsonCache.write(result, 'articles');

                        _context.next = 66;
                        return _jsoncache.jsonCache.getMostRecentFile('articles');

                    case 66:
                        finalResult = _context.sent;
                        return _context.abrupt('return', finalResult);

                    case 68:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[17, 23]]);
    }));

    return function getSupremeArticles() {
        return _ref.apply(this, arguments);
    };
}();

getSupremeArticles();
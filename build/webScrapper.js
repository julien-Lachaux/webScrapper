'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.webScrapper = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getJobsOffers = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(villes, contrats, pagination) {
        var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function (result) {};

        var browser, page, url, urlParam, i, _i, html, offres, _i2, poste, entreprise, logo, href, data, contrat, ville, date, id, offre, result;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return _puppeteer2.default.launch({ args: ['--no-sandbox'] });

                    case 2:
                        browser = _context8.sent;
                        _context8.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context8.sent;


                        // construction de l'url à scrapper
                        url = 'https://www.welcometothejungle.co/jobs';
                        urlParam = {
                            refinementList: {
                                office: { district: villes },
                                contract_type_names: { fr: contrats }
                            },
                            page: pagination.page,
                            configure: {
                                filters: "website.reference%3Awttj_fr",
                                hitsPerPage: pagination.hitsPerPage
                            },
                            query: query
                        };


                        url = url + '?';

                        // les villes
                        for (i = 0; i < urlParam.refinementList.office.district.length; i++) {
                            if (i >= 1) {
                                url = url + '&';
                            }
                            url = url + 'refinementList[office.district][' + i + ']=' + urlParam.refinementList.office.district[i];
                        }

                        // les types de contrats
                        for (_i = 0; _i < urlParam.refinementList.contract_type_names.fr.length; _i++) {
                            url = url + '&';
                            url = url + 'refinementList[contract_type_names.fr][' + _i + ']=' + urlParam.refinementList.contract_type_names.fr[_i];
                        }

                        // la pagination est les filtres supplémentaires
                        url = url + '&configure%5Bfilters%5D=' + urlParam.configure.filters;
                        url = url + '&configure%5BhitsPerPage%5D=' + urlParam.configure.hitsPerPage;
                        url = url + '&page=' + urlParam.page;

                        // recherche
                        url = url + '&query=' + urlParam.query;

                        // console.log(url)

                        _context8.next = 17;
                        return page.goto(url);

                    case 17:
                        _context8.next = 19;
                        return page.screenshot({ path: "data/screenshot.png" });

                    case 19:
                        _context8.next = 21;
                        return page.$$('.ais-Hits-item');

                    case 21:
                        html = _context8.sent;
                        offres = [];
                        _i2 = 0;

                    case 24:
                        if (!(_i2 < html.length)) {
                            _context8.next = 55;
                            break;
                        }

                        _context8.next = 27;
                        return html[_i2].$eval('h3 .ais-Highlight-nonHighlighted', function (e) {
                            return e.innerText;
                        });

                    case 27:
                        poste = _context8.sent;
                        _context8.next = 30;
                        return html[_i2].$eval('h4 .ais-Highlight-nonHighlighted', function (e) {
                            return e.innerText;
                        });

                    case 30:
                        entreprise = _context8.sent;
                        _context8.next = 33;
                        return html[_i2].$eval('img.zphx8j-4', function (e) {
                            return e.src;
                        });

                    case 33:
                        logo = _context8.sent;
                        _context8.next = 36;
                        return html[_i2].$eval('a', function (e) {
                            return e.href;
                        });

                    case 36:
                        href = _context8.sent;
                        _context8.next = 39;
                        return html[0].$$('.sc-bXGyLb');

                    case 39:
                        data = _context8.sent;
                        _context8.next = 42;
                        return data[0].$eval('.sc-cbkKFq span', function (e) {
                            return e.innerText;
                        });

                    case 42:
                        contrat = _context8.sent;
                        _context8.next = 45;
                        return data[1].$eval('.sc-cbkKFq', function (e) {
                            return e.innerText;
                        });

                    case 45:
                        ville = _context8.sent;
                        _context8.next = 48;
                        return data[2].$eval('.sc-cbkKFq span', function (e) {
                            return e.innerText;
                        });

                    case 48:
                        date = _context8.sent;
                        id = entreprise + ' - ' + poste;
                        offre = { id: id, poste: poste, entreprise: entreprise, logo: logo, href: href, contrat: contrat, ville: ville, date: date };


                        offres.push(offre);

                    case 52:
                        _i2++;
                        _context8.next = 24;
                        break;

                    case 55:
                        _context8.next = 57;
                        return browser.close();

                    case 57:
                        if (!(offres.length === 0)) {
                            _context8.next = 61;
                            break;
                        }

                        console.log('SCRAPPING FAILED !!');
                        _context8.next = 68;
                        break;

                    case 61:
                        result = [];

                        if (!_fs2.default.existsSync('data/history.json')) {
                            _context8.next = 67;
                            break;
                        }

                        _context8.next = 65;
                        return _fs2.default.readFile('data/history.json', function (err, data) {
                            if (err) throw err;

                            data = JSON.parse(data.toString());
                            offres.forEach(function (offre) {
                                var test = data.filter(function (element) {
                                    return element.id === offre.id;
                                });
                                if (test.length === 0) {
                                    result.push(offre);
                                }
                            });
                            _fs2.default.writeFile('data/history.json', JSON.stringify(offres), function (err) {
                                if (err) throw err;
                                callback(result);
                                console.log('New scrapping result write (nbr of results: ' + result.length + ')');
                            });
                        });

                    case 65:
                        _context8.next = 68;
                        break;

                    case 67:
                        _fs2.default.writeFile('data/history.json', JSON.stringify(offres), function (err) {
                            if (err) throw err;
                            result = offres;
                            callback(result);
                            console.log('New scrapping result write (nbr of results: ' + result.length + ')');
                        });

                    case 68:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function getJobsOffers(_x4, _x5, _x6) {
        return _ref.apply(this, arguments);
    };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// loadind dependencies
var webScrapper = exports.webScrapper = {
    /**
     * setUrl
     * Define the url to scrapp into the object
     * @param {string} url url to scrapp 
     */
    setUrl: function setUrl(url) {
        this.url = url;
    },


    /**
     * init
     * initialiaze the webScrapper to the url
     * /!\ THE URL MUST BE DEFINED BEFORE /!\
     */
    init: function init() {
        var _this = this;

        var onlyHtml = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(_this.url === undefined)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return', false);

                        case 2:
                            _context.next = 4;
                            return _puppeteer2.default.launch({ args: ['--no-sandbox'] });

                        case 4:
                            _this.browser = _context.sent;
                            _context.next = 7;
                            return _this.browser.newPage();

                        case 7:
                            _this.page = _context.sent;

                            if (!onlyHtml) {
                                _context.next = 12;
                                break;
                            }

                            _context.next = 11;
                            return _this.page.setRequestInterception(true);

                        case 11:

                            _this.page.on('request', function (request) {
                                if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                                    request.abort();
                                } else {
                                    request.continue();
                                }
                            });

                        case 12:
                            _context.next = 14;
                            return _this.page.goto(_this.url);

                        case 14:
                            _context.next = 16;
                            return _this.page.screenshot({ path: "temp/screenshot.png" });

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    goto: function goto(url) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return _this2.page.goto(url);

                        case 2:
                            return _context2.abrupt('return', true);

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    },


    /**
     * end
     * finish the scrapp session
     */
    end: function end() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return _this3.browser.close();

                        case 2:
                            return _context3.abrupt('return', true);

                        case 3:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },


    /**
     * return an array of dom elements
     * @param {string} selector css selector
     * @param {boolean} sub if true the sub brower will be used
     */
    getElementsArray: function getElementsArray(selector) {
        var _this4 = this;

        var sub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var elementsArray, _elementsArray;

            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (sub) {
                                _context4.next = 5;
                                break;
                            }

                            _context4.next = 3;
                            return _this4.page.$$(selector);

                        case 3:
                            elementsArray = _context4.sent;
                            return _context4.abrupt('return', elementsArray);

                        case 5:
                            if (!(_this4.sub.page !== undefined)) {
                                _context4.next = 10;
                                break;
                            }

                            _context4.next = 8;
                            return _this4.sub.page.$$(selector);

                        case 8:
                            _elementsArray = _context4.sent;
                            return _context4.abrupt('return', _elementsArray);

                        case 10:
                            return _context4.abrupt('return', false);

                        case 11:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    },


    /**
     * getElementData
     * return the value of an specified attribute of a specified element for a specified selector
     * @param {Object} element 
     * @param {string} selector 
     * @param {string} attribute 
     */
    getElementData: function getElementData(element, selector) {
        var _this5 = this;

        var attribute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'innerText';
        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var elementData;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            elementData = {};
                            _context5.t0 = attribute;
                            _context5.next = _context5.t0 === 'href' ? 4 : _context5.t0 === 'innerText' ? 8 : _context5.t0 === 'src' ? 12 : 16;
                            break;

                        case 4:
                            _context5.next = 6;
                            return element.$eval(selector, function (e) {
                                return e.href;
                            });

                        case 6:
                            elementData = _context5.sent;
                            return _context5.abrupt('break', 20);

                        case 8:
                            _context5.next = 10;
                            return element.$eval(selector, function (e) {
                                return e.innerText;
                            });

                        case 10:
                            elementData = _context5.sent;
                            return _context5.abrupt('break', 20);

                        case 12:
                            _context5.next = 14;
                            return element.$eval(selector, function (e) {
                                return e.src;
                            });

                        case 14:
                            elementData = _context5.sent;
                            return _context5.abrupt('break', 20);

                        case 16:
                            _context5.next = 18;
                            return element.$eval(selector, function (e) {
                                return e.getAttribute(attribute);
                            });

                        case 18:
                            elementData = _context5.sent;
                            return _context5.abrupt('break', 20);

                        case 20:
                            return _context5.abrupt('return', elementData);

                        case 21:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5);
        }))();
    },


    /**
     * subScrapping
     * init a sub browser
     * @param {string} url url to scrapp for the sub browser
     */
    subScrapping: function subScrapping(url) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return _puppeteer2.default.launch({ args: ['--no-sandbox'] });

                        case 2:
                            _context6.t0 = _context6.sent;
                            _this6.sub = {
                                browser: _context6.t0
                            };
                            _context6.next = 6;
                            return _this6.sub.browser.newPage();

                        case 6:
                            _this6.sub.page = _context6.sent;
                            _context6.next = 9;
                            return _this6.sub.page.goto(url);

                        case 9:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6);
        }))();
    },


    /**
     * destroy the sub browser
     */
    destroySub: function destroySub() {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.next = 2;
                            return _this7.sub.browser.close();

                        case 2:
                            _this7.sub = undefined;

                        case 3:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this7);
        }))();
    }
};
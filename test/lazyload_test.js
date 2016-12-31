var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LazyLoad ', function(){

    var lazyload = require('../app/js/gallery/lazyload');

    var ERROR = /lazyLoad requires image src String and DOM Node args/;

    it('should throw error if first argument is not a String', function(){

        var fnBad = function(){lazyload({}, document.createElement('div'))};
        var fnGood = function(){lazyload('', document.createElement('div'))};

        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('should throw error if second argument is not a Node', function(){

        var fnBad = function(){lazyload('', '#type-error')};
        var fnGood = function(){lazyload('', document.createElement('div'))};

        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('should increase childNodes count to one', function(){

        var figure = {
            src: 'https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg',
            el: document.createElement('div')
        };

        lazyload(figure.src, figure.el);
        expect(figure.el.childNodes.length).to.equal(1);
    });

    it('should register mouseover event handler on image', function(){

        var figure = {
            src: 'https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg',
            el: document.createElement('div')
        };

        lazyload(figure.src, figure.el);

        expect(typeof figure.el.firstChild.onmouseover).to.equal('function');
    });

});
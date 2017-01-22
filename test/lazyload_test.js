var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LazyLoad edge cases ', function(){
    var lazyload = require('../app/js/gallery/lazyload');
    var ERROR, fnGood, fnBad;

    before(function(){
        ERROR = /lazyLoad requires image src String and DOM Node args/;

        fnGood = function(){lazyload('', document.createElement('div'))};
        fnBad = function(){lazyload({}, '#type-error')};
    });

    it('should throw error if first argument is not a String', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('should throw error if second argument is not a Node', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });
});


describe('LazyLoad behavior ', function(){
    var lazyload = require('../app/js/gallery/lazyload');
    var figure;

    beforeEach(function(){
        figure = {
            src: '',
            el: document.createElement('div')
        };
    });

    it('should increase childNodes count to one when autoload argument is false', function(){
        lazyload(figure.src, figure.el, false);
        expect(figure.el.childNodes.length).to.equal(1);
    });

    it('should increase childNodes count to two when autoload argument is true', function(){
        lazyload(figure.src, figure.el, true);
        expect(figure.el.childNodes.length).to.equal(2);
    });

    it('should register mouseover event handler on image when autoload argument is false', function(){
        lazyload(figure.src, figure.el, false);
        expect(typeof figure.el.firstChild.onmouseover).to.equal('function');
    });
});
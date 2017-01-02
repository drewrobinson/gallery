var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LazyLoad ', function(){
    var lazyload = require('../app/js/gallery/lazyload');
    var ERROR, fnGood, fnBad, figure;

    before(function(){
        ERROR = /lazyLoad requires image src String and DOM Node args/;

        fnGood = function(){lazyload('', document.createElement('div'))};
        fnBad = function(){lazyload({}, '#type-error')};

        figure = {
            src: '',
            el: document.createElement('div')
        };
    });

    it('should throw error if first argument is not a String', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('should throw error if second argument is not a Node', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('should increase childNodes count to one', function(){
        lazyload(figure.src, figure.el);
        expect(figure.el.childNodes.length).to.equal(1);
    });

    it('should register mouseover event handler on image', function(){
        lazyload(figure.src, figure.el);
        expect(typeof figure.el.firstChild.onmouseover).to.equal('function');
    });
});
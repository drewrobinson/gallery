var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LazyLoad edge cases:', function(){
    var LazyLoader = require('../app/js/gallery/lazyload');
    var ERROR, instance, fnGood, fnBad;

    before(function(){
        ERROR = /lazyLoad requires image src String and DOM Node args/;

        instance = new LazyLoader();

        fnGood = function(){instance.add('', document.createElement('div'))};
        fnBad = function(){instance.add({}, '#type-error')};
    });

    it('add method should throw error if first argument is not a String', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });

    it('add method should throw error if second argument is not a Node', function(){
        expect(fnBad).to.throw(ERROR);
        expect(fnGood).not.to.throw(ERROR);
    });
});


describe('LazyLoad behavior:', function(){
    var LazyLoader = require('../app/js/gallery/lazyload');
    var figure, autoLoadInstance, nonAutoLoadInstance;

    beforeEach(function(){
        autoLoadInstance = new LazyLoader(true);
        nonAutoLoadInstance = new LazyLoader(false);
        figure = {
            src: '',
            el: document.createElement('div')
        };
    });

    it('add method should add a single childnode to the figure', function(){
        autoLoadInstance.add(figure.src, figure.el);
        expect(figure.el.childNodes.length).to.equal(1);
    });

    it('childnode should be an IMG', function(){
        autoLoadInstance.add(figure.src, figure.el);
        expect(figure.el.childNodes[0].tagName).to.equal('IMG');
    });

    it('add method should NOT register mouseover event handler on image when autoload is true', function(){
        autoLoadInstance.add(figure.src, figure.el);
        expect(typeof figure.el.firstChild.onmouseover).to.equal('undefined');
    });

    it('add method should register mouseover event handler on image when autoload is false', function(){
        nonAutoLoadInstance.add(figure.src, figure.el);
        expect(typeof figure.el.firstChild.onmouseover).to.equal('function');
    });
    
    it('loadImage method should return a Promise', function(){
        var result = autoLoadInstance.loadImage(figure);
        expect(result instanceof Promise).to.be.ok;
    });

});
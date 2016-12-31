var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LightBox instance', function(){

    var LightBox = require('../app/js/gallery/lightbox');

    var CONSTRUCTOR_ERROR = /LightBox constructor requires dom node and data model array/;

    it('constructor should throw error if first arg is not a DOM node',function(){

        var badConstructor = function() {
            return new LightBox("#type-error", []);
        };

        var goodConstructor = function() {
            return new LightBox(document.createElement('div'), []);
        };

        var fnBad = function(){new badConstructor()};
        var fnGood = function(){new goodConstructor()};

        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('constructor should throw error if second arg is not an Array',function(){

        var badConstructor = function() {
            return new LightBox(document.createElement('div'), {});
        };

        var goodConstructor = function() {
            return new LightBox(document.createElement('div'), []);
        };

        var fnBad = function(){new badConstructor()};
        var fnGood = function(){new goodConstructor()};

        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('should contain show, hide, prev, next, and update methods',function(){

        var lightbox = new LightBox(document.createElement('div'), []);

        expect(lightbox).to.have.property('show');
        expect(lightbox).to.have.property('hide');
        expect(lightbox).to.have.property('prev');
        expect(lightbox).to.have.property('next');
        expect(lightbox).to.have.property('update');
    });

    it('template should have .lightbox, .main, .close, .arrow-prev, and .arrow-next selectors',function(){

        var lightbox = new LightBox(document.createElement('div'), []);

        var closeBtn = lightbox.elm.querySelector('.close');
        var mainImg = lightbox.elm.querySelector('.main');
        var nextArrow = lightbox.elm.querySelector('.arrow-next');
        var prevArrow = lightbox.elm.querySelector('.arrow-prev');

        expect(lightbox.elm.classList[0]).to.equal('lightbox');
        expect(closeBtn.classList[0]).to.equal('close');
        expect(mainImg.classList[0]).to.equal('main');
        expect(nextArrow.classList[0]).to.equal('arrow-next');
        expect(prevArrow.classList[0]).to.equal('arrow-prev');
    });
});

describe('LightBox behavior', function() {

    var LightBox = require('../app/js/gallery/lightbox');
    var SHOW_ERROR = /Show method requires a string url and number key/;

    var model = [
        "http://media.gettyimages.com/photos/from-style-to-success-picture-id514136469?s=170667a",
        "http://media.gettyimages.com/photos/he-has-his-own-sense-of-style-picture-id478686645?s=170667a",
        "http://media.gettyimages.com/photos/man-in-a-leather-jacket-leaning-on-a-brick-wall-picture-id499775043?s=170667a",
        "https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg"
    ];

    it('show method should throw error if first argument is not a String', function(){

        var lightbox = new LightBox(document.createElement('div'), model);

        var fnBad = function(){lightbox.show(0, 0)};
        var fnGood = function(){lightbox.show(model[0], 0)};

        expect(fnBad).to.throw(SHOW_ERROR);
        expect(fnGood).not.to.throw(SHOW_ERROR);
    });

    it('show method should throw error if second argument is not a Number', function(){

        var lightbox = new LightBox(document.createElement('div'), model);

        var fnBad = function(){lightbox.show(0, '0')};
        var fnGood = function(){lightbox.show(model[0], 0)};

        expect(fnBad).to.throw(SHOW_ERROR);
        expect(fnGood).not.to.throw(SHOW_ERROR);
    });

    it('show method should add "show-lightbox" to lightbox elm classList', function(){

        var lightbox = new LightBox(document.createElement('div'), model);

        lightbox.show(model[0], 0);
        expect(lightbox.elm.classList[1]).to.equal('show-lightbox');
    });

    it('hide method should add "hide-lightbox" to lightbox elm classList', function(){

        var lightbox = new LightBox(document.createElement('div'), []);

        lightbox.show(model[0], 0);
        lightbox.hide();

        expect(lightbox.elm.classList[2]).to.equal('hide-lightbox');
    });

    it('next method should increment index property', function(){

        var lightbox = new LightBox(document.createElement('div'), model);
        var nextIndex = lightbox.index + 1;

        lightbox.show(model[0], 0);
        lightbox.next();

        expect(lightbox.index).to.equal(nextIndex);
    });

    it('next method should reset index if at the end of list', function(){

        var lightbox = new LightBox(document.createElement('div'), model);
        var i = model.length-1;

        lightbox.show(model[i], i);
        lightbox.next();

        expect(lightbox.index).to.equal(0);
    });

    it('prev method should decrement index property', function(){

        var lightbox = new LightBox(document.createElement('div'), model);

        lightbox.show(model[1], 1);
        lightbox.prev();

        expect(lightbox.index).to.equal(0);
    });

    it('prev method should reset index if at the start of list', function(){

        var lightbox = new LightBox(document.createElement('div'), model);
        var i = model.length-1;

        lightbox.show(model[0], 0);
        lightbox.prev();

        expect(lightbox.index).to.equal(i);
    });

});
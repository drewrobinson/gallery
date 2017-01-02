var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LightBox edge cases', function(){
    var LightBox = require('../app/js/gallery/lightbox');
    var CONSTRUCTOR_ERROR, instance, goodConstructor, badConstructor, fnGood, fnBad, closeBtn, mainImg, nextArrow, prevArrow;

    before(function(){
        CONSTRUCTOR_ERROR = /LightBox constructor requires dom node and data model array/;

        goodConstructor = function() {
            return new LightBox(document.createElement('div'), []);
        };

        badConstructor = function() {
            return new LightBox('#type-error', {});
        };

        fnBad = function(){new badConstructor()};
        fnGood = function(){new goodConstructor()};
    });

    beforeEach(function(){
        instance = new LightBox(document.createElement('div'), []);
        closeBtn = instance.elm.querySelector('.close');
        mainImg = instance.elm.querySelector('.main');
        nextArrow = instance.elm.querySelector('.arrow-next');
        prevArrow = instance.elm.querySelector('.arrow-prev');
    });

    it('constructor should throw error if first arg is not a DOM node',function(){
        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('constructor should throw error if second arg is not an Array',function(){
        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('should contain show, hide, prev, next, and update methods',function(){
        expect(instance).to.have.property('show');
        expect(instance).to.have.property('hide');
        expect(instance).to.have.property('prev');
        expect(instance).to.have.property('next');
        expect(instance).to.have.property('update');
    });

    it('template should have .lightbox, .main, .close, .arrow-prev, and .arrow-next selectors',function(){
        expect(instance.elm.classList[0]).to.equal('lightbox');
        expect(closeBtn.classList[0]).to.equal('close');
        expect(mainImg.classList[0]).to.equal('main');
        expect(nextArrow.classList[0]).to.equal('arrow-next');
        expect(prevArrow.classList[0]).to.equal('arrow-prev');
    });
});

describe('LightBox behavior', function() {
    var LightBox = require('../app/js/gallery/lightbox');
    var SHOW_ERROR, model, instance, showMethodGood, showMethodBad;

    before(function(){
        SHOW_ERROR = /Show method requires a string url and number key/;

        model = [
            "http://media.gettyimages.com/photos/from-style-to-success-picture-id514136469?s=170667a",
            "http://media.gettyimages.com/photos/he-has-his-own-sense-of-style-picture-id478686645?s=170667a",
            "http://media.gettyimages.com/photos/man-in-a-leather-jacket-leaning-on-a-brick-wall-picture-id499775043?s=170667a",
            "https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg"
        ];
    });

    beforeEach(function(){
        instance = new LightBox(document.createElement('div'), model);
        showMethodGood = function(){instance.show(model[0], 0)};
        showMethodBad = function(){instance.show(0, '')};
    });

    it('show method should throw error if first argument is not a String', function(){
        expect(showMethodGood).not.to.throw(SHOW_ERROR);
        expect(showMethodBad).to.throw(SHOW_ERROR);
    });

    it('show method should throw error if second argument is not a Number', function(){
        expect(showMethodGood).not.to.throw(SHOW_ERROR);
        expect(showMethodBad).to.throw(SHOW_ERROR);
    });

    it('show method should add "show-lightbox" to lightbox elm classList', function(){
        instance.show(model[0], 0);
        expect(instance.elm.classList[1]).to.equal('show-lightbox');
    });

    it('hide method should add "hide-lightbox" to lightbox elm classList', function(){
        instance.show(model[0], 0);
        instance.hide();
        expect(instance.elm.classList[2]).to.equal('hide-lightbox');
    });

    it('next method should increment index property', function(){
        var nextIndex = instance.index + 1;
        instance.show(model[0], 0);
        instance.next();
        expect(instance.index).to.equal(nextIndex);
    });

    it('next method should reset index if at the end of list', function(){
        var i = model.length-1;
        instance.show(model[i], i);
        instance.next();
        expect(instance.index).to.equal(0);
    });

    it('prev method should decrement index property', function(){
        instance.show(model[1], 1);
        instance.prev();
        expect(instance.index).to.equal(0);
    });

    it('prev method should reset index if at the start of list', function(){
        var i = model.length-1;
        instance.show(model[0], 0);
        instance.prev();
        expect(instance.index).to.equal(i);
    });
});
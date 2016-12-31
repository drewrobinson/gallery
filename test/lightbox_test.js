//https://github.com/rstacruz/jsdom-global

var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('LightBox instance', function(){

    var LightBox = require('../app/js/gallery/lightbox');

    it('should contain show, hide, prev, next, and update methods',function(){
        var obj = {
            elm: document.createElement('div'),
            model : []
        };

        var lightbox = new LightBox(obj.elm, obj.model);

        expect(lightbox.hasOwnProperty('show')).to.be.ok;
        expect(lightbox.__proto__.hasOwnProperty('hide'));
        expect(lightbox.__proto__.hasOwnProperty('prev')).to.be.ok;
        expect(lightbox.__proto__.hasOwnProperty('next')).to.be.ok
        expect(lightbox.__proto__.hasOwnProperty('update')).to.be.ok;
    });

    it('template should have .lightbox, .main, .close, .arrow-prev, and .arrow-next selectors',function(){
        var obj = {
            node: document.createElement('div'),
            model : []
        };
        var lightbox = new LightBox(obj.node, obj.model);

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
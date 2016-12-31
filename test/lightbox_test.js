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

    it('should have DOM template assigned to elm property',function(){
        var obj = {
            node: document.createElement('div'),
            model : []
        };
        var lightbox = new LightBox(obj.node, obj.model);
        expect(lightbox.elm.classList[0]).to.equal('lightbox');
    });
});
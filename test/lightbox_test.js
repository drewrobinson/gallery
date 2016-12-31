//https://github.com/rstacruz/jsdom-global

var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('Lightbox Object', function(){

    var lightbox = require('../app/js/gallery/lightbox');
    var Gallery = require('../app/js/gallery/gallery');

    it('should contain show, hide, prev, next, and update methods',function(){
        expect(lightbox.hasOwnProperty('show')).to.be.ok;
        expect(lightbox.hasOwnProperty('hide')).to.be.ok;
        expect(lightbox.hasOwnProperty('prev')).to.be.ok;
        expect(lightbox.hasOwnProperty('next')).to.be.ok
        expect(lightbox.hasOwnProperty('update')).to.be.ok;
    });

    it('context should possess container property',function(){
        expect(lightbox.hasOwnProperty('container')).to.be.false;

        var obj = {
            container: document.createElement('div')
        };

        console.log(lightbox.context.call(obj).hasOwnProperty('container'));

        expect(lightbox.context.call(obj).hasOwnProperty('container')).to.be.ok;
    });
});
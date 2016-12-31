var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('Gallery instance', function(){

    var Gallery = require('../app/js/gallery/gallery');
    var CONSTRUCTOR_ERROR = /Gallery Requires DOM Node/;

    it('constructor should throw error if option arg does not have DOM node',function(){

        var badConstructor = function() {
            return new Gallery({
                node: '#type-error'
            });
        };

        var goodConstructor = function() {
            return new Gallery({
                node: document.createElement('div')
            });
        };

        var fnBad = function(){new badConstructor()};
        var fnGood = function(){new goodConstructor()};

        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('should contain renderUI, fetchData, addImage, resolver, and catcher methods',function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        expect(gallery).to.have.property('renderUI');
        expect(gallery).to.have.property('fetchData');
        expect(gallery).to.have.property('addImage');
        expect(gallery).to.have.property('resolver');
        expect(gallery).to.have.property('catcher');
    });

});


describe('Gallery behavior', function(){

    var Gallery = require('../app/js/gallery/gallery');
    var ADD_IMAGE_ERROR = /Gallery addImage method requires src string arg/;

    it('renderUI method should add "container" to gallery container classList', function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        expect(gallery.container.classList[0]).to.equal('container');
    });

    it('renderUI method should render template .search-term and .images selectors',function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        var searchField = gallery.container.querySelector('.search-term');
        var imagesContainer = gallery.container.querySelector('.images');

        expect(searchField.classList[0]).to.equal('search-term');
        expect(imagesContainer.classList[0]).to.equal('images');
    });

    it('renderUI method should register keyup event handler on search field', function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        var searchField = gallery.container.querySelector('.search-term');

        expect(typeof searchField.onkeyup).to.equal('function');
    });

    it('addImage method should throw error if src arg is not a String', function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        var fnBad = function(){gallery.addImage([])};
        var fnGood = function(){gallery.addImage('https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg')};

        expect(fnBad).to.throw(ADD_IMAGE_ERROR);
        expect(fnGood).not.to.throw(ADD_IMAGE_ERROR);
    });

    it('addImage method should increase childNodes count by one', function(){

        var gallery = new Gallery({
            node: document.createElement('div')
        });

        gallery.addImage('https://c2.staticflickr.com/6/5574/30167563922_684e8d6796_b.jpg');

        var imagesContainer = gallery.container.querySelector('.images');

        expect(imagesContainer.childNodes.length).to.equal(1);
    });
    
});
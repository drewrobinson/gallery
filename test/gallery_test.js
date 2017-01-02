var chai = require('chai');
var jsdom = require('jsdom');
var sinon = require('sinon');
var istanbul = require('istanbul');
var expect = chai.expect;

require('sinon-as-promised');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('Gallery edge cases', function(){
    var Gallery = require('../app/js/gallery/gallery');
    var CONSTRUCTOR_ERROR, instance, goodConstructor, badConstructor, fnBad, fnGood;

    before(function(){
        CONSTRUCTOR_ERROR = /Gallery Requires DOM Node/;

        instance = new Gallery({
            node: document.createElement('div')
        });

        goodConstructor = function() {
            return new Gallery({
                node: document.createElement('div')
            });
        };

        badConstructor = function() {
            return new Gallery({
                node: '#type-error'
            });
        };

        fnGood = function(){new goodConstructor()};
        fnBad = function(){new badConstructor()};
    });

    it('constructor should throw error if option arg does not have DOM node',function(){
        expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
        expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
    });

    it('should contain renderUI, fetchData, addFigure, resolver, and catcher methods',function(){
        expect(instance).to.have.property('renderUI');
        expect(instance).to.have.property('fetchData');
        expect(instance).to.have.property('addFigure');
        expect(instance).to.have.property('resolver');
        expect(instance).to.have.property('catcher');
    });

});



describe('Gallery behavior', function(){
    var Gallery = require('../app/js/gallery/gallery');
    var ADD_FIGURE_ERROR, instance, searchField, imagesContainer, responseText;

    before(function(){
        ADD_FIGURE_ERROR = /Gallery addFigure method requires src string arg/;
        responseText = JSON.stringify({
            "kind": "customsearch#search",
            "queries": {
                "request": [
                    {
                        "searchTerms": "jacket"
                    }
                ]
            },
            "items": [
                {
                    "kind": "customsearch#result",
                    "pagemap": {
                        "cse_image": [
                            {
                                "src": "http://media.gettyimages.com/photos/from-style-to-success-picture-id514136469?s=170667a"
                            }
                        ]
                    }
                }
            ]
        });
    });

    beforeEach(function(){
        instance = new Gallery({
            node: document.createElement('div')
            ,uri: '../app/data/tmp.json?'
        });

        searchField = instance.container.querySelector('.search-term');
        imagesContainer = instance.container.querySelector('.images');
    });

    it('resolver should update model and create instance of LightBox', function () {
        var stub = sinon.stub().resolves(responseText);
        return stub().then(function (data) {
            instance.resolver(data);
            expect(instance.lightbox).to.be.ok;
            expect(instance.lightbox.model.length).to.equal(1);
        });
    });
    
    it('renderUI method should add "container" to gallery container classList', function(){
        expect(instance.container.classList[0]).to.equal('container');
    });

    it('renderUI method should render template .search-term and .images selectors',function(){
        expect(searchField.classList[0]).to.equal('search-term');
        expect(imagesContainer.classList[0]).to.equal('images');
    });

    it('renderUI method should register keyup event handler on search field', function(){
        expect(typeof searchField.onkeyup).to.equal('function');
    });

    it('addFigure method should throw error if src arg is not a String', function(){
        var fnBad = function(){instance.addFigure([])};
        var fnGood = function(){instance.addFigure('')};
        expect(fnBad).to.throw(ADD_FIGURE_ERROR);
        expect(fnGood).not.to.throw(ADD_FIGURE_ERROR);
    });

    it('addFigure method should increase childNodes count by one', function(){
        instance.addFigure('');
        expect(imagesContainer.childNodes.length).to.equal(1);
    });
});
var expect = require('chai').expect;
var jsdom = require('jsdom');

global.DOMParser = jsdom.jsdom().defaultView.DOMParser;

describe('Queue Data Structure', function(){
    var Queue = require('../app/js/util/queue');
    var instance, figure;

    beforeEach(function(){
        instance = new Queue();
        figure = {};
    });

    it('enqueue method should increase queue size', function(){
        instance.enqueue(figure);
        expect(instance.size()).to.equal(1);
    });

    it('dequeue method should return first element and decrease queue size', function(){
        instance.enqueue(figure);
        var el = instance.dequeue(figure);
        expect(instance.size()).to.equal(0);
        expect(el).to.be.ok;
    });

    it('front method should return first element and not change queue size', function(){
        instance.enqueue(figure);
        var el = instance.front();
        expect(el).to.be.ok;
        expect(instance.size()).to.equal(1);
    });

    it('isEmpty method should return false when elements exist', function(){
        instance.enqueue(figure);
        expect(instance.isEmpty()).to.be.false;
    });

    it('isEmpty method should return true when no elements exist', function(){
        expect(instance.isEmpty()).to.be.true;
    });

    it('print method should return a string', function(){
        instance.enqueue(figure);
        expect(typeof instance.print() === 'string').to.be.true;
    });
});

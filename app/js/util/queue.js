/**
 * Represents a Queue Data Structure
 * @constructor
 * @desc - FIFO Queue
 */

var Queue = (global => {
    'use strict';

    function Queue(){
        var items = [];

        this.enqueue = function(element){
            items.push(element);
        };

        this.dequeue = function(){
            return items.shift();
        };

        this.front = function(){
            return items[0];
        };

        this.isEmpty = function(){
            return items.length == 0;
        };

        this.size = function(){
            return items.length;
        };

        this.print = function(){
            console.log(items.toString());
        }
    }

    return Queue;

})(window)

module.exports = Queue;



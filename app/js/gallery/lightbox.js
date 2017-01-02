/**
 *  Class representing a LightBox.
 *
 * @author Drew Robinson (hello@drewrobinson.com)
 * @version 0.0.1
 * @param {Node} element to append the lightbox into
 * @param {Array} model is array of image urls/paths
 * @return LightBox Class
 */

var util = require('../util/util');

var LightBox = (global => {
    'use strict';

    class LightBox {

        constructor(element, model){
            if(!(element instanceof Node) || !(model instanceof Array)){
                throw new TypeError('LightBox constructor requires dom node and data model array');
            }

            let template = '<div class="lightbox"><div class="col-lt"><a class="arrow-prev"></a></div><div class="col-ct"><img class="main" /></div><div class="col-rt"> <a class="close"></a> <a class="arrow-next"></a> </div> </div>';

            element.appendChild(util.toHTML(template));

            this.uid = Math.floor((Math.random() * 10000) + 1);
            this.index = 0;
            this.elm = element.querySelector('.lightbox');
            this.setModel(model);

            /**
             * Responsible for making the lightbox visible to user and binding click event listener.
             * @param src
             * @param key
             * @throws {TypeError} Will throw type error src arg is not a string or key is not a number
             */
            this.show = (src, key) =>{
                if((typeof src !== 'string' ) || (typeof key !=='number')){
                    throw new TypeError('Show method requires a string url and number key');
                }

                this.elm.classList.add('show-lightbox');
                this.elm.addEventListener('click', this, false);
                this.update(src, key);
            };
        }

        /**
         * Delegates event to next, prev, hide methods
         * @param e
         */
        handleEvent(e){
            let action = e.target.getAttribute('class') || '';

            switch (action) {
                case 'close':
                    this.hide();
                    break;
                case 'arrow-next':
                    this.next();
                    break;
                case 'arrow-prev':
                    this.prev();
                    break;
                default:
            }
        }

        /**
         * Hides the lightbox and removes click event listener
         */
        hide(){

            let animationEndHandler = () => {
                this.elm.classList.remove('show-lightbox');
                this.elm.classList.remove('hide-lightbox');
                this.elm.removeEventListener('webkitAnimationEnd', animationEndHandler, false);
            };

            this.elm.removeEventListener('click', this, false);
            this.elm.classList.add('hide-lightbox');
            this.elm.addEventListener('webkitAnimationEnd', animationEndHandler, false);
        }

        /**
         * Increments index and calls update method
         */
        next(){
            let main = this.elm.querySelector('.main');

            let index =  this.index;
            let nextIndex = (index < this.model.length - 1) ? index + 1 : 0;
            let src = this.model[nextIndex];
            this.update(src, nextIndex);
        }

        /**
         * Decrements index and calls update method
         */
        prev(){
            let main = this.elm.querySelector('.main');
            let index = this.index; //parseInt(main.dataset.key);
            let prevIndex = (index > 0) ? index - 1 : this.model.length - 1;
            let src = this.model[prevIndex];
            this.update(src, prevIndex);
        }

        /**
         * Setter for model
         * @param {Array} imageURLs
         */
        setModel(imageURLs){
            this.model = imageURLs;
        }

        /**
         * Updates the lightbox main image src and key attributes.
         * @param src
         * @param key
         */
        update(src, key){
            this.index = key;

            let main = this.elm.querySelector('.main');
            main.setAttribute('src', src);
            main.setAttribute('data-key', key);
        }
    }

    return LightBox;

})(window)

module.exports = LightBox;
var util = require('../util/util');

var LightBox = (global => {
    "use strict";

    /**
     * LightBox
     * @param element
     * @param model
     * @desc - Responsible for lightbox behavior
     */
    class LightBox {

        constructor(element, model){
            if(!(element instanceof Node) || !(model instanceof Array)){
                throw new TypeError('LightBox constructor requires dom node and data model array');
            }

            let template = '<div class="lightbox"><div class="col-lt"><a class="arrow-prev"></a></div><div class="col-ct"><img class="main" /></div><div class="col-rt"> <a class="close"></a> <a class="arrow-next"></a> </div> </div>';

            element.appendChild(util.toHTML(template));

            this.uid = Math.floor((Math.random() * 10000) + 1);

            this.show = (src, key) =>{
                if((typeof src !== 'string' ) || (typeof key !=='number')){
                    throw new TypeError('Show method requires a string url and number key');
                }

                this.elm.classList.add('show-lightbox');
                this.elm.addEventListener('click', this, false);
                this.update(src, key);
            };

            this.index = 0;
            this.elm = element.querySelector('.lightbox');
            this.setModel(model);
        }


        /**
         * @desc - delegate event handlers for next, prev, hide methods
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

        next(){
            let main = this.elm.querySelector('.main');

            let index =  this.index; //parseInt(main.dataset.key);
            let nextIndex = (index < this.model.length - 1) ? index + 1 : 0;
            let src = this.model[nextIndex];
            this.update(src, nextIndex);
        }

        prev(){
            let main = this.elm.querySelector('.main');
            let index = this.index; //parseInt(main.dataset.key);
            let prevIndex = (index > 0) ? index - 1 : this.model.length - 1;
            let src = this.model[prevIndex];
            this.update(src, prevIndex);
        }

        setModel(imageURLs){
            this.model = imageURLs;
        }

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
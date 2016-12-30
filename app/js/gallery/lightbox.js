var util = require('../util/util');

var lightbox = (global => {
    "use strict";

    /**
     * lightbox
     * @desc - object literal responsible for lightbox behavior, should be call w/context
     */
    let lightbox = {

        el: null,
        handleEvent: function(e){

            let action = e.target.getAttribute('class') || '';

            switch (action) {
                case 'close':
                    lightbox.hide.call(this, e);
                    break;
                case 'arrow-next':
                    lightbox.next.call(this, e);
                    break;
                case 'arrow-prev':
                    lightbox.prev.call(this, e);
                    break;
                default:
            }
        },
        show: function(e){
            if(!this.hasOwnProperty('container')){
                throw new Error('lightbox requires container');
            }

            //render template if needed
            if(!this.el){
                let template = '<div class="lightbox"><div class="col-lt"><a class="arrow-prev"></a></div><div class="col-ct"><img class="main" /></div><div class="col-rt"> <a class="close"></a> <a class="arrow-next"></a> </div> </div>';
                let _html =  util.toHTML(template);
                this.container.appendChild(_html);
                this.el = this.container.querySelector('.lightbox');
            }

            this.el.classList.add('show-lightbox');
            this.el.addEventListener('click', lightbox.handleEvent.bind(this), false);
            lightbox.update.call(this, e.target.parentNode.attributes['data-src'].value, e.target.parentNode.attributes['data-key'].value);
        },
        hide: function(e){
            let lightboxEl = this.container.querySelector('.lightbox');
            let animationEndHandler = () => {
                lightboxEl.classList.remove('show-lightbox');
                lightboxEl.classList.remove('hide-lightbox');
                lightboxEl.removeEventListener('webkitAnimationEnd', animationEndHandler, false);
            };

            lightboxEl.removeEventListener('click', lightbox, false);
            lightboxEl.classList.add('hide-lightbox');
            lightboxEl.addEventListener('webkitAnimationEnd', animationEndHandler, false);
        },
        next: function(e){
            let main = this.container.querySelector('.main');
            let index = parseInt(main.dataset.key);
            let nextIndex = (index < this.container.querySelector('.images').childNodes.length - 1) ? index + 1 : 0;
            let nextFigure = this.container.querySelector('[data-key="' + nextIndex + '"]');
            lightbox.update.call(this, nextFigure.attributes['data-src'].value, nextIndex);
        },
        prev: function(e){
            let main = this.container.querySelector('.main');
            let index = parseInt(main.dataset.key);
            let prevIndex = (index > 0) ? index - 1 : this.container.querySelector('.images').childNodes.length - 1;
            let prevFigure = this.container.querySelector('[data-key="' + prevIndex + '"]');
            lightbox.update.call(this, prevFigure.attributes['data-src'].value, prevIndex);
        },
        update: function(src, key){
            let main = this.container.querySelector('.main');
            main.setAttribute('src', src);
            main.setAttribute('data-key', key);
        }
    }

    return lightbox;

})(window)

module.exports = lightbox;
/**
 *  LazyLoader shows placeholder image and progress bar for the image when autoload is true.
 *  When autoload is false the placeholder image is shown until an image mouseover event is detected.
 *
 * @author Drew Robinson (hello@drewrobinson.com)
 * @version 0.0.1
 * @params {Bool} autoload
 */

var LazyLoader = (global => {
    'use strict';

    const TRANSPARENT_IMAGE = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 100% 100%"%2F%3E';
    const PLACEHOLDER_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100% 100%"><defs><symbol id="a" viewBox="0 0 90 66" opacity="0.3"><path d="M85 5v56H5V5h80m5-5H0v66h90V0z"/><circle cx="18" cy="20" r="6"/><path d="M56 14L37 39l-8-6-17 23h67z"/></symbol></defs><use xlink:href="#a" width="20%" x="40%"/></svg>';

    class LazyLoader {

        constructor(autoload){
           this.autoload     = autoload || false;
           this.queue        = [];
           this.isProcessing = false;
           this.uid          = Math.random();
        }

        /**
         * Adds Image To Be LazyLoaded
         * If instance is set to autoload the image will be put in queue otherwise it will wait for user mouseover interaction to load
         * @param {String} src arg is a string to serve as url or path to image
         * @param {Node} figure is a element to append the lazyload image to.
         * @throws {TypeError} Will throw type error if src arg is not string or figure arg is not a DOM Node
         */
        add(src, figure){

            if (typeof src !== 'string' || !(figure instanceof Node)) {
                throw TypeError('lazyLoad requires image src String and DOM Node args');
            }

            let mouseoverHandler =(e) => {
                let target = e.target;
                let figure = target.parentNode;
                target.onmouseover = null; //remove event
                this.queueImage(figure);
            };

            let image = document.createElement('IMG');
                image.setAttribute('class', 'replaceable');
                image.setAttribute('data-src', src);
                image.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PLACEHOLDER_IMAGE));

            figure.appendChild(image);

            if(!!this.autoload){
                this.queueImage(figure);
            }else{
                image.onmouseover = mouseoverHandler; //add event as attribute to make it testable
            }
        }

        /**
         * Adds image to queue if queue is busy loading other images
         * @param figure
         */
        queueImage(figure){
            if(!figure) return;

            if(!this.isProcessing){
                let process = (figure) => {
                    var self = this;

                    let resolved = (response) => {
                        this.isProcessing = false;
                        var _figure = self.queue.shift();
                        if(_figure){
                            process(_figure);
                        }
                    };

                    let rejected = (error) => {
                        //console.log('Error: an image could not be loaded: ',error);
                    };

                    this.isProcessing = true;
                    this.loadImage(figure).then(resolved, rejected);
                }

                process(figure);
            }else{
                this.queue.push(figure);
            }
        }
    
        /**
         * Shows progress bar while loading image
         * @params {Node} figure element
         * @returns {Promise}
         */
        loadImage(figure){
            if(!figure) return;

            return new Promise(function(resolve, reject){
                let cacheImg = document.createElement('IMG');
                let _img = figure.querySelector('.replaceable')
                let _src = _img.dataset.src;
                let progress = document.createElement('div');
                let bar = document.createElement('div');

                progress.classList.add('progress');
                bar.classList.add('progress-bar');
                progress.appendChild(bar);
                figure.appendChild(progress);

                cacheImg.onload = ()=>{
                    _img.setAttribute('src', TRANSPARENT_IMAGE);
                    _img.style.backgroundImage = 'url("' + _src + '")';
                    _img.classList.add('animate-fade-in');
                    resolve('success');
                };

                cacheImg.onerror = () =>{
                    reject(Error('Image could not be loaded'));
                }

                cacheImg.src = _src;

                let showProgress = () => {
                    var width = 1;
                    var id = setInterval(frame, 10);
                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                            figure.removeChild(progress);
                        } else {
                            width++;
                            bar.style.width = width + '%';
                        }
                    }
                };

                showProgress();
            });
        }
    }
    
    return LazyLoader;

})(window)


module.exports = LazyLoader;
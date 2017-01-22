/**
 *  LazyLoad shows placeholder image and progress bar for the image when autoload is true.
 *  When autoload is false the placeholder image is shown until an image mouseover event is detected.
 *
 * @author Drew Robinson (hello@drewrobinson.com)
 * @version 0.0.1
 * @param {String} src arg is a string to serve as url or path to image
 * @param {Node} elm is a element to append the lazyload image to.
 * @throws {TypeError} Will throw type error if src arg is not string or elm arg is not a DOM Node
 * @description Inspired by: https://codepen.io/shshaw/post/responsive-placeholder-image
 */

var lazyLoad = (global => {
    'use strict';

     let lazyLoad = (src, elm, autoload) => {

        if (typeof src !== 'string' || !(elm instanceof Node)) {
            throw TypeError('lazyLoad requires image src String and DOM Node args');
        }

        let cacheImg = document.createElement('IMG');
        let progress = document.createElement('div');
        let bar = document.createElement('div');
        let placeholderIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100% 100%"><defs><symbol id="a" viewBox="0 0 90 66" opacity="0.3"><path d="M85 5v56H5V5h80m5-5H0v66h90V0z"/><circle cx="18" cy="20" r="6"/><path d="M56 14L37 39l-8-6-17 23h67z"/></symbol></defs><use xlink:href="#a" width="20%" x="40%"/></svg>';
        let image = document.createElement('IMG');
            image.setAttribute('class', 'replaceable');
            image.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(placeholderIcon));

         /**
          * Waits until mouseover event to retrieve image
          */
         let mouseoverHandler =(e) => {
            let target = e.target;
            target.onmouseover = null; //remove event
            loadImage();
        };

         /**
         * Updates progress bar for image download
         */
         let showProgress = () => {
             var width = 1;
             var id = setInterval(frame, 10);
             function frame() {
                 if (width >= 100) {
                     clearInterval(id);
                     elm.removeChild(progress);
                 } else {
                     width++;
                     bar.style.width = width + '%';
                 }
             }
         }

         /**
          * Loads Image as Background Image and Replaces Placeholder Icon with Transparent Gif
          */
         let loadImage = () => {
             let transSVG = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 100% 100%"%2F%3E';

             progress.classList.add('progress');
             bar.classList.add('progress-bar');
             progress.appendChild(bar);
             elm.appendChild(progress);

             cacheImg.onload = ()=>{
                 setTimeout(()=>{
                     image.setAttribute('src', transSVG);
                     image.style.backgroundImage = 'url("' + src + '")';
                     image.classList.add('animate-fade-in');
                 },1000);
             };
             cacheImg.src = src;

             showProgress();
         }

         /**
          * Load Images if AutoLoad is True otherwise wait until user action to Load Images
          */
         if(!!autoload){
             loadImage();
         }else{
             image.onmouseover = mouseoverHandler; //add event as attribute to make it testable
         }


        //add image to dom
        elm.appendChild(image);
    }

    return lazyLoad;

})(window)


module.exports = lazyLoad;
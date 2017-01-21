/**
 *  LazyLoad is a helper function. Creates and appends element with
 *  a placeholder image.  Mouseover event will trigger the placeholder src attribute
 *  to be replaced with the actual image src uri/path.
 *
 * @author Drew Robinson (hello@drewrobinson.com)
 * @version 0.0.1
 * @param {String} src arg is a string to serve as url or path to image
 * @param {Node} elm is a element to append the lazyload image to.
 * @throws {TypeError} Will throw type error if src arg is not string or elm arg is not a DOM Node
 * @description Inspired by: https://codepen.io/shshaw/post/responsive-placeholder-image
 * @TODO: allow for option of autoloading images vs waiting for user interaction to set src attribute
 */

var lazyLoad = (global => {
    'use strict';

     let lazyLoad = (src, elm, autoload) => {

        if (typeof src !== 'string' || !(elm instanceof Node)) {
            throw TypeError('lazyLoad requires image src String and DOM Node args');
        }

        let transSVG = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 100% 100%"%2F%3E';

        let iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100% 100%"><defs><symbol id="a" viewBox="0 0 90 66" opacity="0.3"><path d="M85 5v56H5V5h80m5-5H0v66h90V0z"/><circle cx="18" cy="20" r="6"/><path d="M56 14L37 39l-8-6-17 23h67z"/></symbol></defs><use xlink:href="#a" width="20%" x="40%"/></svg>';

        let mouseoverHandler = (e) => {
            console.log('mouseOverHandler');

            let target = e.target;

            if(e.type === 'mouseover'){
                target.removeEventListener('mouseover', mouseoverHandler, false);
            }

            target.onload = function(){
                target.classList.add('animate-fade-in');
            };

            target.setAttribute('src', transSVG);
            target.style.backgroundImage = 'url("' + src + '")';
        };

        let image = document.createElement('IMG');
        image.setAttribute('class', 'replaceable');
        image.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG));

         if(!!autoload){
             var tmp = new Image();

             tmp.onload = function(){
                 setTimeout(function(){
                     image.setAttribute('src', transSVG);
                     image.style.backgroundImage = 'url("' + src + '")';
                     image.classList.add('animate-fade-in');
                 },1000);
             };
             tmp.src = src;
             tmp.onprogress = function(event){
                 console.log('progress event: ', event);
             };
         }else{
             image.onmouseover = mouseoverHandler;
         }

        elm.appendChild(image);
    }

    return lazyLoad;

})(window)


module.exports = lazyLoad;
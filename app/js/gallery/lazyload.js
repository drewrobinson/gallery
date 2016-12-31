var lazyLoad = (global => {

    "use strict";

    /**
     * LazyLoad
     * @param src {String}
     * @param elm {Node}
     * @desc - displays placeholder image until a user action.
     * Inspired by: https://codepen.io/shshaw/post/responsive-placeholder-image
     */
     let lazyLoad = (src, elm) => {

        if (typeof src !== 'string' || !(elm instanceof Node)) {
            throw Error('lazyLoad requires image src String and DOM Node args');
        }

        let transSVG = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 100% 100%"%2F%3E';

        let iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100% 100%"><defs><symbol id="a" viewBox="0 0 90 66" opacity="0.3"><path d="M85 5v56H5V5h80m5-5H0v66h90V0z"/><circle cx="18" cy="20" r="6"/><path d="M56 14L37 39l-8-6-17 23h67z"/></symbol></defs><use xlink:href="#a" width="20%" x="40%"/></svg>';

        let replace = (e) => {

            let target = e.target;

            target.onload = function(){
                target.classList.add('animate-fade-in');
            };

            target.removeEventListener('mouseover', replace, false);
            target.setAttribute('src', transSVG);
            target.style.backgroundImage = 'url("' + src + '")';
        };

        let image = document.createElement('IMG');
        image.setAttribute('class', 'replaceable');
        image.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG));
        image.onmouseover = replace;

        elm.appendChild(image);
    }

    return lazyLoad;

})(window)


module.exports = lazyLoad;
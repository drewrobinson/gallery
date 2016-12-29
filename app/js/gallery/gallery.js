var Gallery = (global => {
    "use strict";
}

    const DEFAULT_URI = 'https://www.googleapis.com/customsearch/v1?imgSize=large&cx=016488772293305661751:46ntc6xv0k8&fileType=gif%2Cpng%2Cjpg%2Cjpeg&key=AIzaSyBBwGsQ13DP7SZEKfWekT8BTyuof6Edpcc';
    const DEFAULT_TERM = 'snowboarding';    //default search query term
    const DEFAULT_NUM = 10;                 //a number between 1-10 represents num of search results retured
    const FALLBACK_URI = '/data/tmp.json?'; //path to local json file because google limits request for free accounts

    let instance = {};

    /**
     * lightbox
     * @desc - object literal responsible for lightbox behavior
     */
    let lightbox = {
            handleEvent: (e) => {
                let action = e.target.getAttribute('class') || '';

                switch (action) {
                    case 'close':
                        lightbox.hide();
                        break;
                    case 'arrow-next':
                        lightbox.next(e);
                        break;
                    case 'arrow-prev':
                        lightbox.prev(e);
                        break;
                    default:
                }
        },
        show: (e) => {
            instance.ui.lightbox.classList.add('show-lightbox');
            instance.ui.lightbox.addEventListener('click', lightbox, false);
            lightbox.update(e.target.parentNode.attributes['data-src'].value, e.target.parentNode.attributes['data-key'].value);
        },
        hide: (e) => {
            let animationEndHandler = () => {
                instance.ui.lightbox.classList.remove('show-lightbox');
                instance.ui.lightbox.classList.remove('hide-lightbox');
                instance.ui.lightbox.removeEventListener('webkitAnimationEnd', animationEndHandler, false);
            };

            instance.ui.lightbox.removeEventListener('click', lightbox, false);
            instance.ui.lightbox.classList.add('hide-lightbox');
            instance.ui.lightbox.addEventListener('webkitAnimationEnd', animationEndHandler, false);
        },
        next: (e) => {
            let main = instance.ui.lightbox.querySelector('.main');
            let index = parseInt(main.dataset.key);
            let nextIndex = (index < instance.ui.imagesContainer.childNodes.length - 1) ? index + 1 : 0;
            let nextFigure = instance.ui.imagesContainer.querySelector('[data-key="' + nextIndex + '"]');

            lightbox.update(nextFigure.attributes['data-src'].value, nextIndex);
        },
        prev: (e) => {
            let main = instance.ui.lightbox.querySelector('.main');
            let index = parseInt(main.dataset.key);
            let prevIndex = (index > 0) ? index - 1 : instance.ui.imagesContainer.childNodes.length - 1;
            let prevFigure = instance.ui.imagesContainer.querySelector('[data-key="' + prevIndex + '"]');
            lightbox.update(prevFigure.attributes['data-src'].value, prevIndex);
        },
        update: (src, key) => {
            let main = instance.ui.lightbox.querySelector('.main');
            main.setAttribute('src', src);
            main.setAttribute('data-key', key);
        }
    };


    /**
     * lazyLoad
     * @param {Object} figure
     * @desc - displays placeholder image until a user action.
     inspired by: https://codepen.io/shshaw/post/responsive-placeholder-image
     */
    let lazyLoad = (figure) => {

        if (!figure.src || !figure.el) {
            throw Error('image element and src url are required for lazyLoad');
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
            target.style.backgroundImage = 'url("' + figure.src + '")';
        };

        let image = document.createElement('IMG');
        image.setAttribute('class', 'replaceable');
        image.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG));
        image.addEventListener('mouseover', replace, false);
        figure.el.appendChild(image);
    };


    /**
     * addImage
     * @param {String} src
     * @desc - creates figure object and append it's el property to dom
     */
    let addImage = (src) => {
        let _figure;
        try {
            _figure = Object.create(Object.prototype, {
                src: { value: src },
                key: { value: instance.ui.imagesContainer.childNodes.length }
            });

            Object.defineProperty(_figure, "template", { set: function (x) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(x, 'text/xml');
                this.el = doc.firstChild;
            }});

            _figure.template = `<figure data-src='${_figure.src}' data-key='${_figure.key}' />`;
            _figure.el.addEventListener('click', lightbox.show, false);

            instance.ui.imagesContainer.appendChild(_figure.el);
            lazyLoad(_figure);

            delete _figure;

        } catch (err) {
            console.log('Error adding image: ' + err);
        }
    };



    /**
     * xhrSuccessHandler
     * @param {Object} e
     * @desc - handles success xhr request
     */
    let xhrSuccessHandler = (e) => {

        if (e.target.status >= 200 && e.target.status < 400) {
            let json = JSON.parse(e.target.responseText);

            instance.ui.imagesContainer.innerHTML = "";

            json.items.forEach(function (item) {
                if (item.pagemap.hasOwnProperty('cse_image')) {
                    addImage(item.pagemap['cse_image'][0].src);
                }
            });
        }else{
            fallback();
        }
    };

    /**
     * xhrErrorHandler
     * @param {Object} e
     * @desc - request local data file if google throws error for going over request limit
     */
    let xhrErrorHandler = (e) => {
        fallback();
    };


    /**
     * fetchData
     * @param {String} uri, {String} term
     * @desc - makes xhr request
     */
    let fetchData = (uri, term, num) => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', xhrSuccessHandler);
        xhr.addEventListener('error', xhrErrorHandler);
        xhr.open('GET', uri + '&q=' + term + '&num=' + num);
        xhr.send();
        searchField.value = term;
    };

    /**
     * fallback
     * @desc - attempts to fetch local data file
     */
    let fallback = () => {
        fetchData(FALLBACK_URI, DEFAULT_TERM, DEFAULT_NUM);
    };

    /**
     * toHTML
     * @param {string}
     * @desc - helper function to covnert string template to dom
     */
    let toHTML = (templateString) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(templateString, 'text/xml');
        return doc.firstChild;
    };

    /**
     * init
     * @param {Object} opts
     * @desc - sets gallery options and makes initial xhr request
     */
    let init = (opts) =>{

        if(!opts.selector){
            throw new Error("Gallery Requires A Valid Selector");
        }

        let uri = opts.uri || DEFAULT_URI;
        let term = opts.term || DEFAULT_TERM;
        let num = opts.num || DEFAULT_NUM;

        //gallery ui
        let templates = [
            '<div><input type="text" class="search-term" placeholder="Enter Search Term" /></div>',
            '<div class="images"></div>',
            '<div class="lightbox"><div class="col-lt"><a class="arrow-prev"></a></div><div class="col-ct"><img class="main" /></div><div class="col-rt"> <a class="close"></a> <a class="arrow-next"></a> </div> </div>';

        instance.ui = {
            galleryContainer: document.querySelector(opts.selector)
        };

        templates.forEach(function(template){
            instance.ui.galleryContainer.appendChild(template);
        });

        instance.ui.searchField = galleryContainer.querySelector('.search-term');
        instance.ui.imagesContainer = galleryContainer.querySelector('.images');
        instance.ui.lightbox = galleryContainer.querySelector('.lightbox');

        //bind enter key handler
        instance.ui.searchField.addEventListener('keyup', function(e){
            if(e.keyCode == 13){
                term = instance.ui.searchField.value;
                fetchData(uri, instance.searchField.value, num);
            }
        });

       fetchData(uri, term, num);

    };


    //expose init to outside world
    return {
        init: init
    };

})(window)

module.exports = Gallery;

var Gallery = (global => {

    const DEFAULT_URI = 'https://www.googleapis.com/customsearch/v1?imgSize=large&cx=016488772293305661751:46ntc6xv0k8&fileType=gif%2Cpng%2Cjpg%2Cjpeg&key=AIzaSyBBwGsQ13DP7SZEKfWekT8BTyuof6Edpcc';
    const DEFAULT_TERM = 'snowboarding';    //default search query
    const DEFAULT_NUM = 10;                 //a number between 1-10 represents num of search results retured
    const FALLBACK_URI = '/data/tmp.json?'; //path to local json file because google limits request for free accounts

    let _uri = null;
    let _num = null;
    let _term = null;

    let imagesContainer = document.querySelector('.images');
    let searchField = document.querySelector('.search-term');


    /**
     * lightbox
     * @desc - object literal responsible for lightbox behavior
     */
    let lightbox = {
            container: document.querySelector('.lightbox'),
            main: document.querySelector('.main'),
            closeBtn: document.querySelector('.close'),
            nextBtn: document.querySelector('.arrow-next'),
            prevBtn: document.querySelector('.arrow-prev'),
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
            lightbox.container.classList.add('show-lightbox');
            lightbox.container.addEventListener('click', lightbox, false);
            lightbox.update(e.target.parentNode.attributes['data-src'].value, e.target.parentNode.attributes['data-key'].value);
        },
        hide: (e) => {
            let animationEndHandler = () => {
                lightbox.container.classList.remove('show-lightbox');
                lightbox.container.classList.remove('hide-lightbox');
                lightbox.container.removeEventListener('webkitAnimationEnd', animationEndHandler, false);
            };

            lightbox.container.removeEventListener('click', lightbox, false);
            lightbox.container.classList.add('hide-lightbox');
            lightbox.container.addEventListener('webkitAnimationEnd', animationEndHandler, false);
        },
        next: (e) => {
            let index = parseInt(lightbox.main.dataset.key);
            let nextIndex = (index < imagesContainer.childNodes.length - 1) ? index + 1 : 0;
            let nextFigure = imagesContainer.querySelector('[data-key="' + nextIndex + '"]');

            lightbox.update(nextFigure.attributes['data-src'].value, nextIndex);
        },
        prev: (e) => {
            let index = parseInt(lightbox.main.dataset.key);
            let prevIndex = (index > 0) ? index - 1 : imagesContainer.childNodes.length - 1;
            let prevFigure = imagesContainer.querySelector('[data-key="' + prevIndex + '"]');
            lightbox.update(prevFigure.attributes['data-src'].value, prevIndex);
        },
        update: (src, key) => {
            lightbox.main.setAttribute('src', src);
            lightbox.main.setAttribute('data-key', key);
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
                key: { value: imagesContainer.childNodes.length }
            });

            Object.defineProperty(_figure, "template", { set: function (x) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(x, 'text/xml');
                this.el = doc.firstChild;
            }});

            _figure.template = `<figure data-src='${_figure.src}' data-key='${_figure.key}' />`;
            _figure.el.addEventListener('click', lightbox.show, false);

            imagesContainer.appendChild(_figure.el);
            lazyLoad(_figure);

            delete _figure;

        } catch (err) {
            console.log('Error adding image: ' + err);
        }
    };

    /**
     * fallback
     * @desc - attempts to fetch local data file
     */
    let fallback = () => {
        try{
            fetchData(FALLBACK_URI, 'snowboarding', num);
            uri = FALLBACK_URI;
        }catch(error){
            throw new Error("Error: Bad XHR Request")
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

            imagesContainer.innerHTML = "";

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
        let n = num || _num;
        let u = uri || _uri;
        let t = term || _term;
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', xhrSuccessHandler);
        xhr.addEventListener('error', xhrErrorHandler);
        xhr.open('GET', u + '&q=' + t + '&num=' + n);
        xhr.send();

        searchField.value = term;
    };

    /**
     * init
     * @param {Object} opts
     * @desc - sets gallery options and makes initial xhr request
     */
    let init = (opts) =>{
        _uri = opts.uri || DEFAULT_URI;
        _num = opts.num || DEFAULT_NUM;
        _term = opts.term || DEFAULT_TERM;

        //enter key handler
        searchField.addEventListener('keyup', function(e){
            if(e.keyCode == 13){
                term = searchField.value;
                fetchData(_uri, searchField.value, _num);
            }
        });

        fetchData(_uri, _term, _num);
    }


    //expose init to outside world
    return {
        init: init
    };

})(window)

module.exports = Gallery;

var lazyLoad = require('./lazyload');
var lightbox = require('./lightbox');
var util     = require('../util/util');


var Gallery = (global => {
    "use strict";

    const DEFAULT_URI = '/data/tmp.json?'; //path to local json file because google limits request for free accounts
    const DEFAULT_TERM = 'snowboarding';   //default search query term
    const DEFAULT_NUM = 10;                //a number between 1-10 represents num of search results retured

    class Gallery {

        constructor(opts){
            if(!opts.selector){
                throw new Error("Gallery Requires A Valid Selector");
            }

            this.uri        = opts.uri      || DEFAULT_URI;
            this.term       = opts.term     || DEFAULT_TERM;
            this.num        = opts.num      || DEFAULT_NUM;
            
            this.container  = document.querySelector(opts.selector);
            this.container.classList.add('container');

            this.renderUI();
            this.fetchData();
        }

        /**
         * renderUI
         * @desc - appends ui templates into the selector to be used as the gallery container
         */
        renderUI(){

            let templates = [
                '<div><input type="text" class="search-term" placeholder="Enter Search Term" /></div>',
                '<div class="images"></div>'
            ];

            templates.forEach(function(template){
                let _html =  util.toHTML(template);
                this.container.appendChild(_html);
            }, this);

             let searchField = this.container.querySelector('.search-term');

             //bind keyCode
             searchField.addEventListener('keyup', (e) => {
                if(e.keyCode == 13){
                    this.term = searchField.value;
                    this.fetchData();
                }
             });
        }

        /**
         * fetchData
         * @desc - makes xhr request for images
         */
        fetchData(){

            let xhrErrorHandler = (e) => {
                throw new Error('There was an error with the images request');

            };

            let xhrSuccessHandler = (e) => {
                if (e.target.status >= 200 && e.target.status < 400) {
                    let json = JSON.parse(e.target.responseText);

                    this.container.querySelector('.images').innerHTML = '';

                    json.items.forEach(function (item) {
                        if (item.pagemap.hasOwnProperty('cse_image')) {
                            this.addImage(item.pagemap['cse_image'][0].src);
                        }
                    }, this);


                }else{
                    throw new Error('There was an error with the images request');
                }
            };

            let xhr = new XMLHttpRequest();

            xhr.addEventListener('load', xhrSuccessHandler);
            xhr.addEventListener('error', xhrErrorHandler);
            xhr.open('GET', this.uri + '&q=' + this.term + '&num=' + this.num);
            xhr.send();

            let searchField = this.container.querySelector('.search-term');
            searchField.value = this.term;
        }

        /**
         * addImage
         * @param {String} src
         * @desc - creates figure object and append it's el property to dom
         */
        addImage(src){
            let figure, container = this.container.querySelector('.images');
            try {
                figure = Object.create(Object.prototype, {
                    src: { value: src },
                    key: { value: container.childNodes.length }
                });

                Object.defineProperty(figure, "template", { set: function (x) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(x, 'text/xml');
                    this.el = doc.firstChild;
                }});

                figure.template = `<figure data-src='${figure.src}' data-key='${figure.key}' />`;
                figure.el.addEventListener('click', lightbox.show.bind(this), false);

                container.appendChild(figure.el);
                lazyLoad(figure);

            } catch (err) {
                console.log('Error adding image: ' + err);
            }
        }

    }

    return Gallery;

})(window)

module.exports = Gallery;
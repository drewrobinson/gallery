var lazyLoad = require('./lazyload');
var LightBox = require('./lightbox');
var util     = require('../util/util');


var Gallery = (global => {
    "use strict";

    const DEFAULT_URI = '/data/tmp.json?'; //path to local json file because google limits request for free accounts
    const DEFAULT_TERM = 'snowboarding';   //default search query term
    const DEFAULT_NUM = 10;                //a number between 1-10 represents num of search results retured

    class Gallery {

        constructor(opts){

            if(!(opts.node instanceof Node)){
                throw new Error("Gallery Requires DOM Element or Node");
            }

            this.uri        = opts.uri      || DEFAULT_URI;
            this.term       = opts.term     || DEFAULT_TERM;
            this.num        = opts.num      || DEFAULT_NUM;
            this.container  = opts.node;
            this.model      = null;
            this.lightbox   = null;

            this.resolver = (responseText) =>{
                let json = JSON.parse(responseText);
                this.model = json;
                this.container.querySelector('.images').innerHTML = '';
                json.items.forEach( (item) => {
                    if (item.pagemap.hasOwnProperty('cse_image')) {
                        this.addImage(item.pagemap['cse_image'][0].src);
                    }
                });
                let searchField = this.container.querySelector('.search-term');
                    searchField.value = this.model.queries.request[0].searchTerms;

                this.lightbox = (this.lightbox) ? this.lightbox.setModel(this.model.items) : new LightBox(this.container, this.model.items);
                console.log(this.lightbox);
            };

            this.catcher = (error) => {
                throw new Error('There was an error fetching Gallery data: ' + error);
            };

            this.renderUI();
            this.fetchData().then(this.resolver).catch(this.catcher);
        }

        /**
         * renderUI
         * @desc - appends ui templates into the container node for the gallery
         */
        renderUI(){

            this.container.classList.add('container');

            let templates = [
                '<div><input type="text" class="search-term" placeholder="Enter Search Term" /></div>',
                '<div class="images"></div>'
            ];

            templates.forEach(function(template){
                let _html =  util.toHTML(template);
                this.container.appendChild(_html);
            }, this);

             let searchField = this.container.querySelector('.search-term');

             searchField.addEventListener('keyup', (e) => {
                if(e.keyCode == 13){
                    this.term = searchField.value;
                    this.fetchData().then(this.resolver).catch(this.catcher);
                }
             });
        }

        /**
         * fetchData
         * @return {Promise}
         * @desc - Makes xhr request for images and returns promise object
         */
        fetchData(){

            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                    xhr.open('GET', this.uri + '&q=' + this.term + '&num=' + this.num);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        }

        /**
         * addImage
         * @param {String} src
         * @desc - creates figure object and append it's el property to dom
         */
        addImage(src){
            let figure, container = this.container.querySelector('.images');

            let imageClickHandler = (e) => {
                let src = e.target.parentNode.attributes['data-src'].value,
                    key = e.target.parentNode.attributes['data-key'].value;

                this.lightbox.show(src, key);
            }
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
                figure.el.addEventListener('click', imageClickHandler, false);

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
/**
 *  Class representing a Gallery.
 *
 * @author Drew Robinson (hello@drewrobinson.com)
 * @version 0.0.1
 * @param  {Object} opts is an object to configure the gallery instance dom node, search uri, search term and num of results per page.
 * @return Gallery Class
 */

var lazyLoad = require('./lazyload');
var LightBox = require('./lightbox');
var util     = require('../util/util');

var Gallery = (global => {
    'use strict';

    const DEFAULT_URI = '/data/tmp.json?'; //path to local json file because google limits request for free accounts
    const DEFAULT_TERM = 'snowboarding';   //default search query term
    const DEFAULT_NUM = 10;                //a number between 1-10 represents num of search results returned

    class Gallery {

        /**
         * @throws {Error} Will throw error if opts object does not provide a node property with valid DOM Node
         */
        constructor(opts){

            if(!(opts.node instanceof Node)){
                throw new Error('Gallery Requires DOM Node');
            }

            this.uri        = opts.uri      || DEFAULT_URI;
            this.term       = opts.term     || DEFAULT_TERM;
            this.num        = opts.num      || DEFAULT_NUM;
            this.container  = opts.node;
            this.model      = null;
            this.lightbox   = null;

            /**
             *
             * @param responseText
             * @description parse xhr response from google search api and creates data model for gallery and lightbox instance
             */
            this.resolver = (responseText) =>{
                let json = JSON.parse(responseText), imagesArray = [];
                this.model = json;
                this.container.querySelector('.images').innerHTML = '';

                json.items.forEach( (item) => {
                    if (item.pagemap.hasOwnProperty('cse_image')) {
                        this.addFigure(item.pagemap['cse_image'][0].src);
                        imagesArray.push(item.pagemap['cse_image'][0].src);
                    }
                });

                let searchField = this.container.querySelector('.search-term');
                    searchField.value = this.model.queries.request[0].searchTerms;

                if(this.lightbox){
                    this.lightbox.setModel(imagesArray)
                }else{
                    this.lightbox = new LightBox(this.container, imagesArray);
                }
            };

            /**
             *
             * @param error
             * @throws {Error} Will throw error if httpXMLRequest is unsuccessful
             */
            this.catcher = (error) => {
                throw new Error('There was an error fetching Gallery data: ' + error);
            };

            this.renderUI();
            this.fetchData().then(this.resolver).catch(this.catcher);
        }

        /**
         * Creates and appends Gallery template to DOM
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

             searchField.onkeyup =(e) => {
                if(e.keyCode == 13){
                    this.term = searchField.value;
                    this.fetchData().then(this.resolver).catch(this.catcher);
                }
             };
        }

        /**
         * Makes xhr request for images
         * @return {Promise}
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
         * Creates figure object and DOM. Defines click handler for a figure. Attempts to add lazyload image to figure.
         * @param  {String} src string to serve as url or path to image
         * @throws {Error} Will throw error unable to append lazyload image to figure
         */
        addFigure(src){

            if(typeof src !== 'string'){
                throw new Error('Gallery addFigure method requires src string arg');
            }

            let container = this.container.querySelector('.images');

            let figure = Object.create(Object.prototype, {
                src: { value: src },
                key: { value: container.childNodes.length }
            });

            Object.defineProperty(figure, 'template', { set: function (x) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(x, 'text/xml');
                this.el = doc.firstChild;
            }});

            let figureClickHandler = (e) => {
                let src = e.target.parentNode.attributes['data-src'].value,
                    key = parseInt(e.target.parentNode.attributes['data-key'].value);
                this.lightbox.show(src, key);
            }

            figure.template = `<figure data-src='${figure.src}' data-key='${figure.key}' />`;
            figure.el.addEventListener('click', figureClickHandler, false);

            container.appendChild(figure.el);

            try {
                lazyLoad(figure.src, figure.el);
            } catch (err) {
                throw new Error('Error adding lazyload image: ' + err);
            }
        }

    }

    return Gallery;

})(window)

module.exports = Gallery;

var Gallery = require('./gallery/gallery');

/**
 * Create the gallery when the DOM loads
 */

document.addEventListener('DOMContentLoaded', function(e) {

    let api = 'https://www.googleapis.com/customsearch/v1?imgSize=large&cx=016488772293305661751:46ntc6xv0k8&fileType=gif%2Cpng%2Cjpg%2Cjpeg&key=AIzaSyBBwGsQ13DP7SZEKfWekT8BTyuof6Edpcc';

    //Create some instances..
    let galleryA = new Gallery({
        node: document.querySelector('#gallery-a'),
        autoload:true,
        num: 10,
        term: 'cats',
        uri: null
    });

    let galleryB = new Gallery({
        node: document.querySelector('#gallery-b'),
        autoload:false,
        num: 10,
        term: 'snowboarding',
        uri: null
    });


});
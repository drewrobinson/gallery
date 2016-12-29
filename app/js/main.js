
/**
 * Main
 */
var gallery = require('./gallery/gallery');

//Create the gallery when the DOM loads
document.addEventListener('DOMContentLoaded', function(e) {

    let opts = {
        selector: '#gallery-a',
        num: 10,
        term: 'jacket',
        uri: 'https://www.--googleapis.com/customsearch/v1?imgSize=large&cx=016488772293305661751:46ntc6xv0k8&fileType=gif%2Cpng%2Cjpg%2Cjpeg&key=AIzaSyBBwGsQ13DP7SZEKfWekT8BTyuof6Edpcc'
    };

    gallery.init(opts);

});
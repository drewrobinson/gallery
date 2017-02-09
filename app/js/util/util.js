var util = (global => {
    'use strict';

    let util = {
        /**
         * toHTML
         * @param {string}
         * @desc - helper function to convert string template to dom
         */
        toHTML: (templateString) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(templateString, 'text/html');
            return doc.getElementsByTagName('body')[0].firstChild;
        }
    };

    return util;

})()

module.exports = util;
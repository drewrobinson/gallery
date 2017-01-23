Author: Drew Robinson (hello@drewrobinson.com)

This is sample project. Intended for environments with ES6 support.

Concepts:
 - ES6 arrow functions
 - ES6 classes
 - ES6 template literals
 - Async networking with promises
 - Implement 3rd party API (Google Custom Search)

Process:
 - Build process, gulp
 - Package manager, browserify
 - Unit testing, mocha, chai, jsdom

Demo Video: http://www.screencast.com/t/JtqYRKiM

Install:
npm install && gulp

# TOC
   - [Gallery edge cases](#gallery-edge-cases)
   - [Gallery behavior](#gallery-behavior)
   - [LazyLoad edge cases:](#lazyload-edge-cases)
   - [LazyLoad behavior:](#lazyload-behavior)
   - [LightBox edge cases](#lightbox-edge-cases)
   - [LightBox behavior](#lightbox-behavior)
<a name=""></a>

<a name="gallery-edge-cases"></a>
# Gallery edge cases
constructor should throw error if option arg does not have DOM node.

```js
expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
```

should contain renderUI, fetchData, addFigure, resolver, and catcher methods.

```js
expect(instance).to.have.property('renderUI');
expect(instance).to.have.property('fetchData');
expect(instance).to.have.property('addFigure');
expect(instance).to.have.property('resolver');
expect(instance).to.have.property('catcher');
```

<a name="gallery-behavior"></a>
# Gallery behavior
resolver should update model and create instance of LightBox.

```js
var stub = sinon.stub().resolves(responseText);
return stub().then(function (data) {
    instance.resolver(data);
    expect(instance.lightbox).to.be.ok;
    expect(instance.lightbox.model.length).to.equal(1);
});
```

renderUI method should add "container" to gallery container classList.

```js
expect(instance.container.classList[0]).to.equal('container');
```

renderUI method should render template .search-term and .images selectors.

```js
expect(searchField.classList[0]).to.equal('search-term');
expect(imagesContainer.classList[0]).to.equal('images');
```

renderUI method should register keyup event handler on search field.

```js
expect(typeof searchField.onkeyup).to.equal('function');
```

addFigure method should throw error if src arg is not a String.

```js
var fnBad = function(){instance.addFigure([])};
var fnGood = function(){instance.addFigure('')};
expect(fnBad).to.throw(ADD_FIGURE_ERROR);
expect(fnGood).not.to.throw(ADD_FIGURE_ERROR);
```

addFigure method should increase childNodes count by one.

```js
instance.addFigure('');
expect(imagesContainer.childNodes.length).to.equal(1);
```

<a name="lazyload-edge-cases"></a>
# LazyLoad edge cases:
add method should throw error if first argument is not a String.

```js
expect(fnBad).to.throw(ERROR);
expect(fnGood).not.to.throw(ERROR);
```

add method should throw error if second argument is not a Node.

```js
expect(fnBad).to.throw(ERROR);
expect(fnGood).not.to.throw(ERROR);
```

<a name="lazyload-behavior"></a>
# LazyLoad behavior:
add method should add a single childnode to the figure.

```js
autoLoadInstance.add(figure.src, figure.el);
expect(figure.el.childNodes.length).to.equal(1);
```

childnode should be an IMG.

```js
autoLoadInstance.add(figure.src, figure.el);
expect(figure.el.childNodes[0].tagName).to.equal('IMG');
```

add method should NOT register mouseover event handler on image when autoload is true.

```js
autoLoadInstance.add(figure.src, figure.el);
expect(typeof figure.el.firstChild.onmouseover).to.equal('undefined');
```

add method should register mouseover event handler on image when autoload is false.

```js
nonAutoLoadInstance.add(figure.src, figure.el);
expect(typeof figure.el.firstChild.onmouseover).to.equal('function');
```

queueImage method should increase queue when called consecutively.

```js
autoLoadInstance.queueImage(figure);
autoLoadInstance.queueImage(figure);
autoLoadInstance.queueImage(figure);
expect(autoLoadInstance.queue.length).to.equal(2);
```

loadImage method should return a Promise.

```js
var result = autoLoadInstance.loadImage(figure);
expect(result instanceof Promise).to.be.ok;
```

<a name="lightbox-edge-cases"></a>
# LightBox edge cases
constructor should throw error if first arg is not a DOM node.

```js
expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
```

constructor should throw error if second arg is not an Array.

```js
expect(fnBad).to.throw(CONSTRUCTOR_ERROR);
expect(fnGood).not.to.throw(CONSTRUCTOR_ERROR);
```

should contain show, hide, prev, next, and update methods.

```js
expect(instance).to.have.property('show');
expect(instance).to.have.property('hide');
expect(instance).to.have.property('prev');
expect(instance).to.have.property('next');
expect(instance).to.have.property('update');
```

template should have .lightbox, .main, .close, .arrow-prev, and .arrow-next selectors.

```js
expect(instance.elm.classList[0]).to.equal('lightbox');
expect(closeBtn.classList[0]).to.equal('close');
expect(mainImg.classList[0]).to.equal('main');
expect(nextArrow.classList[0]).to.equal('arrow-next');
expect(prevArrow.classList[0]).to.equal('arrow-prev');
```

<a name="lightbox-behavior"></a>
# LightBox behavior
show method should throw error if first argument is not a String.

```js
expect(showMethodGood).not.to.throw(SHOW_ERROR);
expect(showMethodBad).to.throw(SHOW_ERROR);
```

show method should throw error if second argument is not a Number.

```js
expect(showMethodGood).not.to.throw(SHOW_ERROR);
expect(showMethodBad).to.throw(SHOW_ERROR);
```

show method should add "show-lightbox" to lightbox elm classList.

```js
instance.show(model[0], 0);
expect(instance.elm.classList[1]).to.equal('show-lightbox');
```

hide method should add "hide-lightbox" to lightbox elm classList.

```js
instance.show(model[0], 0);
instance.hide();
expect(instance.elm.classList[2]).to.equal('hide-lightbox');
```

next method should increment index property.

```js
var nextIndex = instance.index + 1;
instance.show(model[0], 0);
instance.next();
expect(instance.index).to.equal(nextIndex);
```

next method should reset index if at the end of list.

```js
var i = model.length-1;
instance.show(model[i], i);
instance.next();
expect(instance.index).to.equal(0);
```

prev method should decrement index property.

```js
instance.show(model[1], 1);
instance.prev();
expect(instance.index).to.equal(0);
```

prev method should reset index if at the start of list.

```js
var i = model.length-1;
instance.show(model[0], 0);
instance.prev();
expect(instance.index).to.equal(i);
```


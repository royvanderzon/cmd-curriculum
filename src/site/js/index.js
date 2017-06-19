function component () {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = 'Hello world!';

  return element;
}

hello => (){
	console.log('hello world')
}

document.body.appendChild(component());
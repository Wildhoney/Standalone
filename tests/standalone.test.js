import test from 'ava';

test('should be able to create a component;', t => {

    const node = document.createElement('x-clock');
    const element = document.body.appendChild(node);

    t.true(element.constructor === window.HTMLElement);
    t.is(element.querySelectorAll('div').length, 1);

});

test.only('should be able to create a component with attributes;', t => {

    const element = document.createElement('x-clock');
    element.setAttribute('data-timezone', 'GMT');

    document.body.appendChild(element);

    // console.log(element.outerHTML);

    // t.true(element.constructor === window.HTMLElement);
    // t.is(element.querySelectorAll('div').length, 1);

});

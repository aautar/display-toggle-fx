const $ = require('jquery');
const DisplayToggleFx = require('../src/DisplayToggleFx.js');

test('DisplayToggleFx.apply adds classes to element', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.apply(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').hasClass('fxClassA')).toEqual(true);
    expect($('#telem').hasClass('fxClassB')).toEqual(true);
});

test('DisplayToggleFx.apply changes element display state', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.apply(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').css('display')).toEqual('block');
});

test('DisplayToggleFx.unapply removes classes from element', () => {

    $('body').html(`<div id="telem" class="fxClassA fxClassB" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.unapply(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').hasClass('fxClassA')).toEqual(false);
    expect($('#telem').hasClass('fxClassB')).toEqual(false);
});

test('DisplayToggleFx.unapply sets display:none on element', (done) => {

    $('body').html(`<div id="telem" class="fxClassA fxClassB" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.unapply(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    setTimeout(() => { 
        expect($('#telem').css('display')).toEqual('none');
        done();
    }, 901);
});

test('DisplayToggleFx.getMaxTransitionDuration returns max duration', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    window.getComputedStyle = function(_elem) {
        return {
            getPropertyValue: function() {
                return "0.3s, 0.9s";
            }
        }
    };

    const maxDurMs = DisplayToggleFx.getMaxTransitionDuration(document.getElementById('telem'));

    expect(maxDurMs).toEqual(900);
});

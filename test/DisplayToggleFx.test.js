const $ = require('jquery');
const DisplayToggleFx = require('../src/DisplayToggleFx.js');

test('DisplayToggleFx.in adds classes to element', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.in(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').hasClass('fxClassA')).toEqual(true);
    expect($('#telem').hasClass('fxClassB')).toEqual(true);
});

test('DisplayToggleFx.out removes classes from element', () => {

    $('body').html(`<div id="telem" class="fxClassA fxClassB" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    DisplayToggleFx.out(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').hasClass('fxClassA')).toEqual(false);
    expect($('#telem').hasClass('fxClassB')).toEqual(false);
});

test('DisplayToggleFx.in changes element display state based on window.getComputedStyle', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    window.getComputedStyle = function(_elem) {
        return {
            getPropertyValue: function(_key) {
                if(_key === `transition-duration`) {
                    return `0.3s, 0.9s`;
                }

                if(_key === `display`) {
                    return `block`;
                }
            }
        }
    };    

    DisplayToggleFx.in(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    expect($('#telem').css('display')).toEqual('block');
});

test('DisplayToggleFx.out removes inline display style from element (reverts to style declared via base CSS class)', (done) => {

    $('body').html(`        
        <div id="telem" class="fxClassA fxClassB" style="display:block; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`
    );

    document.getElementById('telem').style.removeProperty = (p) => {
        if(p === `display`) { 
            document.getElementById('telem').style.display = '-----'; // sentinal string to indicate removal
        }
    };

    window.getComputedStyle = function(_elem) {
        return {
            getPropertyValue: function(_key) {
                if(_key === `transition-duration`) {
                    return "0.3s, 0.9s";
                }
            }
        }
    };    
    
    DisplayToggleFx.out(document.getElementById('telem'), ["fxClassA", "fxClassB"]);

    setTimeout(() => { 
        expect(document.getElementById('telem').style.display).toEqual('-----');
        done();
    }, 901);
});

test('DisplayToggleFx.out calls completion callback', (done) => {

    const onOutComplete = jest.fn();

    $('body').html(`        
        <div id="telem" class="fxClassA fxClassB" style="display:block; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`
    );

    window.getComputedStyle = function(_elem) {
        return {
            getPropertyValue: function(_key) {
                if(_key === `transition-duration`) {
                    return "0.3s, 0.9s";
                }
            }
        }
    };    
    
    DisplayToggleFx.out(document.getElementById('telem'), ["fxClassA", "fxClassB"], onOutComplete);

    setTimeout(() => { 
        expect(onOutComplete).toHaveBeenCalledTimes(1);
        done();
    }, 901);
});

test('DisplayToggleFx.getMaxTransitionDuration returns max duration', () => {

    $('body').html(`<div id="telem" style="display:none; transition: opacity 0.3s ease-in, transform 0.9s linear;"></div>`);
    
    window.getComputedStyle = function(_elem) {
        return {
            getPropertyValue: function(_key) {
                if(_key === `transition-duration`) {
                    return "0.3s, 0.9s";
                }
            }
        }
    };

    const maxDurMs = DisplayToggleFx.getMaxTransitionDuration(document.getElementById('telem'));

    expect(maxDurMs).toEqual(900);
});

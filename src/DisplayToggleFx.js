/**
 * DisplayToggleFx helps with applying/unapplying CSS classes that trigger CSS transitions, 
 * where the DOM element needs to change from a display:none state → displayed state, and vice-versa
 * 
 * v1.2 also adds support for cases where an element's width or height changes to 'auto'
 */
const DisplayToggleFx = {

    elementOutTimeouts: new Map(),

    /**
     * @param {Element} _elem
     * @param {String} _fxClasses
     */
    in: function(_elem, _fxClasses) {

        const timeoutId = DisplayToggleFx.elementOutTimeouts.get(_elem) || null;
        if(timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        // Get which properties are setup to transition
        // We'll get all of them, but we really only care about dimensional properties (width, height)
        const transitionProps = (window.getComputedStyle(_elem).getPropertyValue('transition-property')); // command-delimited string       
        const isTransitioningProperty = function(_propName) {
            if(transitionProps.indexOf(_propName) === -1) {
                return false;
            }

            return true;
        };

        const currentWidth = (window.getComputedStyle(_elem).getPropertyValue('width'));
        const currentHeight = (window.getComputedStyle(_elem).getPropertyValue('height'));        

        // apply fx classes, compute future state of display and properties being transitioned
        for(let i=0; i<_fxClasses.length; i++) {
            _elem.classList.add(_fxClasses[i]);
        }        

        const futureDisplay = (window.getComputedStyle(_elem).getPropertyValue('display'));
        const futureWidth = (window.getComputedStyle(_elem).getPropertyValue('width'));
        const futureHeight = (window.getComputedStyle(_elem).getPropertyValue('height'));
        
        // remove classes, reset width and height to initial values, and trigger reflow to render initial state
        for(let i=0; i<_fxClasses.length; i++) {       
            _elem.classList.remove(_fxClasses[i]);
        }

        if(isTransitioningProperty('width')) {
            _elem.style.width = currentWidth;
        }

        if(isTransitioningProperty('height')) {
            _elem.style.height = currentHeight;
        }

        DisplayToggleFx.forceReflow(_elem);

        // apply computed display value, apply computed width and height values (in cases where width, height is being transitioned), and trigger reflow
        _elem.style.display = futureDisplay;        

        if(isTransitioningProperty('width')) {
            _elem.style.width = futureWidth;
        }

        if(isTransitioningProperty('height')) {
            _elem.style.height = futureHeight;
        }        

        DisplayToggleFx.forceReflow(_elem);

        for(let i=0; i<_fxClasses.length; i++) {
            _elem.classList.add(_fxClasses[i]);
        }
    },

    forceReflow: function(_elem) {
        _elem.offsetLeft;
    },

    /**
     * @param {Element} _elem
     * @returns {Number}
     */
    getMaxTransitionDuration: function(_elem) {
        var allTransitionDurations = (window.getComputedStyle(_elem).getPropertyValue('transition-duration')) || '';
        allTransitionDurations = allTransitionDurations.split(',');
        
        var maxDurationMs = 0;
        allTransitionDurations.forEach(function(_dur) {
            if(_dur.indexOf('s') !== -1) {
                const durationMs = (_dur.replace(/s/g, '')) * 1000.0;
                if(durationMs > maxDurationMs) {
                    maxDurationMs = durationMs;
                }
                return;
            }

            if(_dur.indexOf('ms') !== -1) {
                const durationMs = (_dur.replace(/ms/g, ''));
                if(durationMs > maxDurationMs) {
                    maxDurationMs = durationMs;
                }
                return;
            }
        });

        return maxDurationMs;
    },

    /**
     * @param {Element} _elem
     * @param {String} _fxClasses
     * @param {Function|undefined} _onOutComplete
     */
    out: function(_elem, _fxClasses, _onOutComplete) {

        const maxTransitionDuration = DisplayToggleFx.getMaxTransitionDuration(_elem);

        _elem.style.removeProperty('width');
        _elem.style.removeProperty('height');

        for(let i=0; i<_fxClasses.length; i++) {       
            _elem.classList.remove(_fxClasses[i]);
        }

        const timeoutId = setTimeout(function() {
            _elem.style.removeProperty('display');
            
            if(_onOutComplete) {
                _onOutComplete();
            }
            
        }, maxTransitionDuration);

        DisplayToggleFx.elementOutTimeouts.set(_elem, timeoutId);
    }
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayToggleFx;
}

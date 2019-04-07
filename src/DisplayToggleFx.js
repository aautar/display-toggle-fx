/**
 * DisplayToggleFx helps with applying/unapplying CSS classes that trigger CSS transitions, 
 * where the DOM element needs to change from a display:none state → displayed state, and vice-versa
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

        const preWidth = (window.getComputedStyle(_elem).getPropertyValue('width'));
        const preHeight = (window.getComputedStyle(_elem).getPropertyValue('height'));
        
        // apply classes and get computed display
        for(let i=0; i<_fxClasses.length; i++) {
            _elem.classList.add(_fxClasses[i]);
        }        

        const computedDisplay = (window.getComputedStyle(_elem).getPropertyValue('display'));
        const computedWidth = (window.getComputedStyle(_elem).getPropertyValue('width'));
        const computedHeight = (window.getComputedStyle(_elem).getPropertyValue('height'));
        
        // remove classes and trigger reflow to render initial state
        for(let i=0; i<_fxClasses.length; i++) {       
            _elem.classList.remove(_fxClasses[i]);
        }

        _elem.style.width = preWidth;
        _elem.style.height = preHeight;

        DisplayToggleFx.forceReflow(_elem);

        // apply computed display value and trigger reflow
        _elem.style.display = computedDisplay;        

        if(computedWidth !== preWidth) { // can we see if 'auto' is actually set?
            _elem.style.width = computedWidth;
        }

        if(computedHeight !== preHeight) {
            _elem.style.height = computedHeight;
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

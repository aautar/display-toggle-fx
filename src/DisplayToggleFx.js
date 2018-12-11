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
        
        // apply classes and get computed display
        for(let i=0; i<_fxClasses.length; i++) {
            _elem.classList.add(_fxClasses[i]);
        }        

        const computedDisplay = (window.getComputedStyle(_elem).getPropertyValue('display'));
        
        // remove classes and trigger reflow to render initial state
        for(let i=0; i<_fxClasses.length; i++) {       
            _elem.classList.remove(_fxClasses[i]);
        }
        _elem.offsetLeft;

        // apply computed display value and trigger reflow
        if(computedDisplay === 'none') {
            _elem.style.display = 'block';
        } else {
            _elem.style.display = computedDisplay;
        }        
        _elem.offsetLeft;

        for(let i=0; i<_fxClasses.length; i++) {
            _elem.classList.add(_fxClasses[i]);
        }
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
     */
    out: function(_elem, _fxClasses) {

        const maxTransitionDuration = DisplayToggleFx.getMaxTransitionDuration(_elem);

        for(let i=0; i<_fxClasses.length; i++) {       
            _elem.classList.remove(_fxClasses[i]);
        }

        const timeoutId = setTimeout(function() {
            _elem.style.display = "none";
        }, maxTransitionDuration);

        DisplayToggleFx.elementOutTimeouts.set(_elem, timeoutId);
    }
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayToggleFx;
}

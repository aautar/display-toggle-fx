/**
 * DisplayToggleFx helps with applying/unapplying CSS classes that trigger CSS transitions, 
 * where the DOM element needs to change from a display:none state → displayed state, and vice-versa
 */
const DisplayToggleFx = {

    /**
     * @param {Element} _elem
     * @param {String} _fxClasses
     * @param {String} _cssDisplayVal
     */
    in: function(_elem, _fxClasses, _cssDisplayVal) {
        _elem.style.display = _cssDisplayVal || 'block';
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
                if(durationMs > minDurationMs) {
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

        setTimeout(function() {
            _elem.style.display = "none";
        }, maxTransitionDuration);
    }
};

if(typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayToggleFx;
}

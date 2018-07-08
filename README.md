# display-toggle-fx

## Motivation

This is small library to address a simple, but common issues that surfaces when doing CSS transitions on elements that needs to be popped in and out of the DOM (`display:none` → `display:xxxxx`, and vice-versa).

## Usage

### Transition In
Go from `display:none` → `display:block` and apply the transition rules defined in the CSS class `transitionClass`

*DisplayToggleFx.in(document.getElementById('testObj'), ['transitionClass']);*

### Transition Out
Remove the CSS class `transitionClass` and go from `display:xxxx` → `display:none` when the transition is complete. 

*DisplayToggleFx.out(document.getElementById('testObj'), ['transitionClass']);*

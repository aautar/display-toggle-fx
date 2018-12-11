# display-toggle-fx

## Motivation

This is small library that addresses a few issues around working with CSS transitions, on elements that need to transition to or from the `display:none` state.

- When transitioning in and going from `display:none` to a display state where the element is part of the document flow (e.g. `display:block`), [Reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) much occur. If not, the element is displayed instanlty in the DOM, in its final state (as if all transitions have been played to completion). 

- When transitioning out and going to `display:none`, the `display:none` CSS rule must be applied after all transitions effects are played to completion. If not, the element will disappear instantly, before any transition effects are rendered.

## Usage

The library assumes an element is styled in its `display:none` state:

```css
#testObj {
  display: none;
  opacity: 0;
  transform: translateX(100px);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
```

.. and a class defines the element's displayed state:

```css
#testObj.transitionClass {
  display: flex;
  opacity: 1;
  transform: none;   
}
```

(Note that if no `display` rule is specified, the library will assume `block` when transitioning in)

### Transition In
Go from `display:none` → `display:flex` and apply the transition rules defined in the CSS class `transitionClass`

```javascript
DisplayToggleFx.in(document.getElementById('testObj'), ['transitionClass']);
```

### Transition Out
Remove the CSS class `transitionClass` and go from `display:flex` → `display:none` when the transition is complete. 

```javascript
DisplayToggleFx.out(document.getElementById('testObj'), ['transitionClass']);
```

## Other things
Prior to `v2.0.0` transitions were not interruptable (i.e. it was not possible to stop transitioning out half way though, and switch to transitioning in). `v2.0.0` fixes this and allow for interrupting transitions.

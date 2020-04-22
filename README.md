# display-toggle-fx

## Motivation

This is small library that addresses a few issues that pop up when working with CSS transitions on elements that need to transition to or from the `display:none` state and/or elements that needs to transition to a width or height value of `auto`.

Issues tackled:

- When transitioning "in" and going from `display:none` to a display state where the element is part of the document flow (e.g. `display:block`), [Reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) must occur. If not, the element is displayed instanlty in the DOM, in its final state (as if all transitions have been instantly played to completion). 

- When transitioning "out" and going to `display:none`, the `display:none` CSS rule must be applied after all transitions effects are played to completion. If not, the element will disappear instantly, before any transition effects are rendered.

- When transitioning "in" and going to a width or height value of `auto`, the element will instantly assume its final size and not transition smoothly to it. Reflow must occur, but `auto` also can't be used here and the width/height of the element needs to be computed as an actual value first.

## Philosophy

As much as possible this library tries to work with and respect the rules defined via CSS classes applied to DOM elements.

## Usage

Style the element to be transitioned in the "out" (i.e. not-displayed) state:

```css
#testObj {
  display: none;
  opacity: 0;
  transform: translateX(100px);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
```

.. create a class that defines the element's "in" state:

```css
#testObj.transitionClass {
  display: flex;
  opacity: 1;
  transform: none;   
}
```

### Transition In
Apply the transition rules defined in the CSS class `transitionClass`

```javascript
DisplayToggleFx.in(document.getElementById('testObj'), ['transitionClass']);
```

### Transition Out
Remove the CSS class `transitionClass`

```javascript
DisplayToggleFx.out(document.getElementById('testObj'), ['transitionClass']);
```

## Other things
- Prior to v4.0.0, `DisplayToggleFx.in()` would automatically apply `display:none` if the computed display style was `none` (typically occurred if a non-display-none style wasn't specified). This is no longer the case as of v4.0.0 as it leads to unintuitive and unexpected behaviors, especially when working with media queries, where it's expected that the media query rules take precedence over transition styling rules).

- Prior to v4.0.0, `DisplayToggleFx.out()` would automatically apply and leave an inline style of `display:none` on the element. This is no longer the case and any inline `display` styles applied are removed when the transition is complete.

- Prior to `v2.0.0` transitions were not interruptable (i.e. it was not possible to stop transitioning out half way though, and switch to transitioning in). `v2.0.0` fixes this and allow for interrupting transitions.

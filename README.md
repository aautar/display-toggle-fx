# display-toggle-fx

## Motivation

This is small library that addresses a few issues around working with CSS transitions on elements that need to go to or from the `display:none` state.

- When transitioning in and going from `display:none` to a display state where the element is part of the document flow (e.g. `display:block`), [https://developer.mozilla.org/en-US/docs/Glossary/Reflow](reflow) much occur. If not, the element is displayed in the DOM, in it's final state (as if all transitions have been played to completion), instantly. 

- When transitioning out and going to `display:none`, the `display:none` CSS rule must be applied after all transitions effects are played to completion. If not, the element will disappear instantly and no transition effects will be visible.

- Transitions being 'interruptable' should be maintained. e.g. it should still be possible to stop transitioning out half way though, and transition in.

## Usage

### Transition In
Go from `display:none` → `display:block` and apply the transition rules defined in the CSS class `transitionClass`

```javascript
DisplayToggleFx.in(document.getElementById('testObj'), ['transitionClass']);
```

Go from `display:none` → `display:flex` and apply the transition rules defined in the CSS class `transitionClass`

```javascript
DisplayToggleFx.in(document.getElementById('testObj'), ['transitionClass'], 'flex');
```

### Transition Out
Remove the CSS class `transitionClass` and go from `display:xxxx` → `display:none` when the transition is complete. 

```javascript
DisplayToggleFx.out(document.getElementById('testObj'), ['transitionClass']);
```

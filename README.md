# display-toggle-fx

## Motivation

This is small library that addresses a few issues when working with CSS transitions & elements that need to transition to or from the `display:none` state.

- When transitioning "in" and going from `display:none` to a display state where the element is part of the document flow (e.g. `display:block`), [reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) must occur. If not, the element is displayed instantly in the DOM, in its final state (as if all transitions have been instantly played to completion). 

- When transitioning "out" and going to `display:none`, the `display:none` CSS rule must be applied after all transition effects are played to completion. If not, the element will disappear instantly, before any transition effects are rendered.

#### Why use `display:none` at all?
It's tempting to just avoid using `display:none` and either setting the element's opacity to 0 (e.g. `opacity:0`) or positioning it outside of the viewport (e.g. `top:-99999px`), however, both of these hacks come with some issues:

- Setting `opacity:0` makes an element invisible, but it's still within the DOM and can be interacted with. An issue that typically manifests is that the element is invisible but is positioned such that it blocks interaction with elements behind it.
- Moving the element outside the viewport alters the effect of transitions that involvement movement. For example, if the element should be at `top:100px` when visible and we want to transition such that we go from `top:0px` → `top:100px` over 5s, that's a 100px transition over 5s. Going from `top:-99999px` → `top:100px` that's a transition of 100,099px over 5s, so the element will be moving much, much faster.
- Even if elements are not visible to the user, they are within the DOM and within the flow of the page, they'll be picked up and read by things like screen readers and web crawlers.

Using `visibility` instead of `display` is a potential solution, but it comes with some of the same problems as `display` when working with transitions. Specifically, transitioning out to a state with `visibility:none`, applies the rule instantly and the element will disappear instantly. As with transitioning to `display:none`, all the transition effects need to play to completion before the rule is applied.

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

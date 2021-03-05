# VisibilityMixin

The `VisibilityMixin` can be used to show, hide or remove your component with an opacity and animated transition.

## Usage

Apply the `VisibilityMixin` to any component that needs to enter/exit the view with a fade + translate animation:

```js
import { VisibilityMixin } from '@brightspace-ui/core/mixins/visibility-mixin.js';

class MyComponent extends VisibilityMixin(LitElement) {
	render() {
		return html`
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		`;
	}
}
customElements.define('my-component', MyComponent);
```

To show the component with the transition, render it with the attribute `animate='show'`. The opacity & transform are animated to the component's values at the time in which `animate` is first updated.
To hide the component, apply the attribute `animate='hide'`. Alternatively, to remove the component, apply the attribute `animate='remove'`.
Once the component is hidden (but not removed), show the component again by re-applying the attribute `animate='show'`.

```js
import './my-component.js';

class MyComponentParent extends VisibilityMixin(LitElement) {
	constructor() {
		super();
		this.myComponent = document.createElement('my-component');
	}

	render() {
		return html`
			<h5>Title</h5>
		`;
	}

	addMyComponent() {
		this.appendChild(this.myComponent);
		showMyComponent();
	}

	hideMyComponent() {
		this.myComponent.animate = 'hide';
	}

	removeMyComponent() {
		this.myComponent.animate = 'remove';
	}

	showMyComponent() {
		this.myComponent.animate = 'show';
	}

}
```

If the component using `VisibilityMixin`, a child of your component, etc., has margin, you **must** use `display: grid` or `display: flex` on your component for the animation to function normally!

```js
import { VisibilityMixin } from '@brightspace-ui/core/mixins/visibility-mixin.js';

class MyComponent extends VisibilityMixin(LitElement) {
	static get styles() {
		return css`
			:host {
				display: grid;
			}
		`;
	}

	render() {
		return html`
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		`;
	}
}
customElements.define('my-component', MyComponent);
```

## Events

Each of show/hide/remove fire events at the beginning and ending of their transition:
- `d2l-visibility-mixin-show-start`
- `d2l-visibility-mixin-show-end`
- `d2l-visibility-mixin-hide-start`
- `d2l-visibility-mixin-hide-end`
- `d2l-visibility-mixin-remove-start`
- `d2l-visibility-mixin-remove-end`

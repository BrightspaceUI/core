import { LitElement } from 'lit';

/**
 * Creates a Lit component that mirrors properties of another, and passes its properties through to
 * a specific rendered element.
 *
 * @param superclass The Lit class to mirror (will copy all its properties).
 * @param { String } target The element name or other selector string of the element to pass properties to.
 */
export const DemoPassthroughMixin = (superclass, target) => class extends LitElement {
	static get properties() {
		return Object.fromEntries(superclass.elementProperties);
	}

	firstUpdated() {
		this.target = this.shadowRoot.querySelector(target);
	}

	updated(changedProperties) {
		const propertyDefinitions = superclass.elementProperties;
		changedProperties.forEach((_value, key) => {
			if (propertyDefinitions.get(key)?.attribute !== false) this.target[key] = this[key];
		});
	}
};

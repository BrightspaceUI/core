import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';

/**
 * A dot-separated list of object properties.
 * @slot - Items of the type d2l-object-property-list-item* to be added to the container
 */
class ObjectPropertyList extends LitElement {
	static get styles() {
		return [bodySmallStyles, css`
			:host, slot {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(:last-child) {
				--d2l-object-property-list-item-separator-display: none;
			}
		`];
	}

	render() {
		return html`<slot class="d2l-body-small"></slot>`;
	}
}

customElements.define('d2l-object-property-list', ObjectPropertyList);

import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { trimWhitespace } from './trimWhitespace.js';

/**
 * A placeholder.
 * @slot - Items of the type d2l-object-property-list-item* to be added to the container
 */
class ObjectPropertyList extends LitElement {
	static get styles() {
		return [bodySmallStyles, css`
			:host {
				display: contents;
			}
			slot {
				display: block;
			}
			::slotted(:last-child) {
				--d2l-object-property-list-item-separator-display: none;
			}
		`];
	}

	render() {
		return html`${trimWhitespace()}<slot class="d2l-body-small"></slot>`;
	}
}

customElements.define('d2l-object-property-list', ObjectPropertyList);

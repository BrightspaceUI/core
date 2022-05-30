import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';

/**
 * A placeholder.
 */
class Metadata extends LitElement {
	static styles = [bodySmallStyles, css`
		:host {
			display: flex;
			align-items: center;
		}
		::slotted(:last-child) {
			--d2l-metadata-item-separator-display: none;
		}
	`];

	render() {
		return html`<slot class="d2l-body-small"></slot>`;
	}

}

customElements.define('d2l-metadata', Metadata);

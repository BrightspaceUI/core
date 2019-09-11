import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListItemContent extends LitElement {
	static get styles() {
		return [ bodySmallStyles, bodyCompactStyles, css`
			.d2l-list-item-content-text {
				color: var(--d2l-list-item-content-text-color, null);
				margin: 0;
				overflow: hidden;
				text-decoration: var(--d2l-list-item-content-text-decoration, none);
			}

			.d2l-list-item-content-text-secondary {
				color: var(--d2l-list-item-content-text-secondary-color, var(--d2l-color-tungsten));
				margin: 0;
				margin-top: 0.15rem;
				overflow: hidden;
			}
		`];
	}

	render() {

		return html`
			<div class="d2l-list-item-content-text d2l-body-compact"><slot></slot></div>
			<div class="d2l-list-item-content-text-secondary d2l-body-small"><slot name="secondary"></slot></div>
		`;
	}
}

customElements.define('d2l-list-item-content', ListItemContent);

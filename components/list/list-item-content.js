import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class ListItemContent extends LitElement {

	static get styles() {
		return [ bodySmallStyles, bodyCompactStyles, css`

			.d2l-list-item-content-text {
				margin: 0;
				max-height: 2.4rem;
				overflow: hidden;
			}

			.d2l-list-item-content-text-secondary {
				margin: 0;
				margin-top: 0.3rem;
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

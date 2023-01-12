import '../colors/colors.js';
import { bodyCompactStyles, bodySmallStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';

/**
 * A component for consistent layout of primary and secondary text in a list item.
 * @slot - Primary text of the list item
 * @slot secondary - Secondary text of the list item
 * @slot supporting-info - Information that supports the list item
 */
class ListItemContent extends LitElement {

	static get styles() {
		return [ bodySmallStyles, bodyCompactStyles, css`
			.d2l-list-item-content-text {
				border-radius: var(--d2l-list-item-content-text-border-radius);
				color: var(--d2l-list-item-content-text-color);
				margin: 0;
				outline: var(--d2l-list-item-content-text-outline, none);
				outline-offset: var(--d2l-list-item-content-text-outline-offset);
				text-decoration: var(--d2l-list-item-content-text-decoration, none);
			}

			.d2l-list-item-content-text-secondary {
				color: var(--d2l-list-item-content-text-secondary-color, var(--d2l-color-tungsten));
				margin: 0;
				overflow: hidden;
			}

			.d2l-list-item-content-text-supporting-info {
				color: var(--d2l-color-ferrite);
				margin: 0;
				overflow: hidden;
			}

			.d2l-list-item-content-text-secondary ::slotted(*),
			.d2l-list-item-content-text-supporting-info ::slotted(*) {
				margin-top: 0.15rem;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-list-item-content-text d2l-body-compact"><slot></slot></div>
			<div class="d2l-list-item-content-text-secondary d2l-body-small"><slot name="secondary"></slot></div>
			<div class="d2l-list-item-content-text-supporting-info d2l-body-small"><slot name="supporting-info"></slot></div>
		`;
	}

}

customElements.define('d2l-list-item-content', ListItemContent);

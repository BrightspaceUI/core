import '../colors/colors.js';
import { css, html } from 'lit';
import { labelStyles } from '../typography/styles.js';

export const TagListItemMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [labelStyles, css`
			:host {
				display: grid;
				outline: none;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-item-content {
				height: 1rem;
				margin: auto;
				min-width: 0;
				/* text-overflow: ellipsis; */ /* TODO: deal with this */
				white-space: nowrap;
			}
			.tag-list-item-container {
				background-color: var(--d2l-color-regolith);
				border-radius: 6px;
				box-shadow: inset 0 0 0 1px var(--d2l-color-gypsum), 0 2px 4px rgba(0, 0, 0, 0.03);
				box-sizing: border-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				padding: 0.25rem 0.6rem;
				transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out;
			}
			:host(:hover) .tag-list-item-container,
			:host(:focus) .tag-list-item-container {
				background-color: var(--d2l-color-sylvite);
			}
			:host(:hover) .tag-list-item-container {
				box-shadow: inset 0 0 0 1px var(--d2l-color-mica), 0 2px 4px rgba(0, 0, 0, 0.03);
			}
			:host(:focus) .tag-list-item-container {
				box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), 0 2px 4px rgba(0, 0, 0, 0.03);
			}

			@media (prefers-reduced-motion: reduce) {
				.tag-list-item-container {
					transition: none;
				}
			}
		`];
	}

	constructor() {
		super();
		/** @ignore */
		this.role = 'listitem';
	}

	_renderTag(tagContent) {
		return html`
			<div class="tag-list-item-container d2l-label-text">
				<div class="tag-list-item-content">${tagContent}</div>
			</div>
		`;
	}

};

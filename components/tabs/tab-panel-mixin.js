import { css } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';

export const TabPanelMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * REQUIRED: Id of the tab that labels this panel
			 * @type {string}
			 */
			labelledBy: { type: String, attribute: 'labelled-by', reflect: true },
			/**
			 * Opt out of default padding/whitespace around the panel
			 * @type {boolean}
			 */
			noPadding: { type: Boolean, attribute: 'no-padding', reflect: true },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			/**
			 * DEPRECATED: Use to select the tab. Do NOT set if using the d2l-tab/d2l-tab-panel implementation.
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * DEPRECATED: The text used for the tab, as well as labelling the panel. Required if not using d2l-tab/d2l-tab-panel implementation.
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: none;
				margin: 1.2rem 0 0 0;
			}
			:host([no-padding]) {
				margin: 0;
			}
			:host([selected]) {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this.noPadding = false;
		/** @ignore */
		this.role = 'tabpanel';
		this.selected = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.id.length === 0) this.id = getUniqueId();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'labelledBy') {
				this.setAttribute('aria-labelledby', this.labelledBy);
			} else if (prop === 'selected') {
				if (this.selected) {
					requestAnimationFrame(() => {
						/** DEPRECATED: Dispatched when a tab is selected */
						this.dispatchEvent(new CustomEvent(
							'd2l-tab-panel-selected', { bubbles: true, composed: true }
						));
					});
				}
			} else if (prop === 'text') {
				this.setAttribute('aria-label', this.text);
				/** DEPRECATED: Dispatched when the text attribute is changed */
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-panel-text-changed', { bubbles: true, composed: true, detail: { text: this.text } }
				));
			}
		});
	}

};

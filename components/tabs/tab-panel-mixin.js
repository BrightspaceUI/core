import { css } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';

export const TabPanelMixin = superclass => class extends superclass {

	static properties = {
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
		_selected: { type: Boolean, attribute: '_selected', reflect: true }
	};

	static styles = css`
		:host {
			box-sizing: border-box;
			display: none;
			margin: 1.2rem 0 0 0;
		}
		:host([no-padding]) {
			margin: 0;
		}
		:host([_selected]) {
			display: block;
		}
	`;

	constructor() {
		super();
		this.noPadding = false;
		/** @ignore */
		this.role = 'tabpanel';
		this._selected = false;
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
			}
		});
	}

};

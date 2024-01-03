import { findComposedAncestor } from '../../helpers/dom.js';

export const ListItemRoleMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			_nested: { type: Boolean, reflect: true },
			_separators: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this._nested = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (!parent) return;

		const separators = parent.getAttribute('separators');

		this.role = parent.hasAttribute('grid') ? 'rowgroup' : 'listitem';
		this._nested = (parent.slot === 'nested');
		this._separators = separators || undefined;
		this._extendSeparators = parent.hasAttribute('extend-separators');
	}

};

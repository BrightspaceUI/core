export const CollectionMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Total number of items. If not specified, features like select-all-pages will be disabled.
			 * @type {number}
			 */
			itemCount: { type: Number, attribute: 'item-count', reflect: true },
		};
	}

	constructor() {
		super();
		this.itemCount = null;
	}

};

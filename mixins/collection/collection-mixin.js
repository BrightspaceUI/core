/**
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<import('lit').ReactiveElement>} ReactiveElementConstructor
 * @typedef {ReactiveElementConstructor & Pick<typeof import('lit').ReactiveElement, keyof typeof import('lit').ReactiveElement>} ReactiveElementClassType
 */

/**
 * @template {ReactiveElementClassType} S
 * @param {S} superclass
 */
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

	constructor(...args) {
		super(...args);
		this.itemCount = null;
	}

};

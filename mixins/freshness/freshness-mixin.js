export const freshness = Object.freeze({
	fresh: 'fresh',
	stale: 'stale',
	loading: 'loading'
});

export const FreshnessMixin = superclass => class extends superclass {

	static properties = {
		/**
		 * The freshness of the component data
		 * @type {'fresh'|'stale'|'loading'}
		 * @default "fresh"
		 */
		freshness: { type: String, attribute: 'freshness', reflect: true },
		/**
		 * The button text in the overlay when 'stale'
		 * @type {string}
		 */
		freshnessStaleButtonText: {
			type: String, attribute: 'freshness-stale-button-text', reflect: true },
		/**
		 * The text message in the overlay when 'stale'
		 * @type {string}
		 */
		freshnessStaleText: {
			type: String, attribute: 'freshness-stale-text', reflect: true }
	};

	constructor() {
		super();
		this.freshness = freshness.fresh;
	}

};

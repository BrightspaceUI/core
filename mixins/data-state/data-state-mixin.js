import { PropertyRequiredMixin } from '../property-required/property-required-mixin.js';

export const dataStates = Object.freeze({
	clean: 'clean',
	dirty: 'dirty',
	loading: 'loading'
});

export const DataStateMixin = superclass => class extends PropertyRequiredMixin(superclass) {

	static properties = {

		/**
		 * The state of data in the data component. Set to 'clean' when the data represents the user's latest selections, 'dirty' when the data does not represent the user's latest selections, and 'loading' if the data is being actively refreshed
		 * @type {'clean'|'dirty'|'loading'}
		 * @default "clean"
		 */
		dataState: { type: String, attribute: 'data-state', reflect: true },
		/**
		 * The text displayed on the button dirty state overlay when the 'dirty' dataState is set.
		 * @type {string}
		 */
		dirtyButtonText: {
			type: String, attribute: 'dirty-button-text', reflect: true, required: {
				dependentProps: ['dataState'],
				validator: (_value, elem, hasValue) => hasValue || elem.dataState !== dataStates.dirty
			}
		},
		/**
		 * The text displayed on the dirty state overlay when the 'dirty' dataState is set.
		 * @type {string}
		 */
		dirtyText: {
			type: String, attribute: 'dirty-text', reflect: true, required: {
				dependentProps: ['dataState'],
				validator: (_value, elem, hasValue) => hasValue || elem.dataState !== dataStates.dirty
			}
		}
	};

	constructor() {
		super();
		this.dataState = dataStates.clean;
		this.dirtyButtonText = null;
		this.dirtyText = null;
	}

};

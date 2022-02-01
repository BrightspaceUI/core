import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

export const SelectionActionMixin = superclass => class extends SelectionObserverMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the action requires one or more selected items
			 * @type {boolean}
			 */
			requiresSelection: { type: Boolean, attribute: 'requires-selection', reflect: true }
		};
	}

	constructor() {
		super();
		this.requiresSelection = false;
	}

	get selectionInfo() {
		return super.selectionInfo;
	}

	set selectionInfo(value) {
		super.selectionInfo = value;
		this.disabled = (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none);
	}

};

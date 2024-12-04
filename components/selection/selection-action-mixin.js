import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

export const SelectionActionMixin = superclass => class extends LocalizeCoreElement(SelectionObserverMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Disables bulk actions in the list or table controls once the selection limit is reached, but does not prevent further selection
			 * @type {number}
			 */
			maxSelectionCount: { type: Number, attribute: 'max-selection-count' },
			/**
			 * Whether the action requires one or more selected items
			 * @type {boolean}
			 */
			requiresSelection: { type: Boolean, attribute: 'requires-selection', reflect: true },
			_disabledTooltip: { state: true }
		};
	}

	constructor() {
		super();
		this.maxSelectionCount = Infinity;
		this.requiresSelection = false;
	}

	get selectionInfo() {
		return super.selectionInfo;
	}

	set selectionInfo(value) {
		super.selectionInfo = value;

		// if these rules are not set, we let the consumer manage the disabled property if they want
		if (!this.requiresSelection && this.maxSelectionCount === Infinity) return;

		if (this.selectionInfo.keys.length > this.maxSelectionCount || (this.selectionInfo.state === SelectionInfo.states.allPages && this._provider?.itemCount > this.maxSelectionCount)) {
			this.disabled = true;
			this._disabledTooltip = this.localize('components.selection.action-max-hint', { countFormatted: formatNumber(this.maxSelectionCount) });
		} else if (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none) {
			this.disabled = true;
			this._disabledTooltip = this.localize('components.selection.action-required-hint');
		} else {
			this.disabled = false;
			this._disabledTooltip = undefined;
		}

	}

};

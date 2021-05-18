/*
export const selectionTypes = {
	none: 'none',
	single: 'single',
	multiple: 'multiple'
}
*/

export class SelectionInfo {

	constructor(keys, state) {
		if (!keys) keys = [];
		if (!state) state = SelectionInfo.states.none;
		this._keys = keys;
		this._state = state;
	}

	get keys() {
		return this._keys;
	}

	get state() {
		return this._state;
	}

	static get states() {
		return {
			none: 'none',
			some: 'some',
			all: 'all'
		};
	}

}

export const SelectionMixin = superclass => class extends superclass {

	static get properties() {
		return {
			//selectionType: { type: String, attribute: 'selection-type' }
		};
	}

	constructor() {
		super();
		//this.selectionType = selectionTypes.none;
		this._selectionSubscribers = new Map();
		this._selectionSelectables = new Map();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-selection-change', this._handleSelectionChange);
		this.addEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.addEventListener('d2l-selection-subscriber-subscribe', this._handleSelectionSubscriberSubscribe);
		this.addEventListener('d2l-selection-subscriber-unsubscribe', this._handleSelectionSubscriberUnsubscribe);
		this.addEventListener('d2l-selection-checkbox-subscribe', this._handleSelectionCheckboxSubscribe);
		this.addEventListener('d2l-selection-checkbox-unsubscribe', this._handleSelectionCheckboxUnsubscribe);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-selection-change', this._handleSelectionChange);
		this.removeEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.removeEventListener('d2l-selection-subscriber-subscribe', this._handleSelectionSubscriberSubscribe);
		this.removeEventListener('d2l-selection-subscriber-unsubscribe', this._handleSelectionSubscriberUnsubscribe);
		this.removeEventListener('d2l-selection-checkbox-subscribe', this._handleSelectionCheckboxSubscribe);
		this.removeEventListener('d2l-selection-checkbox-unsubscribe', this._handleSelectionCheckboxUnsubscribe);
	}

	getSelectionInfo() {
		const keys = [];
		this._selectionSelectables.forEach(selectable => {
			if (selectable.selected) keys.push(selectable.key);
		});

		let state = SelectionInfo.states.none;
		if (keys.length > 0) {
			if (keys.length === this._selectionSelectables.size) state = SelectionInfo.states.all;
			else state = SelectionInfo.states.some;
		}

		return new SelectionInfo(keys, state);
	}

	_handleSelectionChange() {
		this._updateSelectionSubscribers();
	}

	_handleSelectionCheckboxSubscribe(e) {
		e.stopPropagation();
		const target = e.composedPath()[0];
		if (this._selectionSelectables.has(target)) return;
		this._selectionSelectables.set(target, target);
	}

	_handleSelectionCheckboxUnsubscribe(e) {
		e.stopPropagation();
		const target = e.composedPath()[0];
		this._selectionSelectables.delete(target);
	}

	_handleSelectionSelectAllChange(e) {
		const checked = e.detail.checked;
		this._selectionSelectables.forEach(selectable => selectable.selected = checked);
		this._updateSelectionSubscribers();
	}

	_handleSelectionSubscriberSubscribe(e) {
		e.stopPropagation();
		const target = e.composedPath()[0];
		if (this._selectionSubscribers.has(target)) return;
		this._selectionSubscribers.set(target, target);
		this._updateSelectionSubscribers();
	}

	_handleSelectionSubscriberUnsubscribe(e) {
		e.stopPropagation();
		const target = e.composedPath()[0];
		this._selectionSubscribers.delete(target);
	}

	_updateSelectionSubscribers() {
		if (!this._selectionSubscribers || this._selectionSubscribers.size === 0) return;

		// debounce the updates for select-all case
		if (this._updateSubscribersRequested) return;

		this._updateSubscribersRequested = true;
		setTimeout(() => {
			const info = this.getSelectionInfo();
			this._selectionSubscribers.forEach(subscriber => subscriber.selectionInfo = info);
			this._updateSubscribersRequested = false;
		}, 0);
	}

};


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

	constructor() {
		super();
		this._selectionObservers = new Map();
		this._selectionSelectables = new Map();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-selection-change', this._handleSelectionChange);
		this.addEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.addEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.addEventListener('d2l-selection-checkbox-subscribe', this._handleSelectionCheckboxSubscribe);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-selection-change', this._handleSelectionChange);
		this.removeEventListener('d2l-selection-select-all-change', this._handleSelectionSelectAllChange);
		this.removeEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.removeEventListener('d2l-selection-checkbox-subscribe', this._handleSelectionCheckboxSubscribe);
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

	unsubscribeObserver(target) {
		this._selectionObservers.delete(target);
	}

	unsubscribeSelectable(target) {
		this._selectionSelectables.delete(target);
		this._updateSelectionObservers();
	}

	_handleSelectionChange() {
		this._updateSelectionObservers();
	}

	_handleSelectionCheckboxSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		if (this._selectionSelectables.has(target)) return;
		this._selectionSelectables.set(target, target);
	}

	_handleSelectionObserverSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		if (this._selectionObservers.has(target)) return;
		this._selectionObservers.set(target, target);
		this._updateSelectionObservers();
	}

	_handleSelectionSelectAllChange(e) {
		const checked = e.detail.checked;
		this._selectionSelectables.forEach(selectable => selectable.selected = checked);
		this._updateSelectionObservers();
	}

	_updateSelectionObservers() {
		if (!this._selectionObservers || this._selectionObservers.size === 0) return;

		// debounce the updates for select-all case
		if (this._updateObserversRequested) return;

		this._updateObserversRequested = true;
		setTimeout(() => {
			const info = this.getSelectionInfo();
			this._selectionObservers.forEach(observer => observer.selectionInfo = info);
			this._updateObserversRequested = false;
		}, 0);
	}

};

import { getFirstFocusableDescendant, getLastFocusableDescendant, getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { CollectionMixin } from '../../mixins/collection/collection-mixin.js';
import { isComposedAncestor } from '../../helpers/dom.js';

const keyCodes = {
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	UP: 38
};

export class SelectionInfo {

	constructor(keys, state, allEnabledSelected) {
		if (!allEnabledSelected) allEnabledSelected = false;
		if (!keys) keys = [];
		if (!state) state = SelectionInfo.states.none;

		this.#allEnabledSelected = allEnabledSelected;
		this.#keys = keys;
		this.#state = state;
	}

	get allEnabledSelected() {
		return this.#allEnabledSelected;
	}

	get keys() {
		return this.#keys;
	}

	get state() {
		return this.#state;
	}

	static get states() {
		return {
			none: 'none',
			some: 'some',
			all: 'all',
			allPages: 'all-pages',
			notSet: 'not-set'
		};
	}

	#allEnabledSelected;
	#keys;
	#state;

}

export const SelectionMixin = superclass => class extends CollectionMixin(superclass) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			selectionNoInputArrowKeyBehaviour: { type: Boolean, attribute: 'selection-no-input-arrow-key-behavior' },
			/**
			 * Whether to render with single selection behaviour. If `selection-single` is specified, the nested `d2l-selection-input` elements will render radios instead of checkboxes, and the selection component will maintain a single selected item.
			 * @type {boolean}
			 */
			selectionSingle: { type: Boolean, attribute: 'selection-single' }
		};
	}

	constructor() {
		super();
		this.selectionNoInputArrowKeyBehaviour = false;
		this.selectionSingle = false;
		this._selectAllPages = false;
		this._selectionObservers = new Map();
		this._selectionSelectables = new Map();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectionSingle) this.addEventListener('keydown', this._handleRadioKeyDown);
		if (this.selectionSingle) this.addEventListener('keyup', this._handleRadioKeyUp);
		this.addEventListener('d2l-selection-change', this._handleSelectionChange);
		this.addEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.addEventListener('d2l-selection-input-subscribe', this._handleSelectionInputSubscribe);
		requestAnimationFrame(() => {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-selection-provider-connected', { bubbles: true, composed: true }));
		});

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.selectionSingle) this.removeEventListener('keydown', this._handleRadioKeyDown);
		if (this.selectionSingle) this.removeEventListener('keyup', this._handleRadioKeyUp);
		this.removeEventListener('d2l-selection-change', this._handleSelectionChange);
		this.removeEventListener('d2l-selection-observer-subscribe', this._handleSelectionObserverSubscribe);
		this.removeEventListener('d2l-selection-input-subscribe', this._handleSelectionInputSubscribe);
	}

	getSelectionInfo() {
		let allEnabledSelected = true;
		let state = (this._selectionSelectables.size > 0 ? SelectionInfo.states.none : SelectionInfo.states.notSet);
		const keys = [];

		if (this._selectAllPages) {
			state = SelectionInfo.states.allPages;
		} else {

			this._selectionSelectables.forEach(selectable => {
				if (selectable.selected) keys.push(selectable.key);
				if (!selectable.disabled && !selectable.selected) allEnabledSelected = false;
				if (selectable._indeterminate) state = SelectionInfo.states.some;
			});

			if (keys.length > 0) {
				if (keys.length === this._selectionSelectables.size) state = SelectionInfo.states.all;
				else state = SelectionInfo.states.some;
			}
		}

		return new SelectionInfo(keys, state, allEnabledSelected);
	}

	setSelectionForAll(selected, selectAllPages) {
		if (this.selectionSingle && selected) return;
		this._selectAllPages = (selected && selectAllPages);

		const { allEnabledSelected } = this.getSelectionInfo();

		this._selectionSelectables.forEach(selectable => {
			if (this.selectionSingle || this._selectAllPages) {
				if (selectable.selected !== selected) selectable.selected = selected;
			} else if (!selectable.disabled && selectable.selected !== !allEnabledSelected) {
				selectable.selected = !allEnabledSelected;
			}
		});

		this._updateSelectionObservers();
	}

	subscribeObserver(target) {
		if (this._selectionObservers.has(target)) return;
		this._selectionObservers.set(target, target);
		this._updateSelectionObservers();
	}

	unsubscribeObserver(target) {
		this._selectionObservers.delete(target);
	}

	unsubscribeSelectable(target) {
		this._selectionSelectables.delete(target);
		this._updateSelectionObservers();
	}

	_focusSelectAll() {
		for (const observer of this._selectionObservers.values()) {
			if (observer.tagName === 'D2L-SELECTION-SELECT-ALL') {
				observer.focus();
				break;
			}
		}
	}

	_handleRadioKeyDown(e) {
		// check composed path for radio (e.target could be d2l-list-item or other element due to retargeting)
		if (!e.composedPath()[0].classList.contains('d2l-selection-input-radio')) return;
		if (e.keyCode >= keyCodes.LEFT && e.keyCode <= keyCodes.DOWN) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	_handleRadioKeyUp(e) {

		const target = e.composedPath()[0];

		// check composed path for radio (e.target could be d2l-list-item or other element due to retargeting)
		if (!target.classList.contains('d2l-selection-input-radio') || this.selectionNoInputArrowKeyBehaviour) return;
		if (e.keyCode < keyCodes.LEFT || e.keyCode > keyCodes.DOWN) return;

		const getSelectionInput = (focusable, forward) => {
			while (focusable) {
				if (focusable.classList.contains('d2l-selection-input-radio')) {
					const selectionInput = focusable.getRootNode().host;
					if (!selectionInput.disabled && this._selectionSelectables.has(selectionInput)) return selectionInput;
				}

				if (!isComposedAncestor(this, focusable)) return null;

				focusable = forward ? getNextFocusable(focusable, false, true, true) : getPreviousFocusable(focusable, false, true, true);
			}
		};

		const isRtl = (document.documentElement.getAttribute('dir') === 'rtl');
		const forward = (!isRtl && e.keyCode === keyCodes.RIGHT) || (isRtl && e.keyCode === keyCodes.LEFT) || (e.keyCode === keyCodes.DOWN);

		// first try to find next/previous selection-input relative to the event target within the selection component sub-tree that also belongs to the selection component
		let focusable = forward ? getNextFocusable(target, false, true, true) : getPreviousFocusable(target, false, true, true);
		let selectionInput = getSelectionInput(focusable, forward);

		if (!selectionInput) {
			// no selection-input since next/previous focusable is before/after list... cycle to first/last
			focusable = forward ? getFirstFocusableDescendant(this, false) : getLastFocusableDescendant(this, false);
			selectionInput = getSelectionInput(focusable, forward);
		}

		if (selectionInput) {
			selectionInput.selected = true;
			selectionInput.focus();
		}

	}

	_handleSelectionChange(e) {
		if (!e.detail.selected) this._selectAllPages = false;
		if (this.selectionSingle && e.detail.selected) {
			const target = e.composedPath().find(elem => elem.tagName === 'D2L-SELECTION-INPUT');
			this._selectionSelectables.forEach(selectable => {
				if (selectable.selected && selectable !== target) selectable.selected = false;
			});
		}
		this._updateSelectionObservers();
	}

	_handleSelectionInputSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		if (this._selectionSelectables.has(target)) return;
		this._selectionSelectables.set(target, target);

		if (this.selectionSingle && target.selected) {
			// check invalid usage/state - make sure no others are selected
			this._selectionSelectables.forEach(selectable => {
				if (selectable.selected && selectable !== target) selectable.selected = false;
			});
		}

		this._updateSelectionObservers();
	}

	_handleSelectionObserverSubscribe(e) {
		e.stopPropagation();
		e.detail.provider = this;
		const target = e.composedPath()[0];
		this.subscribeObserver(target);
	}

	_updateSelectionObservers() {
		if (!this._selectionObservers || this._selectionObservers.size === 0) return;

		// debounce the updates for select-all case
		if (this._updateObserversRequested) return;

		this._updateObserversRequested = true;
		setTimeout(() => {
			const info = this.getSelectionInfo(true);
			this._selectionObservers.forEach(observer => observer.selectionInfo = info);
			this._updateObserversRequested = false;
		}, 0);
	}

};

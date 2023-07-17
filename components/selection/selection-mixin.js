import { CollectionMixin } from '../../mixins/collection/collection-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

const keyCodes = {
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	UP: 38
};

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
			all: 'all',
			allPages: 'all-pages'
		};
	}

}

export const SelectionMixin = superclass => class extends RtlMixin(CollectionMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Whether to render with single selection behaviour. If `selection-single` is specified, the nested `d2l-selection-input` elements will render radios instead of checkboxes, and the selection component will maintain a single selected item.
			 * @type {boolean}
			 */
			selectionSingle: { type: Boolean, attribute: 'selection-single' },
			/**
			 * ADVANCED: Temporary optional parameter used to override existing count. Will be removed soon, use with caution.
			 * @type {number}
			 */
			selectionCountOverride: { type: Number, attribute: 'selection-count-override' }
		};
	}

	constructor() {
		super();
		this.selectionSingle = false;
		this._selectAllPages = false;

		this._observerController = new SubscriberRegistryController(this, 'selection-observer', {
			onSubscribe: this._subscribeObserver.bind(this),
			updateSubscribers: this._updateObservers.bind(this)
		});

		this._selectablesController = new SubscriberRegistryController(this, 'selection-input', {
			onSubscribe: this._subscribeSelectable.bind(this),
			onUnsubscribe: this._unsubscribeSelectable.bind(this)
		});
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.selectionSingle) this.addEventListener('keydown', this._handleRadioKeyDown);
		if (this.selectionSingle) this.addEventListener('keyup', this._handleRadioKeyUp);
		this.addEventListener('d2l-selection-change', this._handleSelectionChange);
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
	}

	getSelectionInfo() {
		let state = SelectionInfo.states.none;
		const keys = [];

		if (this._selectAllPages) {
			state = SelectionInfo.states.allPages;
		} else {
			this._selectablesController.subscribers.forEach(selectable => {
				if (selectable.selected) keys.push(selectable.key);
				if (selectable._indeterminate) state = SelectionInfo.states.some;
			});

			if (keys.length > 0) {
				if (keys.length === this._selectablesController.subscribers.size) state = SelectionInfo.states.all;
				else state = SelectionInfo.states.some;
			}
		}

		return new SelectionInfo(keys, state);
	}

	setSelectionForAll(selected, selectAllPages) {
		if (this.selectionSingle && selected) return;

		this._selectAllPages = (selected && selectAllPages);

		this._selectablesController.subscribers.forEach(selectable => {
			if (!selectable.disabled && !!selectable.selected !== selected) {
				selectable.selected = selected;
			}
		});
		this._observerController.updateSubscribers();
	}

	_focusSelectAll() {
		for (const observer of this._observerController.subscribers) {
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
		// check composed path for radio (e.target could be d2l-list-item or other element due to retargeting)
		if (!e.composedPath()[0].classList.contains('d2l-selection-input-radio')) return;
		if (e.keyCode < keyCodes.LEFT || e.keyCode > keyCodes.DOWN) return;

		const selectables = Array.from(this._selectablesController.subscribers.values())
			.filter(item => !item.disabled);
		let currentIndex = selectables.findIndex(selectable => selectable.selected);
		if (currentIndex === -1) currentIndex = 0;
		let newIndex;

		if ((this.dir !== 'rtl' && e.keyCode === keyCodes.RIGHT)
			|| (this.dir === 'rtl' && e.keyCode === keyCodes.LEFT)
			|| e.keyCode === keyCodes.DOWN) {
			if (currentIndex === selectables.length - 1) newIndex = 0;
			else newIndex = currentIndex + 1;
		} else if ((this.dir !== 'rtl' && e.keyCode === keyCodes.LEFT)
			|| (this.dir === 'rtl' && e.keyCode === keyCodes.RIGHT)
			|| e.keyCode === keyCodes.UP) {
			if (currentIndex === 0) newIndex = selectables.length - 1;
			else newIndex = currentIndex - 1;
		}
		selectables[newIndex].selected = true;
		selectables[newIndex].focus();
	}

	_handleSelectionChange(e) {
		if (!e.detail.selected) this._selectAllPages = false;
		if (this.selectionSingle && e.detail.selected) {
			const target = e.composedPath().find(elem => elem.tagName === 'D2L-SELECTION-INPUT');
			this._selectablesController.subscribers.forEach(selectable => {
				if (selectable.selected && selectable !== target) selectable.selected = false;
			});
		}
		this._observerController.updateSubscribers();
	}

	_subscribeObserver(observer) {
		const info = this.getSelectionInfo(true);
		observer.selectionInfo = info;
	}

	_subscribeSelectable(addedSelectable) {
		if (this.selectionSingle && addedSelectable.selected) {
			// check invalid usage/state - make sure no others are selected
			this._selectablesController.subscribers.forEach(selectable => {
				if (selectable.selected && selectable !== addedSelectable) selectable.selected = false;
			});
		}

		this._observerController.updateSubscribers();
	}

	_unsubscribeSelectable() {
		this._observerController.updateSubscribers();
	}

	_updateObservers(observers) {
		const info = this.getSelectionInfo(true);
		observers.forEach(observer => observer.selectionInfo = info);
	}

};


import '../button/button-icon.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { buttonStyles } from '../button/button-styles.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

const keyCodes = Object.freeze({
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESC: 27,
	HOME: 36,
	LEFT: 37,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
});

export const dragActions = Object.freeze({
	active: 'keyboard-active',
	cancel: 'keyboard-deactivate-cancel',
	down: 'down',
	first: 'first',
	last: 'last',
	nextElement: 'next-element',
	previousElement: 'previous-element',
	save: 'keyboard-deactivate-save',
	up: 'up'
});

class ListItemDragHandle extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			text: { type: String },
			_keyboardActive: { type: Boolean },
		};
	}

	static get styles() {
		return [ buttonStyles, css`
			:host {
				align-items: center;
				display: flex;
				margin: 0.25rem;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-item-drag-handle-dragger-button {
				display: block;
			}
			.d2l-list-item-drag-handle-keyboard-button {
				display: grid;
				grid-auto-rows: 1fr 1fr;
			}
			.d2l-list-item-drag-handle-dragger-button,
			.d2l-list-item-drag-handle-keyboard-button {
				margin: 0;
				min-height: 1.8rem;
				padding: 0;
				width: 0.9rem;
			}
			/* Firefox includes a hidden border which messes up button dimensions */
			button::-moz-focus-inner {
				border: 0;
			}
			.d2l-list-item-drag-handle-dragger-button {
				background-color: unset;
			}
			.d2l-button-icon {
				height: 0.9rem;
				width: 0.9rem;
			}
			button,
			button[disabled]:hover,
			button[disabled]:focus {
				background-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			button:hover,
			button:focus {
				background-color: var(--d2l-color-mica);
			}
			button[disabled] {
				cursor: default;
				opacity: 0.5;
			}
		`];
	}

	constructor() {
		super();
		this._keyboardActive = false;
		this.disabled = false;
		this._movingElement = false;
	}

	render() {
		return this._keyboardActive && !this.disabled ? this._renderKeyboardDragging() : this._renderDragger();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_keyboardActive') && typeof changedProperties.get('_keyboardActive') !== 'undefined') this.focus();
	}

	activateKeyboardMode() {
		this._dispatchAction(dragActions.active);
		this._keyboardActive = true;
	}

	focus() {
		const node = getFirstFocusableDescendant(this);
		if (node) node.focus();
	}

	get _defaultLabel() {
		const namespace = 'components.list-item-drag-handle';
		return this.localize(`${namespace}.${this._keyboardActive ? 'keyboard' : 'default'}`);
	}

	_dispatchAction(action) {
		if (!action) return;
		this.dispatchEvent(new CustomEvent('d2l-list-item-drag-handle-action', {
			detail: { action },
			bubbles: false
		}));
	}

	_dispatchActionDown() {
		this._dispatchAction(dragActions.down);
	}

	_dispatchActionUp() {
		this._dispatchAction(dragActions.up);
	}

	async _onActiveKeyboard(e) {
		if (!this._keyboardActive) {
			return;
		}
		let action = null;
		switch (e.keyCode) {
			case keyCodes.UP:
				this._movingElement = true;
				action = dragActions.up;
				break;
			case keyCodes.DOWN:
				this._movingElement = true;
				action = dragActions.down;
				break;
			case keyCodes.HOME:
				this._movingElement = true;
				action = dragActions.first;
				break;
			case keyCodes.END:
				this._movingElement = true;
				action = dragActions.last;
				break;
			case keyCodes.TAB:
				action = e.shiftKey ? dragActions.previousElement : dragActions.nextElement;
				break;
			case keyCodes.ESC:
				action = dragActions.cancel;
				this.updateComplete.then(() => this._keyboardActive = false);
				break;
			case keyCodes.ENTER:
			case keyCodes.SPACE:
			case keyCodes.RIGHT:
				action = dragActions.save;
				this.updateComplete.then(() => this._keyboardActive = false);
				break;
			default:
				return;
		}
		this._dispatchAction(action);
		e.preventDefault();
		e.stopPropagation();
		const cell = findComposedAncestor(this, (parent) =>  parent.hasAttribute && parent.hasAttribute('draggable'));
		if (cell) await cell.updateComplete;
		await this.updateComplete;
		this.focus();
		this._movingElement = false;
	}

	_onFocusOut(e) {
		if (this._movingElement) {
			this._movingElement = false;
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		this._keyboardActive = false;
		this._dispatchAction(dragActions.save);
		e.stopPropagation();
	}

	_onInactiveKeyboard(e) {
		if (e.type === 'click' || e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.LEFT) {
			this._dispatchAction(dragActions.active);
			this._keyboardActive = true;
			e.preventDefault();
		}
	}

	_onInactiveKeyDown(e) {
		if (e.type === 'click' || e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.LEFT) {
			e.preventDefault();
		}
	}

	_onPreventDefault(e) {
		e.preventDefault();
	}

	_renderDragger() {
		return html`
			<button
				class="d2l-list-item-drag-handle-dragger-button"
				@click="${this._onInactiveKeyboard}"
				@keyup="${this._onInactiveKeyboard}"
				@keydown="${this._onInactiveKeyDown}"
				aria-label="${this._defaultLabel}"
				?disabled="${this.disabled}">
				<d2l-icon icon="tier1:dragger" class="d2l-button-icon"></d2l-icon>
			</button>
		`;
	}

	_renderKeyboardDragging() {
		return html`
			<button
				class="d2l-list-item-drag-handle-keyboard-button"
				@focusout="${this._onFocusOut}"
				@keyup="${this._onActiveKeyboard}"
				@keydown="${this._onPreventDefault}"
				aria-label="${this.text || this._defaultLabel}">
				<d2l-icon icon="tier1:arrow-toggle-up" @click="${this._dispatchActionUp}" class="d2l-button-icon"></d2l-icon>
				<d2l-icon icon="tier1:arrow-toggle-down" @click="${this._dispatchActionDown}" class="d2l-button-icon"></d2l-icon>
			</button>
		`;
	}
}

customElements.define('d2l-list-item-drag-handle', ListItemDragHandle);

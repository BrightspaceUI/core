
import '../button/button-icon.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { buttonStyles } from '../button/button-styles.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';

const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	UP: 38,
	DOWN: 40,
	SPACE: 32,
	ENTER: 13,
	ESC: 27,
	TAB: 9,
	LEFT: 37,
	RIGHT: 39,

});

export const dragActions = Object.freeze({
	first: 'last',
	end: 'first',
	up: 'up',
	down: 'down',
	active: 'keyboard-active',
	save: 'keyboard-deactivate-save',
	cancel: 'keyboard-deactivate-cancel',
	nextElement: 'next-element',
	previousElement: 'previous-element'
});

class listItemDragHandle extends LitElement {

	static get properties() {
		return {
			keyboardActive: { type: Boolean, attribute: 'keyboard-active', reflect: true },
			text: { type: String }
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
			.d2l-list-item-drag-handle-dragger-button,
			.d2l-list-item-drag-handle-keyboard-button {
				display: grid;
				grid-auto-columns: auto;
				grid-auto-rows: 1fr 1fr;
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
		this.keyboardActive = false;
	}

	focus() {
		const node = getFirstFocusableDescendant(this);
		if (node) {
			node.focus();
		}
	}

	render() {
		return html`${this.keyboardActive ? this.renderKeyboardDragging() : this.renderDragger()}`;
	}

	renderDragger() {
		return html`
			<button class="d2l-list-item-drag-handle-dragger-button" @click="${this._handleDeactiveKeyboard}" @keydown="${this._handleDeactiveKeyboard}" aria-label="${this.text}">
				<d2l-icon icon="tier1:dragger"></d2l-icon>
			</button>
		`;
	}

	renderKeyboardDragging() {
		return html`
			<button class="d2l-list-item-drag-handle-keyboard-button" @blur="${this._onBlur}" @keydown="${this._handleActiveKeyboard}" aria-label="${this.text}">
				<d2l-icon class="sub-icon" icon="tier1:arrow-toggle-up" @click="${this._dispatchActionUp}"></d2l-icon>
				<d2l-icon class="sub-icon" icon="tier1:arrow-toggle-down" @click="${this._dispatchActionDown}"></d2l-icon>
			</button>
		`;
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

	_onBlur() {
		this.keyboardActive = false;
		if (!this._tabbing) {
			this._dispatchAction(dragActions.save);
		}
	}

	_handleActiveKeyboard(e) {
		if (!this.keyboardActive) {
			return;
		}
		let action = null;
		switch (e.keyCode) {
			case keyCodes.UP:
				action = dragActions.up;
				break;
			case keyCodes.DOWN:
				action = dragActions.down;
				break;
			case keyCodes.HOME:
				action = dragActions.first;
				break;
			case keyCodes.END:
				action = dragActions.last;
				break;
			case keyCodes.TAB:
				action = e.shiftKey ? dragActions.previousElement : dragActions.nextElement;
				break;
			case keyCodes.ESC:
				action = dragActions.cancel;
				this.updateComplete.then(() => this.keyboardActive = false);
				break;
			case keyCodes.ENTER:
			case keyCodes.SPACE:
			case keyCodes.RIGHT:
				action = dragActions.save;
				this.updateComplete.then(() => this.keyboardActive = false);
				break;
			default:
				return;
		}
		this._dispatchAction(action);
		e.preventDefault();
	}

	_handleDeactiveKeyboard(e) {
		if (e.type === 'click' || e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.LEFT) {
			this._dispatchAction(dragActions.active);
			this.keyboardActive = true;
			e.preventDefault();
		}
	}

	updated(changedProperties) {
		if (changedProperties.has('keyboardActive')) {
			this.focus();
		}
	}
}

customElements.define('d2l-list-item-drag-handle', listItemDragHandle);

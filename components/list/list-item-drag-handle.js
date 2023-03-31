import '../button/button-icon.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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
	nest: 'nest',
	nextElement: 'next-element',
	previousElement: 'previous-element',
	rootFirst: 'rootFirst',
	rootLast: 'rootLast',
	save: 'keyboard-deactivate-save',
	unnest: 'unnest',
	up: 'up'
});

let hasDisplayedKeyboardTooltip = false;

/**
 * @fires d2l-list-item-drag-handle-action - Dispatched when an action performed on the drag handle
 */
class ListItemDragHandle extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the handle
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Additional context information for accessibility
			 * @type {object}
			 */
			keyboardTextInfo: { type: Object, attribute: 'keyboard-text-info' },
			/**
			 * The drag-handle label for assistive technology
			 * @type {string}
			 */
			text: { type: String },
			_displayKeyboardTooltip: { type: Boolean },
			_keyboardActive: { type: Boolean }
		};
	}

	static get styles() {
		return [ buttonStyles, css`
			:host {
				display: flex;
				margin: 0.25rem;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-item-drag-handle-dragger-button {
				background-color: unset;
				display: block;
			}
			.d2l-list-item-drag-handle-keyboard-button {
				display: grid;
				gap: 2px;
				grid-auto-rows: 1fr 1fr;
				position: relative;
			}
			.d2l-list-item-drag-handle-keyboard-button-up,
			.d2l-list-item-drag-handle-keyboard-button-down {
				height: 1.1rem;
				position: absolute;
				width: 0.9rem;
			}
			.d2l-list-item-drag-handle-keyboard-button-up {
				top: -0.25rem;
			}
			.d2l-list-item-drag-handle-keyboard-button-down {
				bottom: -0.25rem;
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
			.d2l-button-dragger-icon {
				height: 0.9rem;
				width: 0.9rem;
			}
			.d2l-button-up-icon,
			.d2l-button-down-icon {
				border-radius: 0.1rem;
				height: 0.85rem;
				width: 0.9rem;
			}
			.d2l-button-up-icon {
				border-top-left-radius: 0.3rem;
				border-top-right-radius: 0.3rem;
			}
			.d2l-button-down-icon {
				border-bottom-left-radius: 0.3rem;
				border-bottom-right-radius: 0.3rem;
			}
			button,
			button[disabled]:hover,
			button[disabled]:focus {
				background-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			.d2l-list-item-drag-handle-dragger-button:hover,
			.d2l-list-item-drag-handle-dragger-button:focus {
				background-color: var(--d2l-color-mica);
			}
			.d2l-list-item-drag-handle-keyboard-button:hover,
			.d2l-list-item-drag-handle-keyboard-button:focus {
				background-color: transparent;
			}
			.d2l-list-item-drag-handle-keyboard-button:hover > d2l-icon,
			.d2l-list-item-drag-handle-keyboard-button:focus > d2l-icon {
				background-color: var(--d2l-color-mica);
			}
			button[disabled] {
				cursor: default;
				opacity: 0.5;
			}
			d2l-tooltip > div {
				font-weight: 700;
			}
			d2l-tooltip > ul {
				padding-inline-start: 1rem;
			}
			.d2l-list-item-drag-handle-tooltip-key {
				font-weight: 700;
			}
		`];
	}

	constructor() {
		super();

		this.disabled = false;

		this._buttonId = getUniqueId();
		this._displayKeyboardTooltip = false;
		this._keyboardActive = false;
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
		const defaultLabel = this.localize(`${namespace}.${'default'}`, 'name', this.text);
		const keyboardTextLabel = this.localize(`${namespace}.${'keyboard'}`, 'currentPosition', this.keyboardTextInfo && this.keyboardTextInfo.currentPosition, 'size', this.keyboardTextInfo && this.keyboardTextInfo.count);
		return this._keyboardActive ? keyboardTextLabel : defaultLabel;
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
				this.updateComplete.then(() => this.blur()); // tell screenreaders to refocus
				break;
			case keyCodes.DOWN:
				this._movingElement = true;
				action = dragActions.down;
				break;
			case keyCodes.HOME:
				this._movingElement = true;
				action = (e.ctrlKey ? dragActions.rootFirst : dragActions.first);
				break;
			case keyCodes.END:
				this._movingElement = true;
				action = (e.ctrlKey ? dragActions.rootLast : dragActions.last);
				break;
			case keyCodes.TAB:
				action = e.shiftKey ? dragActions.previousElement : dragActions.nextElement;
				break;
			case keyCodes.ESC:
				action = dragActions.cancel;
				this.updateComplete.then(() => this._keyboardActive = false);
				break;
			case keyCodes.RIGHT:
				this._movingElement = true;
				action = (this.dir === 'rtl' ? dragActions.unnest : dragActions.nest);
				break;
			case keyCodes.LEFT:
				this._movingElement = true;
				action = (this.dir === 'rtl' ? dragActions.nest : dragActions.unnest) ;
				break;
			case keyCodes.ENTER:
			case keyCodes.SPACE:
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

	_onFocusInKeyboardButton() {
		if (hasDisplayedKeyboardTooltip) return;
		this._displayKeyboardTooltip = true;
		hasDisplayedKeyboardTooltip = true;
	}

	_onFocusOutKeyboardButton(e) {
		this._displayKeyboardTooltip = false;
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
		if (e.type === 'click' || e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE) {
			this._dispatchAction(dragActions.active);
			this._keyboardActive = true;
			e.preventDefault();
		}
	}

	_renderDragger() {
		return html`
			<button
				class="d2l-list-item-drag-handle-dragger-button"
				@click="${this._onInactiveKeyboard}"
				@keydown="${this._onInactiveKeyboard}"
				aria-label="${this._defaultLabel}"
				?disabled="${this.disabled}">
				<d2l-icon icon="tier1:dragger" class="d2l-button-dragger-icon"></d2l-icon>
			</button>
		`;
	}

	_renderKeyboardDragging() {
		return html`
			<button
				aria-label="${this._defaultLabel}"
				class="d2l-list-item-drag-handle-keyboard-button"
				@focusin="${this._onFocusInKeyboardButton}"
				@focusout="${this._onFocusOutKeyboardButton}"
				id="${this._buttonId}"
				@keydown="${this._onActiveKeyboard}">
				<d2l-icon icon="tier1:arrow-toggle-up" class="d2l-button-up-icon"></d2l-icon>
				<d2l-icon icon="tier1:arrow-toggle-down" class="d2l-button-down-icon"></d2l-icon>
				<div class="d2l-list-item-drag-handle-keyboard-button-up" @click="${this._dispatchActionUp}"></div>
				<div class="d2l-list-item-drag-handle-keyboard-button-down" @click="${this._dispatchActionDown}"></div>
			</button>
			${this._displayKeyboardTooltip ? html`<d2l-tooltip align="start" for="${this._buttonId}" for-type="descriptor">${this._renderTooltipContent()}</d2l-tooltip>` : ''}
		`;
	}

	_renderTooltipContent() {
		return html`
			<div>${this.localize('components.list-item-drag-handle-tooltip.title')}</div>
			<ul>
				<li><span class="d2l-list-item-drag-handle-tooltip-key">${this.localize('components.list-item-drag-handle-tooltip.enter-key')}</span> - ${this.localize('components.list-item-drag-handle-tooltip.enter-desc')}</li>
				<li><span class="d2l-list-item-drag-handle-tooltip-key">${this.localize('components.list-item-drag-handle-tooltip.up-down-key')}</span> - ${this.localize('components.list-item-drag-handle-tooltip.up-down-desc')}</li>
				<li><span class="d2l-list-item-drag-handle-tooltip-key">${this.localize('components.list-item-drag-handle-tooltip.left-right-key')}</span> - ${this.localize('components.list-item-drag-handle-tooltip.left-right-desc')}</li>
			</ul>
		`;
	}

}

customElements.define('d2l-list-item-drag-handle', ListItemDragHandle);

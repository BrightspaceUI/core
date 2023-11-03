import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { moveActions } from '../button/button-move.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

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
class ListItemDragHandle extends LocalizeCoreElement(FocusMixin(RtlMixin(LitElement))) {

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
				pointer-events: auto; /* required since its parent may set point-events: none; (see generic layout) */
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-item-drag-handle-dragger-button {
				background-color: unset;
				display: block;
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

	static get focusElementSelector() {
		return '.d2l-list-item-drag-handle-button';
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

	async _doAction(action) {
		this._dispatchAction(action);
		const cell = findComposedAncestor(this, (parent) =>  parent.hasAttribute && parent.hasAttribute('draggable'));
		if (cell) await cell.updateComplete;
		await this.updateComplete;
		this.focus();
		this._movingElement = false;
	}

	_onDraggerButtonClick() {
		this.activateKeyboardMode();
	}

	_onDraggerButtonKeydown(e) {
		if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.SPACE) return;
		e.preventDefault();
		this.activateKeyboardMode();
	}

	async _onMoveButtonAction(e) {

		let action = null;
		switch (e.detail.action) {
			case moveActions.up:
				this._movingElement = true;
				action = dragActions.up;
				this.updateComplete.then(() => this.blur()); // tell screenreaders to refocus
				break;
			case moveActions.down:
				this._movingElement = true;
				action = dragActions.down;
				break;
			case moveActions.right:
				this._movingElement = true;
				action = (this.dir === 'rtl' ? dragActions.unnest : dragActions.nest);
				break;
			case moveActions.left:
				this._movingElement = true;
				action = (this.dir === 'rtl' ? dragActions.nest : dragActions.unnest) ;
				break;
			case moveActions.rootHome:
				this._movingElement = true;
				action = dragActions.rootFirst;
				break;
			case moveActions.home:
				this._movingElement = true;
				action = dragActions.first;
				break;
			case moveActions.rootEnd:
				this._movingElement = true;
				action = dragActions.rootLast;
				break;
			case moveActions.end:
				this._movingElement = true;
				action = dragActions.last;
				break;
			default:
				return;
		}

		this._doAction(action);

	}

	_onMoveButtonFocusIn() {
		if (hasDisplayedKeyboardTooltip) return;
		this._displayKeyboardTooltip = true;
		hasDisplayedKeyboardTooltip = true;
	}

	_onMoveButtonFocusOut(e) {
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

	async _onMoveButtonKeydown(e) {
		if (!this._keyboardActive) {
			return;
		}

		let action = null;
		switch (e.keyCode) {
			case keyCodes.TAB:
				action = e.shiftKey ? dragActions.previousElement : dragActions.nextElement;
				break;
			case keyCodes.ESC:
				action = dragActions.cancel;
				this.updateComplete.then(() => this._keyboardActive = false);
				break;
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				action = dragActions.save;
				this.updateComplete.then(() => this._keyboardActive = false);
				break;
			default:
				return;
		}

		e.preventDefault();
		e.stopPropagation();
		this._doAction(action);

	}

	_onMoveButtonMouseDown(e) {
		e.preventDefault();
	}

	_renderDragger() {
		return html`
			<button
				class="d2l-list-item-drag-handle-dragger-button d2l-list-item-drag-handle-button"
				@click="${this._onDraggerButtonClick}"
				@keydown="${this._onDraggerButtonKeydown}"
				aria-label="${this._defaultLabel}"
				?disabled="${this.disabled}">
				<d2l-icon icon="tier1:dragger" class="d2l-button-dragger-icon"></d2l-icon>
			</button>
		`;
	}

	_renderKeyboardDragging() {
		return html`
			<d2l-button-move
				class="d2l-list-item-drag-handle-button"
				@d2l-button-move-action="${this._onMoveButtonAction}"
				@focusin="${this._onMoveButtonFocusIn}"
				@focusout="${this._onMoveButtonFocusOut}"
				id="${this._buttonId}"
				@keydown="${this._onMoveButtonKeydown}"
				@mousedown="${this._onMoveButtonMouseDown}"
				text="${this._defaultLabel}">
			</d2l-button-move>
			${this._displayKeyboardTooltip ? html`<d2l-tooltip class="vdiff-target" align="start" announced for="${this._buttonId}" for-type="descriptor">${this._renderTooltipContent()}</d2l-tooltip>` : ''}
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

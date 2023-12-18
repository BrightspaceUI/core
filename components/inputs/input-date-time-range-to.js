import './input-text.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getOffsetParent } from '../../helpers/dom.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

class InputDateTimeRangeTo extends SkeletonMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Force block (stacked) range display if true
			 * @type {boolean}
			 */
			blockDisplay: { attribute: 'block-display', type: Boolean },
			/**
			 * Display localized "to" between the left and right slot contents
			 * @type {boolean}
			 */
			displayTo: { attribute: 'display-to', type: Boolean },
			/**
			 * Add margin-top for case where there would be a label above the range
			 * @type {boolean}
			 */
			topMargin: { attribute: 'top-margin', type: Boolean },
			_blockDisplay: { attribute: false, type: Boolean }
		};
	}

	static get styles() {
		return [ super.styles, bodySmallStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			:host([top-margin]) {
				margin-top: calc(0.9rem - 7px);
			}

			.d2l-input-date-time-range-to-container {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: -1.2rem;
			}
			.d2l-input-date-time-range-to-container-block.d2l-input-date-time-range-to-container {
				display: block;
			}

			.d2l-input-date-time-range-start-container {
				margin-bottom: 1.2rem;
				margin-right: 1.5rem;
			}
			:host([dir="rtl"]) .d2l-input-date-time-range-start-container {
				margin-left: 1.5rem;
				margin-right: 0;
			}
			:host([display-to]) .d2l-input-date-time-range-start-container {
				margin-bottom: 0.6rem;
			}
			:host([display-to]) div:not(.d2l-input-date-time-range-to-container-block) > .d2l-input-date-time-range-start-container {
				margin-right: 0.9rem;
			}
			:host([display-to][dir="rtl"]) div:not(.d2l-input-date-time-range-to-container-block) > .d2l-input-date-time-range-start-container {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			.d2l-input-date-time-range-to-container-block .d2l-input-date-time-range-start-container,
			:host([dir="rtl"]) .d2l-input-date-time-range-to-container-block .d2l-input-date-time-range-start-container {
				margin-left: 0;
				margin-right: 0;
			}

			:host(:not([display-to])) .d2l-input-date-time-range-to-to {
				display: none;
			}
			.d2l-input-date-time-range-to-to {
				display: inline-block;
				margin-bottom: 0.6rem;
				margin-right: 0.9rem;
				margin-top: auto;
				vertical-align: top;
			}
			:host([dir="rtl"]) .d2l-input-date-time-range-to-to {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			.d2l-input-date-time-range-end-container {
				display: flex;
				margin-bottom: 1.2rem;
			}
			.d2l-input-date-time-range-to-container-block .d2l-input-date-time-range-end-container {
				display: block;
			}
			.d2l-input-date-time-range-end-container ::slotted(*) {
				align-self: flex-end;
			}
		`];
	}

	constructor() {
		super();

		this.blockDisplay = false;
		this.displayTo = false;
		this.topMargin = false;

		this._blockDisplay = false;
		this._leftElemResizeObserver = null;
		this._parentElemResizeObserver = null;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._disconnectObservers();
	}

	render() {
		const containerClassMap = {
			'd2l-input-date-time-range-to-container': true,
			'd2l-input-date-time-range-to-container-block': this._blockDisplay
		};

		return html`
			<div class="${classMap(containerClassMap)}">
				<div class="d2l-input-date-time-range-start-container">
					<slot name="left"></slot>
				</div>
				<div class="d2l-input-date-time-range-end-container">
					<div class="d2l-body-small d2l-skeletize d2l-input-date-time-range-to-to">
						${this.localize('components.input-date-time-range-to.to')}
					</div>
					<slot name="right"></slot>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'blockDisplay') {
				if (this.blockDisplay) {
					this._blockDisplay = true;
					this._disconnectObservers();
				} else {
					this._blockDisplay = false;
					this._startObserving();
				}
			}
		});
	}

	setParentNode(node) {
		this._parentNode = node.parentNode instanceof ShadowRoot ? getOffsetParent(node) : node.parentNode;
	}

	_disconnectObservers() {
		if (this._parentElemResizeObserver) {
			this._parentElemResizeObserver.disconnect();
			this._parentElemResizeObserver = null;
		}
		if (this._leftElemResizeObserver) {
			this._leftElemResizeObserver.disconnect();
			this._leftElemResizeObserver = null;
		}
	}

	_startObserving() {
		if (!this.shadowRoot || !this._parentNode) return;

		const container = this.shadowRoot.querySelector('.d2l-input-date-time-range-to-container');
		const leftElem = this.shadowRoot.querySelector('.d2l-input-date-time-range-start-container');
		let leftElemHeight = 0;

		this._leftElemResizeObserver = this._leftElemResizeObserver || new ResizeObserver(() => {
			leftElemHeight = Math.ceil(parseFloat(getComputedStyle(leftElem).getPropertyValue('height')));
		});
		this._leftElemResizeObserver.disconnect();
		this._leftElemResizeObserver.observe(leftElem);

		this._parentElemResizeObserver = this._parentElemResizeObserver || new ResizeObserver(async() => {
			this._blockDisplay = false;
			await this.updateComplete;
			const height = Math.ceil(parseFloat(getComputedStyle(container).getPropertyValue('height')));
			if (height >= (leftElemHeight * 2)) this._blockDisplay = true; // switch to _blockDisplay styles if content has wrapped (needed for "to" to occupy its own line)
			else this._blockDisplay = false;
		});
		this._parentElemResizeObserver.disconnect();
		this._parentElemResizeObserver.observe(this._parentNode);
	}

}
customElements.define('d2l-input-date-time-range-to', InputDateTimeRangeTo);

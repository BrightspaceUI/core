import '../colors/colors.js';
import '../../helpers/requestIdleCallback.js';
import { css, html, LitElement } from 'lit';
import { getBoundingAncestor, getComposedParent } from '../../helpers/dom.js';
import { getLegacyOffsetParent } from '../../helpers/offsetParent-legacy.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-height: 500px)');

/**
 * A wrapper component to display floating workflow buttons. When the normal position of the workflow buttons is below the bottom edge of the viewport, they will dock at the bottom edge. When the normal position becomes visible, they will undock.
 * @slot - Content to be displayed in the floating container
 */
class FloatingButtons extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Indicates to display buttons as always floating
			 * @type {boolean}
			 */
			alwaysFloat: { type: Boolean, attribute: 'always-float', reflect: true },
			_containerMarginLeft: { attribute: false, type: String },
			_containerMarginRight: { attribute: false, type: String },
			_floating: { type: Boolean, reflect: true },
			_innerContainerLeft: { attribute: false, type: String },
			_innerContainerRight: { attribute: false, type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: block;
			}

			:host([_floating]) {
				bottom: -10px;
				left: 0;
				position: -webkit-sticky;
				position: sticky;
				right: 0;
				z-index: 999;
			}

			:host([_floating][always-float]) {
				bottom: 0;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-floating-buttons-container {
				border-top: 1px solid transparent;
				display: block;
			}

			:host([_floating]) .d2l-floating-buttons-container {
				background-color: #ffffff;
				background-color: rgba(255, 255, 255, 0.88);
				border-top-color: var(--d2l-color-mica);
				box-shadow: 0 -2px 4px rgba(32, 33, 34, 0.2); /* ferrite */
			}

			:host([_floating]:not([always-float])) .d2l-floating-buttons-container {
				transform: translate(0, -10px);
				transition: transform 500ms, border-top-color 500ms, background-color 500ms;
			}

			.d2l-floating-buttons-inner-container {
				padding: 0.75rem 0 0 0;
				position: relative;
			}

			.d2l-floating-buttons-inner-container ::slotted(d2l-button),
			.d2l-floating-buttons-inner-container ::slotted(button),
			.d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-bottom: 0.75rem !important;
				margin-right: 0.75rem !important;
			}

			.d2l-floating-buttons-inner-container ::slotted(d2l-overflow-group) {
				padding-bottom: 0.75rem !important;
			}

			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(button),
			:host([dir="rtl"]) .d2l-floating-buttons-inner-container ::slotted(.d2l-button) {
				margin-left: 0.75rem !important;
				margin-right: 0 !important;
			}

			@media (prefers-reduced-motion: reduce) {
				:host([_floating]:not([always-float])) .d2l-floating-buttons-container {
					transition: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.alwaysFloat = false;
		this._containerMarginLeft = '';
		this._containerMarginRight = '';
		this._floating = false;
		this._innerContainerLeft = '';
		this._innerContainerRight = '';
		this._intersectionObserver = null;
		this._isIntersecting = false;
		this._recalculateFloating = this._recalculateFloating.bind(this);
		this._testElem = null;
	}

	connectedCallback() {
		super.connectedCallback();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._recalculateFloating);

		// if browser doesn't support IntersectionObserver, we don't float
		if (typeof(IntersectionObserver) !== 'function') {
			this._isIntersecting = true;
			return;
		}
		this._intersectionObserver = this._intersectionObserver || new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				this._isIntersecting = entry.isIntersecting;
				this._recalculateFloating();
			});
		});

		// observe intersection of a fake sibling element since host is sticky
		this._testElem = document.createElement('div');
		this._testElem.style.height = '1px';
		this._testElem.style.marginTop = '-1px';

		// defer doing any forced layouts until things calm down
		requestIdleCallback(() => {
			if (this._testElem !== null && this.parentNode) {
				this.parentNode.insertBefore(this._testElem, this.nextSibling);
				this._intersectionObserver.observe(this._testElem);
			}
		}, { timeout: 5000 });

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._recalculateFloating);
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
		if (this._testElem && this._testElem.parentNode) {
			this._testElem.parentNode.removeChild(this._testElem);
			this._testElem = null;
		}
	}

	render() {
		const containerStyle = {
			marginLeft: this._containerMarginLeft,
			marginRight: this._containerMarginRight
		};

		const innerContainerStyle = {
			marginLeft: this._innerContainerLeft,
			marginRight: this._innerContainerRight
		};

		return html`
			<div class="d2l-floating-buttons-container" style=${styleMap(containerStyle)}>
				<div class="d2l-floating-buttons-inner-container" style=${styleMap(innerContainerStyle)}>
					<slot></slot>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('alwaysFloat')) {
			this._recalculateFloating();
		}
	}

	async _calcContainerPosition() {

		this._containerMarginLeft = '';
		this._containerMarginRight = '';
		this._innerContainerLeft = '';
		this._innerContainerRight = '';

		if (!this._floating) return;

		const boundingAncestor = this._getBoundingAncestor();
		if (!boundingAncestor) return;

		const offsetParentBoundingRect = boundingAncestor.getBoundingClientRect();
		const boundingRect = this.getBoundingClientRect();

		const offsetParentLeft = offsetParentBoundingRect.left;
		const left = boundingRect.left;
		const containerLeft = left - offsetParentLeft - 1;
		if (containerLeft !== 0) {
			// only update this if needed - needed for firefox
			this._containerMarginLeft = `-${containerLeft}px`;
		}

		const offsetParentRight = offsetParentBoundingRect.right;
		const right = boundingRect.right;
		const containerRight = offsetParentRight - right - 1;
		if (containerRight !== 0) {
			this._containerMarginRight = `-${containerRight}px`;
		}

		if (this.dir !== 'rtl') {
			if (containerLeft !== 0) {
				this._innerContainerLeft = `${containerLeft}px`;
			}
		} else {
			this._innerContainerRight = `${containerRight}px`;
		}

	}

	_getBoundingAncestor() {

		const boundingAncestor = getBoundingAncestor(this);
		const offsetParent = getLegacyOffsetParent(this);
		if (!offsetParent) {
			return null;
		}

		if (boundingAncestor === document.documentElement) {
			return offsetParent;
		}

		let parent = getComposedParent(this);
		while (parent !== null) {
			if (parent === boundingAncestor) return boundingAncestor;
			if (parent === offsetParent) return offsetParent;
			parent = getComposedParent(parent);
		}

		return offsetParent;

	}

	_recalculateFloating() {
		requestAnimationFrame(() => {

			if (this.alwaysFloat) {
				this._floating = true;
				this._calcContainerPosition();
				return;
			}

			const viewportIsLessThanMinHeight = mediaQueryList.matches;
			if (viewportIsLessThanMinHeight) {
				this._floating = false;
				this._calcContainerPosition();
				return;
			}

			const shouldFloat = !this._isIntersecting;
			if (shouldFloat !== this._floating) {
				this._floating = shouldFloat;
				this._calcContainerPosition();
			}

		});
	}

}

customElements.define('d2l-floating-buttons', FloatingButtons);

import '../colors/colors.js';
import '../../helpers/requestIdleCallback.js';
import { css, html, LitElement } from 'lit';
import { getBoundingAncestor, getComposedParent, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getLegacyOffsetParent } from '../../helpers/offsetParent-legacy.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-height: 500px)');
const MINIMUM_TARGET_SIZE = 24;

/**
 * A wrapper component to display floating workflow buttons. When the normal position of the workflow buttons is below the bottom edge of the viewport, they will dock at the bottom edge. When the normal position becomes visible, they will undock.
 * @slot - Content to be displayed in the floating container
 */
class FloatingButtons extends LoadingCompleteMixin(LitElement) {

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
			_innerContainerLeft: { attribute: false, type: String }
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
				z-index: 997;
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
				margin-inline-end: 0.75rem !important;
				margin-bottom: 0.75rem !important;
			}

			.d2l-floating-buttons-inner-container ::slotted(d2l-overflow-group) {
				padding-bottom: 0.75rem !important;
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
		this._intersectionObserver = null;
		this._isIntersecting = false;
		this._recalculateFloating = this._recalculateFloating.bind(this);
		this._testElem = null;
		this._scrollIfFloatObsuringFocus = this._scrollIfFloatObsuringFocus.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._recalculateFloating);

		// if browser doesn't support IntersectionObserver, we don't float
		if (typeof(IntersectionObserver) !== 'function') {
			this._isIntersecting = true;
			this.resolveLoadingComplete();
			return;
		}
		this._intersectionObserver = this._intersectionObserver || new IntersectionObserver(async(entries) => {
			for (const entry of entries) {
				this._isIntersecting = entry.isIntersecting;
				await this._recalculateFloating();
			}
			this.resolveLoadingComplete();
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

		document.addEventListener('focusin', this._scrollIfFloatObsuringFocus);

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._recalculateFloating);
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
		if (this._testElem && this._testElem.parentNode) {
			this._testElem.parentNode.removeChild(this._testElem);
			this._testElem = null;
		}
		document.removeEventListener('focusin', this._scrollIfFloatObsuringFocus);
	}

	render() {
		const containerStyle = {
			marginInlineStart: this._containerMarginLeft,
			marginInlineEnd: this._containerMarginRight
		};

		const innerContainerStyle = {
			marginInlineStart: this._innerContainerLeft
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

		if (containerLeft !== 0) {
			this._innerContainerLeft = `${containerLeft}px`;
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

	async _recalculateFloating() {
		await new Promise(resolve => requestAnimationFrame(resolve));

		if (this.alwaysFloat) {
			this._floating = true;
			this._calcContainerPosition();
			await this.updateComplete;
			return;
		}

		const viewportIsLessThanMinHeight = mediaQueryList.matches;
		if (viewportIsLessThanMinHeight) {
			this._floating = false;
			this._calcContainerPosition();
			await this.updateComplete;
			return;
		}

		const shouldFloat = !this._isIntersecting;
		if (shouldFloat !== this._floating) {
			this._floating = shouldFloat;
			this._calcContainerPosition();
			await this.updateComplete;
		}
	}

	_scrollIfFloatObsuringFocus() {

		if (!this._floating) return;

		const currentFocusedItem = getComposedActiveElement();
		if (isComposedAncestor(this, currentFocusedItem)) return;

		const { y: focusedY, height: focusedHeight } = currentFocusedItem.getBoundingClientRect();
		const { y: floatingY, height: floatingHeight } = this.shadowRoot.querySelector('.d2l-floating-buttons-container').getBoundingClientRect();
		if (focusedY === 0 || floatingY === 0) return;

		const isObscuring = (floatingY - focusedY) < Math.min(MINIMUM_TARGET_SIZE, focusedHeight);
		if (!isObscuring) return;

		const prev = currentFocusedItem.style.scrollMarginBottom;
		currentFocusedItem.style.scrollMarginBottom = `${floatingHeight}px`;
		currentFocusedItem.scrollIntoView(false);
		currentFocusedItem.style.scrollMarginBottom = prev;

	}

}

customElements.define('d2l-floating-buttons', FloatingButtons);

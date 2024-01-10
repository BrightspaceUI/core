import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { css } from 'lit';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const visibleOnAncestorStyles = css`

	:host([__voa-state="hidden"]),
	:host([__voa-state="hiding"]) {
		opacity: 0 !important;
		transform: translateY(-10px) !important;
	}
	:host([__voa-state="showing"]),
	:host([__voa-state="hiding"]) {
		transition: transform 200ms ease-out, opacity 200ms ease-out !important;
	}

	:host([__voa-state="hidden"][animation-type="opacity"]),
	:host([__voa-state="hiding"][animation-type="opacity"]) {
		transform: none !important;
	}
	:host([__voa-state="showing"][animation-type="opacity"]) {
		transition: opacity 200ms ease-in !important;
	}
	:host([__voa-state="hiding"][animation-type="opacity"]) {
		transition: none !important;
	}

	@media only screen and (hover: none), only screen and (-moz-touch-enabled: 1) {
		:host([__voa-state="hidden"]),
		:host([__voa-state="hiding"]) {
			opacity: 1 !important;
			transform: translateY(0) !important;
		}
		:host([__voa-state="hidden"][d2l-visible-on-ancestor-no-hover-hide]),
		:host([__voa-state="hiding"][d2l-visible-on-ancestor-no-hover-hide]) {
			opacity: 0 !important;
			transform: translateY(-10px) !important;
		}
	}

`;

export const VisibleOnAncestorMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			animationType: { type: String, reflect: true, attribute: 'animation-type' },
			/**
			 * @ignore
			 */
			visibleOnAncestor: { type: Boolean, reflect: true, attribute: 'visible-on-ancestor' },
			__voaState: { type: String, reflect: true, attribute: '__voa-state' }
		};
	}

	constructor() {
		super();

		this.animationType = 'opacity-transform';
		this.visibleOnAncestor = false;
	}

	attributeChangedCallback(name, oldval, newval) {
		if (name === 'visible-on-ancestor' && this.__voaAttached) {
			if (newval) this.__voaInit();
			else this.__voaUninit();
		}
		super.attributeChangedCallback(name, oldval, newval);
	}

	connectedCallback() {
		super.connectedCallback();
		this.__voaAttached = true;
		if (this.visibleOnAncestor) {
			requestAnimationFrame(() => this.__voaInit());
		} else this.__voaState = null;
	}

	disconnectedCallback() {
		this.__voaAttached = false;
		this.__voaUninit();
		super.disconnectedCallback();
	}

	__voaHandleBlur(e) {
		if (isComposedAncestor(this.__voaTarget, e.relatedTarget)) return;
		this.__voaFocusIn = false;
		this.__voaHide();
	}

	__voaHandleFocus() {
		this.__voaFocusIn = true;
		this.__voaShow();
	}

	__voaHandleMouseEnter() {
		this.__voaMouseOver = true;
		this.__voaShow();
	}

	__voaHandleMouseLeave() {
		this.__voaMouseOver = false;
		this.__voaHide();
	}

	__voaHide() {
		if (this.__voaFocusIn || this.__voaMouseOver) return;
		if (reduceMotion) {
			this.__voaState = 'hidden';
		} else {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'transform') return;
				this.removeEventListener('transitionend', handleTransitionEnd);
				this.__voaState = 'hidden';
			};
			this.addEventListener('transitionend', handleTransitionEnd);
			this.__voaState = 'hiding';
		}
	}

	__voaInit() {

		if (!this.visibleOnAncestor) return;

		this.__voaTarget = findComposedAncestor(this, (node) => {
			if (!node || node.nodeType !== 1) return false;
			return (node.classList.contains('d2l-visible-on-ancestor-target'));
		});
		if (!this.__voaTarget) {
			this.__voaState = null;
			return;
		}

		this.__voaHandleBlur = this.__voaHandleBlur.bind(this);
		this.__voaHandleFocus = this.__voaHandleFocus.bind(this);
		this.__voaHandleMouseEnter = this.__voaHandleMouseEnter.bind(this);
		this.__voaHandleMouseLeave = this.__voaHandleMouseLeave.bind(this);

		this.__voaTarget.addEventListener('focus', this.__voaHandleFocus, true);
		this.__voaTarget.addEventListener('blur', this.__voaHandleBlur, true);
		this.__voaTarget.addEventListener('mouseenter', this.__voaHandleMouseEnter);
		this.__voaTarget.addEventListener('mouseleave', this.__voaHandleMouseLeave);

		this.__voaState = 'hidden';

	}

	__voaShow() {
		if (reduceMotion && this.animationType !== 'opacity') {
			this.__voaState = 'shown';
		} else {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
				this.removeEventListener('transitionend', handleTransitionEnd);
				this.__voaState = 'shown';
			};
			this.addEventListener('transitionend', handleTransitionEnd);
			this.__voaState = 'showing';
		}
	}

	__voaUninit() {
		this.__voaState = null;
		if (!this.__voaTarget) return;
		this.__voaTarget.removeEventListener('focus', this.__voaHandleFocus, true);
		this.__voaTarget.removeEventListener('blur', this.__voaHandleBlur, true);
		this.__voaTarget.removeEventListener('mouseenter', this.__voaHandleMouseEnter);
		this.__voaTarget.removeEventListener('mouseleave', this.__voaHandleMouseLeave);
		this.__voaTarget = null;
	}

};

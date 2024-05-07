import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { cssEscape, getComposedChildren, getComposedParent, isVisible } from '../../helpers/dom.js';

const BACKDROP_HIDDEN = 'data-d2l-backdrop-hidden';
const BACKDROP_ARIA_HIDDEN = 'data-d2l-backdrop-aria-hidden';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const modals = new Set();
let scrollOverflow = null;

/**
 * A component for displaying a semi-transparent backdrop behind a specified sibling element. It also hides elements other than the target from assistive technologies by applying 'role="presentation"' and 'aria-hidden="true"'.
 */
class Backdrop extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: id of the target element to display backdrop behind
			 * @type {string}
			 */
			forTarget: { type: String, attribute: 'for-target' },

			/**
			 * Disables the fade-out transition while the backdrop is being hidden
			 * @type {boolean}
			 */
			noAnimateHide: { type: Boolean, attribute: 'no-animate-hide' },

			/**
			 * Used to control whether the backdrop is shown
			 * @type {boolean}
			 */
			shown: { type: Boolean },
			_state: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ css`
			:host {
				background-color: var(--d2l-color-regolith);
				height: 0;
				left: 0;
				opacity: 0;
				position: fixed;
				top: 0;
				transition: opacity 200ms ease-in;
				width: 0;
				z-index: 999;
			}
			:host([slow-transition]) {
				transition: opacity 1200ms ease-in;
			}
			:host([_state="showing"]) {
				opacity: 0.7;
			}
			:host([_state="showing"]),
			:host([_state="hiding"]) {
				height: 100%;
				width: 100%;
			}
			:host([_state=null][no-animate-hide]) {
				transition: none;
			}
			@media (prefers-reduced-motion: reduce) {
				:host,
				:host([slow-transition]) {
					transition: none;
				}
			}
		`];
	}

	constructor() {
		super();
		this.shown = false;
		this.noAnimateHide = false;
		this._state = null;
	}

	disconnectedCallback() {
		// allow body scrolling, show hidden elements, if backdrop is removed from the DOM
		allowBodyScroll(this);
		if (this._hiddenElements) {
			showAccessible(this._hiddenElements);
			this._hiddenElements = null;
		}
		this._state = null;
		super.disconnectedCallback();
	}

	render() {
		return html`<div></div>`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (!changedProperties.has('shown')) return;

		if (this.shown) {

			if (this._state === null) {
				preventBodyScroll(this);
				this._hiddenElements = hideAccessible(this.parentNode.querySelector(`#${cssEscape(this.forTarget)}`));
			}
			this._state = 'showing';

		} else if (this._state === 'showing') {

			const hide = () => {
				if (!this.shown) {
					allowBodyScroll(this);
					showAccessible(this._hiddenElements);
					this._hiddenElements = null;
					this._state = null;
				}
			};

			if (!reduceMotion && !this.noAnimateHide && isVisible(this)) {
				this.addEventListener('transitionend', hide, { once: true });
				this._state = 'hiding';
			} else {
				hide();
			}

		}

	}
}

export function allowBodyScroll(modal) {
	if (!modals.has(modal)) return;
	modals.delete(modal);
	if (!modals.size) {
		document.body.style.overflow = scrollOverflow;
		scrollOverflow = null;
	}
}

export function preventBodyScroll(modal) {
	if (!modals.size) {
		scrollOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}
	modals.add(modal);
}

function hideAccessible(target) {

	const hiddenElements = [];
	const path = [target];

	const hideAccessibleChildren = function(parent) {
		const children = getComposedChildren(parent);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];

			if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
			if (path.indexOf(child) !== -1) continue;
			if (child.hasAttribute(BACKDROP_HIDDEN)) continue;

			if (child.hasAttribute('aria-hidden')) {
				child.setAttribute(BACKDROP_ARIA_HIDDEN, child.getAttribute('aria-hidden'));
			}
			child.setAttribute('aria-hidden', 'true');

			child.setAttribute(BACKDROP_HIDDEN, BACKDROP_HIDDEN);
			hiddenElements.push(child);
		}
	};

	let parent = getComposedParent(target);
	while (parent !== document.documentElement && parent !== null) {
		if (parent.nodeType === Node.ELEMENT_NODE) {
			path.push(parent);
			hideAccessibleChildren(parent);
		}
		parent = getComposedParent(parent);
	}

	return hiddenElements;
}

function showAccessible(elems) {
	for (let i = 0; i < elems.length; i++) {
		const elem = elems[i];
		if (elem.hasAttribute(BACKDROP_ARIA_HIDDEN)) {
			elem.setAttribute('aria-hidden', elem.getAttribute(BACKDROP_ARIA_HIDDEN));
			elem.removeAttribute(BACKDROP_ARIA_HIDDEN);
		} else {
			elem.removeAttribute('aria-hidden');
		}
		elem.removeAttribute(BACKDROP_HIDDEN);
	}
}

customElements.define('d2l-backdrop', Backdrop);

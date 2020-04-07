import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren, getComposedParent } from '../../helpers/dom.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

const scrollKeys = [];
let scrollOverflow = null;

class Backdrop extends LitElement {

	static get properties() {
		return {
			shown: { type: Boolean },
			forTarget: { type: String, attribute: 'for-target' },
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
			:host([_state="showing"]), :host([_state="hiding"]) {
				height: 100%;
				width: 100%;
			}
			:host([_state="showing"]) {
				opacity: 0.7;
			}
		`];
	}

	constructor() {
		super();
		this.shown = false;
		this._state = null;
	}

	attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback(name, oldval, newval);

		if (name !== 'shown') return;

		if (this.shown) this._show();
		else this._hide(true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.shown) {
			this._hide(false);
		}
	}

	render() {
		return html`<div></div>`;
	}

	_hide(animate) {

		const hide = () => {
			if (animate) this.removeEventListener('transitionend', hide);

			allowBodyScroll(this._bodyScrollKey);
			this._bodyScrollKey = null;

			showAccessible(this._hiddenElements);
			this._hiddenElements = null;
			this._state = null;
		};

		if (animate && this.offsetParent) {
			this.addEventListener('transitionend', hide);
			this._state = 'hiding';
		} else {
			hide();
		}

	}

	_show() {

		this._bodyScrollKey = preventBodyScroll();
		this._hiddenElements = hideAccessible(this.parentNode.querySelector(`#${this.forTarget}`));
		this._state = 'showing';

	}

}

export function allowBodyScroll(key) {
	const index = scrollKeys.indexOf(key);
	if (index === -1) return;
	scrollKeys.splice(index, 1);
	if (scrollKeys.length === 0) {
		document.body.style.overflow = scrollOverflow;
		scrollOverflow = null;
	}
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
			if (child.hasAttribute('d2l-backdrop-hidden')) continue;

			const role = child.getAttribute('role');
			if (role) child.setAttribute('d2l-backdrop-role', role);
			child.setAttribute('role', 'presentation');

			if (child.nodeName === 'FORM' || child.nodeName === 'A') {
				const ariaHidden = child.getAttribute('aria-hidden');
				if (ariaHidden) child.setAttribute('d2l-backdrop-aria-hidden', ariaHidden);
				child.setAttribute('aria-hidden', 'true');
			}

			child.setAttribute('d2l-backdrop-hidden', 'd2l-backdrop-hidden');
			hiddenElements.push(child);

			hideAccessibleChildren(child);
		}
	};

	let parent = getComposedParent(target);
	while (parent !== document.documentElement) {
		if (parent.nodeType === Node.ELEMENT_NODE) {
			path.push(parent);
			hideAccessibleChildren(parent);
		}
		parent = getComposedParent(parent);
	}

	return hiddenElements;
}

export function preventBodyScroll() {
	if (scrollKeys.length === 0) {
		scrollOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}
	const key = getUniqueId();
	scrollKeys.push(key);
	return key;
}

function showAccessible(elems) {
	for (let i = 0; i < elems.length; i++) {
		const elem = elems[i];
		const role = elem.getAttribute('d2l-backdrop-role');
		if (role) {
			elem.setAttribute('role', role);
			elem.removeAttribute('d2l-backdrop-role');
		} else {
			elem.removeAttribute('role');
		}
		const ariaHidden = elem.getAttribute('d2l-backdrop-aria-hidden');
		if (ariaHidden) {
			elem.setAttribute('aria-hidden', ariaHidden);
			elem.removeAttribute('d2l-backdrop-aria-hidden');
		} else {
			elem.removeAttribute('aria-hidden');
		}
		elem.removeAttribute('d2l-backdrop-hidden');
	}
}

customElements.define('d2l-backdrop', Backdrop);

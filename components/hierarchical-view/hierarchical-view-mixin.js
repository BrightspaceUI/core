import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { css } from 'lit-element/lit-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

const __nativeFocus = document.createElement('div').focus;
const escapeKeyCode = 27;

export const HierarchicalViewMixin = superclass => class extends superclass {

	static get properties() {
		return {
			shown: { type: Boolean, reflect: true },
			childView: { type: Boolean, reflect: true, attribute: 'child-view' },
			hierarchicalView: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: none;
				position: relative;
				left: 0;
				overflow: hidden;
				width: 100%;
				--d2l-hierarchical-view-height-transition: height 300ms linear;
				-webkit-transition: var(--d2l-hierarchical-view-height-transition);
				transition: var(--d2l-hierarchical-view-height-transition);
			}
			:host([child-view]) {
				display: none;
				position: absolute;
				top: 0;
				left: 100%;
			}
			:host([shown]) {
				display: inline-block;
			}
			.d2l-hierarchical-view-content.d2l-child-view-show {
				-webkit-animation: show-child-view-animation forwards 300ms linear;
				animation: show-child-view-animation 300ms forwards linear;
			}
			.d2l-hierarchical-view-content.d2l-child-view-hide {
				-webkit-animation: hide-child-view-animation forwards 300ms linear;
				animation: hide-child-view-animation 300ms forwards linear;
			}
			@keyframes show-child-view-animation {
				0% { transform: translate(0,0); }
				100% { transform: translate(-100%,0); }
			}
			@-webkit-keyframes show-child-view-animation {
				0% { -webkit-transform: translate(0,0); }
				100% { -webkit-transform: translate(-100%,0); }
			}
			@keyframes hide-child-view-animation {
				0% { transform: translate(-100%,0); }
				100% { transform: translate(0,0); }
			}
			@-webkit-keyframes hide-child-view-animation {
				0% { -webkit-transform: translate(-100%,0); }
				100% { -webkit-transform: translate(0,0); }
			}
		`;
	}

	constructor() {
		super();

		this.hierarchicalView = true;
		this.__focusPrevious = false;
		this.__resizeObserver = null;
	}

	connectedCallback() {
		super.connectedCallback();

		this.__isChildView();

		/* On Edge, the children are upgraded before the ancestors, so it's not possible
			to reliably check for ancestor hierarchical view here. For Edge, we rely on the
			mutation observer below. */
		if (!this.childView) {
			this.__startMutationObserver();
		}

		requestAnimationFrame(() => {
			this.__autoSize(this);
			this.__startResizeObserver();

			if (!this.childView) {
				this.addEventListener('focus', this.__focusCapture, true);
				this.addEventListener('focusout', this.__focusOutCapture, true);
				this.__onWindowResize = this.__onWindowResize.bind(this);
				window.addEventListener('resize', this.__onWindowResize);
			}
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.__removeEventListeners();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('keyup', this.__onKeyUp);
		this.addEventListener('d2l-hierarchical-view-hide-start', this.__onHideStart);
		this.addEventListener('d2l-hierarchical-view-show-start', this.__onShowStart);
		this.addEventListener('d2l-hierarchical-view-resize', this.__onViewResize);
	}

	getActiveView() {
		const rootView = this.getRootView();
		const childViews = rootView.querySelectorAll('[child-view][shown]');
		if (!childViews || childViews.length === 0) {
			return rootView;
		}
		for (let i = 0; i < childViews.length; i++) {
			const childView = childViews[i];
			if (childView.isActive()) {
				return childView;
			}
		}
		return rootView;
	}

	getRootView() {
		if (!this.childView) {
			return this;
		}
		const rootView = findComposedAncestor(
			this.parentNode,
			(node) => {
				return node.hierarchicalView && !node.childView;
			}
		);
		return rootView;
	}

	hide(data, sourceView) {
		if (!sourceView) {
			sourceView = this;
		}
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: {
				data: data,
				isSource: sourceView === this,
				sourceView: sourceView
			}
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-hide-start', eventDetails));
	}

	isActive() {
		if (this.childView && !this.shown) {
			return false;
		} else {
			const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');
			return !content.classList.contains('d2l-child-view-show');
		}
	}

	resize() {
		this.__dispatchViewResize();
	}

	show(data, sourceView) {
		const _show = (data, view) => {
			view.shown = true;
			const eventDetails = {
				bubbles: true,
				composed: true,
				detail: {
					isSource: sourceView === this,
					data: data,
					sourceView: sourceView
				}
			};
			view.dispatchEvent(new CustomEvent('d2l-hierarchical-view-show-start', eventDetails));
		};

		const _hideChildViews = (data, view) => {
			const childViews = view.querySelectorAll('[child-view][shown]');
			for (let i = 0; i < childViews.length; i++) {
				childViews[i].hide(data);
			}
			this.resize();
		};

		if (sourceView) {
			_show(data, this);
			return;
		}

		sourceView = this;
		const activeView = this.getActiveView();

		if (isComposedAncestor(activeView, this)) {
			_show(data, this);
			return;
		}

		if (isComposedAncestor(this, activeView)) {
			_hideChildViews(data, this);
			return;
		}

		_hideChildViews(data, this.getRootView());
		_show(data, this);

	}

	__autoSize(view) {
		if (this.childView || view.offsetParent === null) return;

		let rect;
		if (view === this) {
			rect = this.shadowRoot.querySelector('.d2l-hierarchical-view-content').getBoundingClientRect();
		} else {
			rect = view.getBoundingClientRect();
		}
		this.style.height = `${rect.height}px`;

	}

	__dispatchHideComplete(data) {
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { activeView: this.getActiveView(), data: data }
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-hide-complete', eventDetails));
	}

	__dispatchShowComplete(data) {
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { activeView: this.getActiveView(), data: data }
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-show-complete', eventDetails));
	}

	__dispatchViewResize() {
		if (!this.isActive()) {
			const view = this.getActiveView();
			view.resize();
			return;
		}
		const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');
		const contentRect = content.getBoundingClientRect();
		if (contentRect.height < 1) return;
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: contentRect
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-resize', eventDetails));
	}

	__focusCapture(e) {
		const parentView = this.__getParentViewFromEvent(e);

		if (parentView.isActive()) return;

		const relatedTarget = e.relatedTarget;
		let focusableElement;

		const getNextFocusableLocal = () => {
			const activeView = this.getActiveView();
			if (__nativeFocus === activeView.focus) {
				return getNextFocusable(activeView);
			} else {
				return activeView;
			}
		};

		if (relatedTarget) {
			if (!isComposedAncestor(this, relatedTarget)) {
				focusableElement = getNextFocusableLocal();
			} else {
				focusableElement = getPreviousFocusable(this);
			}
		} else {

			// handle focus for ie
			if (this.__focusPrevious) {
				this.__focusPrevious = false;
				focusableElement = getPreviousFocusable(this);
			} else {
				focusableElement = getNextFocusableLocal();
			}

		}

		if (focusableElement) {
			focusableElement.focus();
		}

	}

	__focusOutCapture(e) {
		// focus tracking required since ie only supports relatedTarget on focusin/focusout
		const relatedTarget = e.relatedTarget;
		const activeView = this.getActiveView();
		this.__focusPrevious = false;
		if (isComposedAncestor(activeView, e.target)) {
			if (isComposedAncestor(this, relatedTarget)) {
				this.__focusPrevious = true;
			}
		}

	}

	__getParentViewFromEvent(e) {
		const path = e.composedPath();
		for (let i = 1; i < path.length; i++) {
			if (path[i].hierarchicalView) {
				return path[i];
			}
		}
	}

	__isChildView() {
		const parentView = findComposedAncestor(
			this.parentNode,
			(node) => { return node.hierarchicalView; }
		);

		if (parentView) {
			this.childView = true;
		}
	}

	__onHideStart(e) {
		const rootTarget = e.composedPath()[0];
		if (rootTarget === this || !rootTarget.hierarchicalView) return;

		const parentView = this.__getParentViewFromEvent(e);
		if (parentView === this) {
			const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');

			const data = e.detail.data;
			const animationEnd = (e) => {
				content.removeEventListener('animationend', animationEnd);
				e.composedPath()[0].classList.remove('d2l-child-view-hide');
				rootTarget.shown = false;
				rootTarget.__dispatchHideComplete(data);
			};
			content.addEventListener('animationend', animationEnd);

			content.classList.add('d2l-child-view-hide');
			content.classList.remove('d2l-child-view-show');

			const eventDetails = {
				bubbles: true,
				composed: true,
				detail: content.getBoundingClientRect()
			};
			this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-resize', eventDetails));
		}

	}

	__onKeyUp(e) {
		if (this.childView && e.keyCode === escapeKeyCode) {
			e.stopPropagation();
			this.hide();
			return;
		}
	}

	__onParentMutation() {
		this.__isChildView();

		if (this.childView) {
			this.__removeEventListeners();
			this.__mutationObserver.disconnect();
		}
	}

	__onShowStart(e) {
		const rootTarget = e.composedPath()[0];
		if (rootTarget === this || !rootTarget.hierarchicalView) return;

		if (this.childView && !this.shown) {
			/* deep link scenario */
			this.show(e.detail.data, e.detail.sourceView);
		}
		const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');

		if (e.detail.isSource && this.__getParentViewFromEvent(e) === this) {
			const animationEnd = () => {
				content.removeEventListener('animationend', animationEnd);
				e.detail.sourceView.__dispatchShowComplete(e.detail.data, e.detail);
			};
			content.addEventListener('animationend', animationEnd);
		}

		content.classList.add('d2l-child-view-show');

		if (e.detail.isSource && this.__getParentViewFromEvent(e) === this) {
			e.detail.sourceView.__dispatchViewResize();
		}

	}

	__onViewResize(e) {
		this.style.height = `${e.detail.height}px`;
	}

	__onWindowResize() {
		const view = this.getActiveView();
		if (view) {
			view.__dispatchViewResize();
		}
	}

	__removeEventListeners() {
		this.removeEventListener('focus', this.__focusCapture);
		this.removeEventListener('focusout', this.__focusOutCapture);
		window.removeEventListener('resize', this.__onWindowResize);
	}

	/* Edge only - since children are upgraded before ancestors */
	__startMutationObserver() {
		this.__bound_onParentMutation = this.__bound_onParentMutation || this.__onParentMutation.bind(this);

		this.__mutationObserver = this.__mutationObserver || new MutationObserver(this.__bound_onParentMutation);
		this.__mutationObserver.disconnect();

		// mutation is triggered when parent (e.g., d2l-menu-item) sets an attribute (e.g., aria-haspopup)
		this.__mutationObserver.observe(this.parentNode, {
			attributes: true
		});
	}

	__startResizeObserver() {
		const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');
		this.__bound_dispatchViewResize = this.__bound_dispatchViewResize || this.__dispatchViewResize.bind(this);
		this.__resizeObserver = this.__resizeObserver || new ResizeObserver(this.__bound_dispatchViewResize);
		this.__resizeObserver.disconnect();
		this.__resizeObserver.observe(content);
	}
};

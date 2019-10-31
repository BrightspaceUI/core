import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export const HierarchicalViewMixin = superclass => class extends superclass {

	static get properties() {
		return {
			shown: { type: Boolean, reflect: true },
			childView: { type: Boolean, reflect: true, attribute: 'child-view' },
			isAttached: { type: Boolean, reflect: true, attribute: 'is-attached' },
			isHierarchicalView: { type: Boolean, reflect: true, attribute: 'is-hierarchical-view' }
		};
	}

	constructor() {
		super();
		this.__keyCodes = {
			ESCAPE: 27
		};
		this.__nativeFocus = null;
		this.__content = null;
		this.__focusPrevious = false;
		this.__resizeObserver = null;
		this.isHierarchicalView = true;
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('keyup', this.__onKeyUp);
		this.addEventListener('d2l-hierarchical-view-hide-start', this.__onHideStart);
		this.addEventListener('d2l-hierarchical-view-show-start', this.__onShowStart);
		this.addEventListener('d2l-hierarchical-view-resize', this.__onViewResize);
		this.__nativeFocus = document.createElement('div').focus;
		this.__focusCapture = this.__focusCapture.bind(this);
		this.__focusOutCapture = this.__focusOutCapture.bind(this);
		this.__onWindowResize = this.__onWindowResize.bind(this);

		this._getParentChildInfo();
	}

	connectedCallback() {
		super.connectedCallback();

		requestAnimationFrame(() => {
			this.__autoSize(this);
		});
	}

	_getParentChildInfo() {
		const parentView = findComposedAncestor(
			this.parentNode,
			(node) => { return node.isHierarchicalView; }
		);

		if (parentView) {
			this.childView = true;
		}

		// this.observeNodes(this.__observeNodes); // does not work

		if (!this.childView) {
			this.addEventListener('focus', this.__focusCapture, true);
			this.addEventListener('focusout', this.__focusOutCapture, true);
			window.addEventListener('resize', this.__onWindowResize);
		}
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
	}

	getRootView() {
		if (!this.childView) {
			return this;
		}
		const rootView = findComposedAncestor(
			this.parentNode,
			(node) => {
				return node.isHierarchicalView && !node.childView;
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

	/**
	 * Determines whether the view is active.
	 * @return {Boolean}
	 */
	isActive() {
		const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');
		if (this.childView && !this.shown) {
			return false;
		} else {
			return !content.classList.contains('d2l-child-view-show');
		}
	}

	/**
	 * Forces resize/layout of the view.
	 * @return {Boolean}
	 */
	resize() {
		this.__fireViewResize();
	}

	/**
	 * Shows the view (hiding its parent view). To show, simply call show(); on the view.
	 */
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
		if (this.childView) {
			return;
		}
		if (view.offsetParent === null) {
			return;
		}
		let rect;
		if (view === this) {
			rect = this.shadowRoot.querySelector('.d2l-hierarchical-view-content').getBoundingClientRect();
		} else {
			rect = view.getBoundingClientRect();
		}
		this.style.height = `${rect.height}px`;

	}

	__fireShowComplete(data) {
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { data: data }
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-show-complete', eventDetails));
	}

	__fireHideComplete(data) {
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { activeView: this.getActiveView(), data: data }
		};
		this.dispatchEvent(new CustomEvent('d2l-hierarchical-view-hide-complete', eventDetails));
	}

	__fireViewResize() {
		if (!this.isActive()) {
			const view = this.getActiveView();
			view.resize();
			return;
		}
		this.__content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');
		this.__bound_reactToChanges = this.__bound_reactToChanges || this.__reactToChanges.bind(this);
		this.__resizeObserver = this.__resizeObserver || new ResizeObserver(this.__bound_reactToChanges);
		this.__resizeObserver.disconnect();
		this.__resizeObserver.observe(this.__content);
	}

	__reactToChanges() {
		const contentRect = this.__content.getBoundingClientRect();
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

		if (parentView.isActive()) {
			return;
		}

		const relatedTarget = e.relatedTarget;
		let focusableElement;

		const getNextFocusableLocal = () => {
			const activeView = this.getActiveView();
			if (this.__nativeFocus === activeView.focus) {
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
		const path = e.path;
		for (let i = 1; i < path.length; i++) {
			if (path[i].isHierarchicalView) {
				return path[i];
			}
		}
	}

	__observeNodes() {
		if (this.isAttached && this.getActiveView() === this) {
			this.__fireViewResize();
		}
	}

	__onHideStart(e) {

		const rootTarget = e.composedPath()[0];
		if (rootTarget === this || !rootTarget.isHierarchicalView) {
			return;
		}

		const parentView = this.__getParentViewFromEvent(e);
		if (parentView === this) {
			const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');

			const data = e.detail.data;
			const animationEnd = (e) => {
				content.removeEventListener('animationend', animationEnd);
				e.composedPath()[0].classList.remove('d2l-child-view-hide');
				rootTarget.shown = false;
				rootTarget.__fireHideComplete(data);
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
		if (this.childView && e.keyCode === this.__keyCodes.ESCAPE) {
			e.stopPropagation();
			this.hide();
			return;
		}
	}

	__onViewResize(e) {
		this.style.height = `${e.detail.height}px`;
	}

	__onShowStart(e) {

		const rootTarget = e.composedPath()[0];
		if (rootTarget === this || !rootTarget.isHierarchicalView) {
			return;
		}

		if (this.childView && !this.shown) {
			/* deep link scenario */
			this.show(e.detail.data, e.detail.sourceView);
		}
		const content = this.shadowRoot.querySelector('.d2l-hierarchical-view-content');

		if (e.detail.isSource && this.__getParentViewFromEvent(e) === this) {
			const animationEnd = () => {
				content.removeEventListener('animationend', animationEnd);
				e.detail.sourceView.__fireShowComplete(e.detail.data, e.detail);
			};
			content.addEventListener('animationend', animationEnd);
		}

		content.classList.add('d2l-child-view-show');

		if (e.detail.isSource && this.__getParentViewFromEvent(e) === this) {
			e.detail.sourceView.__fireViewResize();
		}

	}

	__onWindowResize() {
		const view = this.getActiveView();
		if (view) {
			view.__fireViewResize();
		}
	}
};

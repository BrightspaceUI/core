import '../colors/colors.js';
import '../focus-trap/focus-trap.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html } from 'lit';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { getComposedParent, isComposedAncestor } from '../../helpers/dom.js';
import { _offscreenStyleDeclarations } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const pointerLength = 16;
const isSupported = ('popover' in HTMLElement.prototype);

// eslint-disable-next-line no-console
console.log('Popover', isSupported);

export const PopoverMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			_contentHeight: { state: true },
			_location: { type: String, reflect: true, attribute: '_location' },
			_margin: { state: true },
			_maxHeight: { state: true },
			_maxWidth: { state: true },
			_minHeight: { state: true },
			_minWidth: { state: true },
			_noAutoClose: { state: true },
			_noAutoFit: { state: true },
			_noAutoFocus: { state: true },
			_offscreen: { type: Boolean, reflect: true, attribute: '_offscreen' },
			_offset: { state: true },
			_opened: { type: Boolean, reflect: true, attribute: '_opened' },
			_preferredPosition: { state: true },
			_positionStyles: { state: true },
			_trapFocus: { state: true },
			_useNativePopover: { type: String, reflect: true, attribute: 'popover' },
			_width: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-popover-default-animation-name: d2l-popover-animation;
				--d2l-popover-default-background-color: #ffffff;
				--d2l-popover-default-border-color: var(--d2l-color-mica);
				--d2l-popover-default-border-radius: 0.3rem;
				--d2l-popover-default-foreground-color: var(--d2l-color-ferrite);
				--d2l-popover-default-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				background-color: transparent; /* override popover default */
				border: none; /* override popover */
				box-sizing: border-box;
				color: var(--d2l-popover-foreground-color, var(--d2l-popover-default-foreground-color));
				display: none;
				height: fit-content; /* normalize popover */
				inset: 0; /* normalize popover */
				margin: 0; /* override popover */
				overflow: visible; /* override popover */
				padding: 0; /* override popover */
				position: fixed; /* normalize popover */
				width: fit-content; /* normalize popover */
			}
			:host([hidden]) {
				display: none;
			}
			:host(:not([popover])) {
				z-index: 998; /* position on top of floating buttons */
			}
			:host([_opened]) {
				display: inline-block;
			}
			:host([_location="block-start"]) {
				bottom: 0;
				top: auto;
			}

			.content-position {
				display: inline-block;
				position: absolute;
			}
			.content-width {
				background-color: var(--d2l-popover-background-color, var(--d2l-popover-default-background-color));
				border: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-radius: var(--d2l-popover-border-radius, var(--d2l-popover-default-border-radius));
				box-shadow: var(--d2l-popover-shadow, var(--d2l-popover-default-shadow));
				box-sizing: border-box;
				max-width: 370px;
				min-width: 70px;
				width: 100vw;
			}
			.content-container {
				box-sizing: border-box;
				display: inline-block;
				max-width: 100%;
				outline: none;
				overflow-y: auto;
			}

			@keyframes d2l-popover-animation {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@media (prefers-reduced-motion: no-preference) {
				:host([_opened]) {
					animation: var(--d2l-popover-animation-name, var(--d2l-popover-default-animation-name)) 300ms ease;
				}
			}

			:host([_offscreen]) {
				${_offscreenStyleDeclarations}
			}
		`;
	}

	constructor() {
		super();
		this.configure();
		this._useNativePopover = isSupported ? 'manual' : undefined;
		this.#handleAncestorMutationBound = this.#handleAncestorMutation.bind(this);
		this.#handleAutoCloseClickBound = this.#handleAutoCloseClick.bind(this);
		this.#handleAutoCloseFocusBound = this.#handleAutoCloseFocus.bind(this);
		this.#handleResizeBound = this.#handleResize.bind(this);
		this.#repositionBound = this.#reposition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		if (this._opened) {
			this.#addAutoCloseHandlers();
			this.#addRepositionHandlers();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#removeAutoCloseHandlers();
		this.#removeRepositionHandlers();
		this.#clearDismissible();
	}

	async close() {
		if (!this._opened) return;

		this._opened = false;

		if (this._useNativePopover) this.hidePopover();

		this._previousFocusableAncestor = null;
		this.#removeAutoCloseHandlers();
		this.#removeRepositionHandlers();
		this.#clearDismissible();
		await this.updateComplete; // wait before applying focus to opener
		this.#focusOpener();
		this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));
	}

	configure(properties) {
		this._margin = properties?.margin ?? 18;
		this._maxHeight = properties?.maxHeight;
		this._maxWidth = properties?.maxWidth;
		this._minHeight = properties?.minHeight;
		this._minWidth = properties?.minWidth;
		this._noAutoClose = properties?.noAutoClose ?? false;
		this._noAutoFit = properties?.noAutoFit ?? false;
		this._noAutoFocus = properties?.noAutoFocus ?? false;
		this._offset = properties?.offset ?? 16;
		this._preferredPosition = {
			location: properties?.position?.location ?? 'block-end', // block-start, block-end
			span: properties?.position?.span ?? 'all', // start, end, all
			allowFlip: properties?.position?.allowFlip ?? true
		};
		this._trapFocus = properties?.trapFocus ?? false;
	}

	async open(applyFocus = true) {
		if (this._opened) return;

		this._applyFocus = applyFocus !== undefined ? applyFocus : true;
		this._opened = true;

		await this.updateComplete; // wait for popover attribute before managing top-layer
		if (this._useNativePopover) this.showPopover();

		this._previousFocusableAncestor = getPreviousFocusableAncestor(this, false, false);

		this._opener = getComposedActiveElement();
		this.#addAutoCloseHandlers();

		await this.#position();

		this._dismissibleId = setDismissible(() => this.close());

		this.#focusContent(this);

		this.#addRepositionHandlers();

		this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));

	}

	renderPopover(content) {

		const stylesMap = this.#getStyleMaps();
		const widthStyle = stylesMap['width'];
		const contentStyle = stylesMap['content'];

		content = html`
			<div class="content-width vdiff-target" style=${styleMap(widthStyle)}>
				<div class="content-container" style=${styleMap(contentStyle)}>${content}</div>
			</div>
		`;

		if (this._trapFocus) {
			content = html`
				<d2l-focus-trap @d2l-focus-trap-enter="${this.#handleFocusTrapEnter}" ?trap="${this._opened}">
					${content}
				</d2l-focus-trap>
			`;
		}

		content = html`
			<div class="content-position" style=${styleMap(this._positionStyles ?? {})}>
				${content}
			</div>
		`;

		return content;
	}

	async resize() {
		if (!this._opened) return;
		await this.#position();
	}

	toggleOpen(applyFocus = true) {
		if (this._opened) return this.close();
		else return this.open(!this._noAutoFocus && applyFocus);
	}

	#handleAncestorMutationBound;
	#handleAutoCloseClickBound;
	#handleAutoCloseFocusBound;
	#handleResizeBound;
	#repositionBound;

	#addAutoCloseHandlers() {
		this.addEventListener('blur', this.#handleAutoCloseFocusBound, { capture: true });
		document.body.addEventListener('focus', this.#handleAutoCloseFocusBound, { capture: true });
		document.addEventListener('click', this.#handleAutoCloseClickBound, { capture: true });
	}

	#addRepositionHandlers() {

		const isScrollable = (node, prop) => {
			const value = window.getComputedStyle(node, null).getPropertyValue(prop);
			return (value === 'scroll' || value === 'auto');
		};

		this.#removeRepositionHandlers();

		window.addEventListener('resize', this.#handleResizeBound);

		this._ancestorMutationObserver ??= new MutationObserver(this.#handleAncestorMutationBound);
		const mutationConfig = { attributes: true, childList: true, subtree: true };

		let node = this;
		this._scrollablesObserved = [];
		while (node) {

			// observe scrollables
			let observeScrollable = false;
			if (node.nodeType === Node.ELEMENT_NODE) {
				observeScrollable = isScrollable(node, 'overflow-y') || isScrollable(node, 'overflow-x');
			} else if (node.nodeType === Node.DOCUMENT_NODE) {
				observeScrollable = true;
			}
			if (observeScrollable) {
				this._scrollablesObserved.push(node);
				node.addEventListener('scroll', this.#repositionBound);
			}

			// observe mutations on each DOM scope (excludes sibling scopes... can only do so much)
			if (node.nodeType === Node.DOCUMENT_NODE || (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node.host)) {
				this._ancestorMutationObserver.observe(node, mutationConfig);
			}

			node = getComposedParent(node);
		}

		this._openerIntersectionObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => this._offscreen = !entry.isIntersecting);
		}, { threshold: 0 }); // 0-1 (0 -> intersection requires any pixel visible, 1 -> intersection requires all pixels visible)
		if (this._opener) {
			this._openerIntersectionObserver.observe(this._opener);
		}

	}

	#clearDismissible() {
		if (!this._dismissibleId) return;
		clearDismissible(this._dismissibleId);
		this._dismissibleId = null;
	}

	#constrainSpaceAround(spaceAround, spaceRequired, openerRect) {
		const constrained = { ...spaceAround };

		const isRTL = this.getAttribute('dir') === 'rtl';
		if ((this._preferredPosition.span === 'end' && !isRTL) || (this._preferredPosition.span === 'start' && isRTL)) {
			constrained.left = Math.max(0, spaceRequired.width - (openerRect.width + spaceAround.right));
		} else if ((this._preferredPosition.span === 'end' && isRTL) || (this._preferredPosition.span === 'start' && !isRTL)) {
			constrained.right = Math.max(0, spaceRequired.width - (openerRect.width + spaceAround.left));
		}

		return constrained;
	}

	#focusContent(container) {
		if (this._noAutoFocus || this._applyFocus === false) return;

		const focusable = getFirstFocusableDescendant(container);
		if (focusable) {
			// removing the rAF call can allow infinite focus looping to happen in content using a focus trap
			requestAnimationFrame(() => focusable.focus());
		} else {
			const content = this.#getContentContainer();
			content.setAttribute('tabindex', '-1');
			content.focus();
		}
	}

	#focusOpener() {
		if (!document.activeElement) return;
		if (!isComposedAncestor(this, getComposedActiveElement())) return;

		this?._opener.focus();
	}

	#getContentContainer() {
		return this.shadowRoot.querySelector('.content-container');
	}

	#getLocation(spaceAround, spaceAroundScroll, spaceRequired) {

		const preferred = this._preferredPosition;
		if (!preferred.allowFlip) {
			return preferred.location;
		}

		if (preferred.location === 'block-end') {
			if (spaceAround.below >= spaceRequired.height) return 'block-end';
			if (spaceAround.above >= spaceRequired.height) return 'block-start';
			// if auto-fit is enabled, scroll will be enabled for the inner content so it will always fit in the available space so pick the largest space it can be displayed in
			if (!this.noAutoFit) return spaceAround.above > spaceAround.below ? 'block-start' : 'block-end';
			if (spaceAroundScroll.below >= spaceRequired.height) return 'block-end';
			if (spaceAroundScroll.above >= spaceRequired.height) return 'block-start';
		}

		if (preferred.location === 'block-start') {
			if (spaceAround.above >= spaceRequired.height) return 'block-start';
			if (spaceAround.below >= spaceRequired.height) return 'block-end';
			// if auto-fit is enabled, scroll will be enabled for the inner content so it will always fit in the available space so pick the largest space it can be displayed in
			if (!this.noAutoFit) return spaceAround.above > spaceAround.below ? 'block-start' : 'block-end';
			if (spaceAroundScroll.above >= spaceRequired.height) return 'block-start';
			if (spaceAroundScroll.below >= spaceRequired.height) return 'block-end';
		}

		// todo: add location order for inline-start and inline-end

		// if auto-fit is disabled and it doesn't fit in the scrollable space above or below, always open down because it can add scrollable space
		return 'block-end';
	}

	#getPositionStyles(spaceAround, openerRect, contentRect) {
		const styles = {};
		const isRTL = this.getAttribute('dir') === 'rtl';

		if (this._location === 'block-end' || this._location === 'block-start') {

			const xAdjustment = this.#getPositionXAdjustment(spaceAround, openerRect, contentRect);
			if (xAdjustment !== null) {
				if (!isRTL) {
					styles.left = `${openerRect.left + xAdjustment}px`;
				} else {
					styles.right = `${window.innerWidth - openerRect.left - openerRect.width + xAdjustment}px`;
				}
			}

			if (this._location === 'block-start') {
				styles.bottom = `${window.innerHeight - openerRect.top + this._offset}px`;
			} else {
				styles.top = `${openerRect.top + openerRect.height + this._offset}px`;
			}

		}

		// todo: add position styles for inline-start and inline-end

		return styles;
	}

	#getPositionXAdjustment(spaceAround, openerRect, contentRect) {

		if (this._location === 'block-end' || this._location === 'block-start') {

			const centerDelta = contentRect.width - openerRect.width;
			const contentXAdjustment = centerDelta / 2;

			if (this._preferredPosition.span === 'all' && centerDelta <= 0) {
				// center with target (opener wider than content)
				return contentXAdjustment * -1;
			}
			if (this._preferredPosition.span === 'all' && spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
				// center with target (content wider than opener and enough space around)
				return contentXAdjustment * -1;
			}

			const isRTL = this.getAttribute('dir') === 'rtl';
			if (!isRTL) {
				if (spaceAround.left < contentXAdjustment) {
					// slide content right (not enough space to center)
					return spaceAround.left * -1;
				} else if (spaceAround.right < contentXAdjustment) {
					// slide content left (not enough space to center)
					return (centerDelta * -1) + spaceAround.right;
				}
			} else {
				if (spaceAround.left < contentXAdjustment) {
					// slide content right (not enough space to center)
					return (centerDelta * -1) + spaceAround.left;
				} else if (spaceAround.right < contentXAdjustment) {
					// slide content left (not enough space to center)
					return spaceAround.right * -1;
				}
			}

			if (this._preferredPosition.span !== 'all') {
				// shift it (not enough space to align as requested)
				const shift = Math.min((openerRect.width / 2) - (20 + pointerLength / 2), 0); // 20 ~= 1rem
				if (this._preferredPosition.span === 'end') {
					return shift;
				} else {
					return openerRect.width - contentRect.width - shift;
				}
			}

		}

		// todo: add position styles for inline-start and inline-end

		return null;
	}

	#getStyleMaps() {
		const widthStyle = {
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : undefined,
			minWidth: this._minWidth ? `${this._minWidth}px` : undefined,
			width: this._width ? `${this._width + 3}px` : undefined // add 3 to content to account for possible rounding and also scrollWidth does not include border
		};

		const contentStyle = {
			maxHeight: this._contentHeight ? `${this._contentHeight}px` : undefined,
		};

		return {
			'width' : widthStyle,
			'content' : contentStyle
		};
	}

	#handleAncestorMutation(mutations) {
		if (!this._opener) return;
		// ignore mutations that are within this popover
		const reposition = !!mutations.find(mutation => !isComposedAncestor(this._opener, mutation.target));
		if (reposition) this.#reposition();
	}

	#handleAutoCloseClick(e) {
		if (!this._opened || this._noAutoClose) return;

		const rootTarget = e.composedPath()[0];
		if (isComposedAncestor(this.#getContentContainer(), rootTarget)
			|| (this._opener !== document.body && isComposedAncestor(this._opener, rootTarget))) {
			return;
		}

		this.close();
	}

	#handleAutoCloseFocus() {

		// todo: try to use relatedTarget instead - this logic is largely copied as-is from dropdown simply to mitigate risk of this fragile code
		setTimeout(() => {
			// we ignore focusable ancestors othrwise the popover will close when user clicks empty space inside the popover
			if (!this._opened
				|| this._noAutoClose
				|| !document.activeElement
				|| document.activeElement === this._previousFocusableAncestor
				|| document.activeElement === document.body) {
				return;
			}

			const activeElement = getComposedActiveElement();
			if (isComposedAncestor(this, activeElement)
				|| activeElement === this._opener) {
				return;
			}

			this.close();
		}, 0);

	}

	#handleFocusTrapEnter() {
		this.#focusContent(this.#getContentContainer());

		/** Dispatched when user focus enters the popover (trap-focus option only) */
		this.dispatchEvent(new CustomEvent('d2l-popover-focus-enter', { detail: { applyFocus: this._applyFocus } }));
	}

	#handleResize() {
		this.resize();
	}

	async #position(contentRect, options) {
		if (!this._opener) return;

		options = Object.assign({ updateLocation: true, updateHeight: true }, options);

		const content = this.#getContentContainer();

		if (!this._noAutoFit && options.updateHeight) {
			this._contentHeight = null;
		}

		// don't let popover content horizontally overflow viewport
		this._width = null;

		await this.updateComplete;

		const adjustPosition = async() => {

			const scrollHeight = document.documentElement.scrollHeight;
			const openerRect = this._opener.getBoundingClientRect();
			contentRect = contentRect ?? content.getBoundingClientRect();

			const height = this._minHeight ?? Math.min(this._maxHeight ?? Number.MAX_VALUE, contentRect.height);

			const spaceRequired = {
				height: height + 10,
				width: contentRect.width
			};

			// space in viewport
			const spaceAround = this.#constrainSpaceAround({
				// allow for opener offset + outer margin
				above: openerRect.top - this._offset - this._margin,
				// allow for opener offset + outer margin
				below: window.innerHeight - openerRect.bottom - this._offset - this._margin,
				// allow for outer margin
				left: openerRect.left - 20,
				// allow for outer margin
				right: document.documentElement.clientWidth - openerRect.right - 15
			}, spaceRequired, openerRect);

			// space in document
			const spaceAroundScroll = this.#constrainSpaceAround({
				above: openerRect.top + document.documentElement.scrollTop,
				below: scrollHeight - openerRect.bottom - document.documentElement.scrollTop
			}, spaceRequired, openerRect);

			if (options.updateLocation) {
				this._location = this.#getLocation(spaceAround, spaceAroundScroll, spaceRequired);
			}

			this._positionStyles = this.#getPositionStyles(spaceAround, openerRect, contentRect);

			if (options.updateHeight) {

				// calculate height available to the popover contents for overflow because that is the only area capable of scrolling
				const availableHeight = (this._location === 'block-start') ? spaceAround.above : spaceAround.below;

				if (!this._noAutoFit && availableHeight && availableHeight > 0) {
					// only apply maximum if it's less than space available and the header/footer alone won't exceed it (content must be visible)
					this._contentHeight = this._maxHeight !== null && availableHeight > this._maxHeight
						? this._maxHeight - 2 : availableHeight;

					// ensure the content height has updated when the __toggleScrollStyles event handler runs
					await this.updateComplete;
				}

				// todo: handle inline-start and inline-end locations

			}

			/** Dispatched when the popover position finishes adjusting */
			this.dispatchEvent(new CustomEvent('d2l-popover-position', { bubbles: true, composed: true }));

		};

		const scrollWidth = content.scrollWidth;
		const availableWidth = window.innerWidth - 40;

		this._width = (availableWidth > scrollWidth ? scrollWidth : availableWidth);

		await this.updateComplete;

		await adjustPosition();

	}

	#removeAutoCloseHandlers() {
		this.removeEventListener('blur', this.#handleAutoCloseFocusBound, { capture: true });
		document.body?.removeEventListener('focus', this.#handleAutoCloseFocusBound, { capture: true }); // DE41322: document.body can be null in some scenarios
		document.removeEventListener('click', this.#handleAutoCloseClickBound, { capture: true });
	}

	#removeRepositionHandlers() {
		this._openerIntersectionObserver?.unobserve(this._opener);
		this._scrollablesObserved?.forEach(node => {
			node.removeEventListener('scroll', this.#repositionBound);
		});
		this._scrollablesObserved = null;
		this._ancestorMutationObserver?.disconnect();
		window.removeEventListener('resize', this.#handleResizeBound);
	}

	#reposition() {
		// throttle repositioning (https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event#scroll_event_throttling)
		if (!this._repositioning) {
			requestAnimationFrame(() => {
				this.#position(undefined, { updateLocation: false, updateHeight: false });
				this._repositioning = false;
			});
		}
		this._repositioning = true;
	}

};

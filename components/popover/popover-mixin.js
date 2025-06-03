import '../backdrop/backdrop.js';
import '../colors/colors.js';
import '../focus-trap/focus-trap.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, nothing } from 'lit';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { getComposedParent, isComposedAncestor } from '../../helpers/dom.js';
import { _offscreenStyleDeclarations } from '../offscreen/offscreen.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { tryGetIfrauBackdropService } from '../../helpers/ifrauBackdropService.js';

const defaultPreferredPosition = {
	location: 'block-end', // block-start, block-end, inline-start, inline-end
	span: 'all', // start, end, all
	allowFlip: true
};
const minBackdropHeightMobile = 42;
const minBackdropWidthMobile = 30;
const pointerLength = 16;
const pointerRotatedLength = Math.SQRT2 * parseFloat(pointerLength);
const isSupported = ('popover' in HTMLElement.prototype);

const getScrollbarWidth = () => {
	const width = window.innerWidth - document.documentElement.clientWidth;
	if (width > 0) return width + 1; // 16 when present, but can be 0 even if visible (ex. MacOS depending on settings)
	else return 0;
};

export const PopoverMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_contentHeight: { state: true },
			_location: { type: String, reflect: true, attribute: '_location' },
			_margin: { state: true },
			_maxHeight: { state: true },
			_maxWidth: { state: true },
			_minHeight: { state: true },
			_minWidth: { state: true },
			_mobile: { type: Boolean, reflect: true, attribute: '_mobile' },
			_mobileBreakpoint: { state: true },
			_mobileTrayLocation: { type: String, reflect: true, attribute: '_mobile-tray-location' },
			_noAutoClose: { state: true },
			_noAutoFit: { state: true },
			_noAutoFocus: { state: true },
			_noPointer: { state: true },
			_offscreen: { type: Boolean, reflect: true, attribute: '_offscreen' },
			_offset: { state: true },
			_opened: { type: Boolean, reflect: true, attribute: '_opened' },
			_pointerPosition: { state: true },
			_position: { state: true },
			_preferredPosition: { state: true },
			_rtl: { state: true },
			_showBackdrop: { state: true },
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
				--d2l-popover-default-shadow-color: rgba(0, 0, 0, 0.15);
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
				text-align: start;
				width: fit-content; /* normalize popover */
			}
			:host([theme="dark"]) {
				--d2l-popover-default-animation-name: d2l-popover-animation-dark;
				--d2l-popover-default-background-color: #333536; /* tungsten @ 70% */
				--d2l-popover-default-border-color: var(--d2l-color-tungsten);
				--d2l-popover-default-foreground-color: var(--d2l-color-sylvite);
				--d2l-popover-default-shadow-color: rgba(0, 0, 0, 1);
				opacity: 0.9;
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
				box-shadow: 0 2px 12px 0 var(--d2l-popover-shadow-color, var(--d2l-popover-default-shadow-color));
				box-sizing: border-box;
				display: flex;
				max-width: 370px;
				min-width: 70px;
				width: 100vw;
			}
			.content-container {
				box-sizing: border-box;
				display: inline-block;
				max-width: 100%;
				min-width: inherit;
				outline: none;
				overflow-y: auto;
			}

			.pointer {
				clip: rect(-5px, 21px, 8px, -7px);
				display: inline-block;
				position: absolute;
				z-index: 1;
			}
			:host([_location="block-start"]) .pointer {
				clip: rect(9px, 21px, 22px, -3px);
			}
			:host([_location="inline-start"]) .pointer,
			:host([_location="inline-end"]) .pointer.pointer-mirror {
				clip: rect(-3px, 21px, 21px, 10px);
			}
			:host([_location="inline-end"]) .pointer,
			:host([_location="inline-start"]) .pointer.pointer-mirror {
				clip: rect(-3px, 8px, 21px, -3px);
			}

			.pointer > div {
				background-color: var(--d2l-popover-background-color, var(--d2l-popover-default-background-color));
				border: 1px solid var(--d2l-popover-border-color, var(--d2l-popover-default-border-color));
				border-radius: 0.1rem;
				box-shadow: -4px -4px 12px -5px rgba(32, 33, 34, 0.2); /* ferrite */
				height: ${pointerLength}px;
				transform: rotate(45deg);
				width: ${pointerLength}px;
			}

			:host([_location="block-start"]) .pointer > div {
				box-shadow: 4px 4px 12px -5px rgba(32, 33, 34, 0.2); /* ferrite */
			}

			@keyframes d2l-popover-animation {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@keyframes d2l-popover-animation-dark {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 0.9; transform: translate(0, 0); }
			}
			@media (prefers-reduced-motion: no-preference) {
				:host([_opened]) {
					animation: var(--d2l-popover-animation-name, var(--d2l-popover-default-animation-name)) 300ms ease;
				}
			}

			:host([_mobile][_mobile-tray-location]) .content-width {
				position: fixed;
				z-index: 1000;
			}

			:host([_mobile][_mobile-tray-location="inline-start"]) .content-width,
			:host([_mobile][_mobile-tray-location="inline-end"]) .content-width {
				inset-block-end: 0;
				inset-block-start: 0;
			}

			:host([_mobile][_mobile-tray-location="inline-start"]) .content-width {
				border-end-start-radius: 0;
				border-start-start-radius: 0;
			}

			:host([_mobile][_mobile-tray-location="inline-end"]) .content-width {
				border-end-end-radius: 0;
				border-start-end-radius: 0;
			}

			:host([_mobile][_mobile-tray-location="block-end"]) .content-width {
				border-end-end-radius: 0;
				border-end-start-radius: 0;
				inset-inline-start: 0;
			}

			:host([_mobile][_mobile-tray-location="inline-end"][opened]) .content-width {
				inset-inline-end: 0;
			}

			:host([_mobile][_mobile-tray-location="inline-start"][opened]) .content-width {
				inset-inline-start: 0;
			}

			:host([_mobile][_mobile-tray-location="block-end"][opened]) .content-width {
				inset-block-end: 0;
			}

			:host([_mobile][_mobile-tray-location="inline-start"][opened]) .content-container,
			:host([_mobile][_mobile-tray-location="inline-end"][opened]) .content-container {
				height: 100vh;
			}

			:host([_mobile][_mobile-tray-location]) > .pointer {
				display: none;
			}

			:host([_mobile][_mobile-tray-location][opened]) {
				animation: none;
			}

			:host([_offscreen]) {
				${_offscreenStyleDeclarations}
			}
		`;
	}

	constructor() {
		super();
		this.configure();
		this._mobile = false;
		this._showBackdrop = false;
		this._useNativePopover = isSupported ? 'manual' : undefined;
		this.#handleAncestorMutationBound = this.#handleAncestorMutation.bind(this);
		this.#handleAutoCloseClickBound = this.#handleAutoCloseClick.bind(this);
		this.#handleAutoCloseFocusBound = this.#handleAutoCloseFocus.bind(this);
		this.#handleMobileResizeBound = this.#handleMobileResize.bind(this);
		this.#handleResizeBound = this.#handleResize.bind(this);
		this.#repositionBound = this.#reposition.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		if (this._opened) {
			this.#addAutoCloseHandlers();
			this.#addMediaQueryHandlers();
			this.#addRepositionHandlers();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#removeAutoCloseHandlers();
		this.#removeMediaQueryHandlers();
		this.#removeRepositionHandlers();
		this.#clearDismissible();
	}

	async close() {
		if (!this._opened) return;

		const ifrauBackdropService = await tryGetIfrauBackdropService();

		this._opened = false;
		if (this._useNativePopover) this.hidePopover();

		this._previousFocusableAncestor = null;
		this.#removeAutoCloseHandlers();
		this.#removeMediaQueryHandlers();
		this.#removeRepositionHandlers();
		this.#clearDismissible();

		if (ifrauBackdropService && this._showBackdrop) {
			ifrauBackdropService.hideBackdrop();
			this.#ifrauContextInfo = null;
		}
		this._showBackdrop = false;

		await this.updateComplete; // wait before applying focus to opener
		this.#focusOpener();

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-popover-close', { bubbles: true, composed: true }));

	}

	configure(properties) {
		this._margin = properties?.margin ?? 18;
		this._maxHeight = properties?.maxHeight;
		this._maxWidth = properties?.maxWidth;
		this._minHeight = properties?.minHeight;
		this._minWidth = properties?.minWidth;
		this._mobileBreakpoint = properties?.mobileBreakpoint ?? 616;
		this._mobileTrayLocation = properties?.mobileTrayLocation;
		this._noAutoClose = properties?.noAutoClose ?? false;
		this._noAutoFit = properties?.noAutoFit ?? false;
		this._noAutoFocus = properties?.noAutoFocus ?? false;
		this._noPointer = properties?.noPointer ?? false;
		this._offset = properties?.offset ?? 16;
		if (!properties) {
			this._preferredPosition = defaultPreferredPosition;
		} else if (this._preferredPosition?.location !== properties.position?.location
			|| this._preferredPosition?.span !== properties.position?.span
			|| this._preferredPosition?.allowFlip !== properties.position?.allowFlip) {
			this._preferredPosition = {
				location: properties?.position?.location ?? 'block-end',
				span: properties?.position?.span ?? 'all',
				allowFlip: properties?.position?.allowFlip ?? true
			};
		}
		this._trapFocus = properties?.trapFocus ?? false;
	}

	async open(opener, applyFocus = true) {
		if (this._opened) return;

		const ifrauBackdropService = await tryGetIfrauBackdropService();

		this.#addMediaQueryHandlers();

		this._rtl = document.documentElement.getAttribute('dir') === 'rtl';
		this._applyFocus = applyFocus !== undefined ? applyFocus : true;
		this._opened = true;

		await this.updateComplete; // wait for popover attribute before managing top-layer
		if (this._useNativePopover) this.showPopover();

		this._previousFocusableAncestor = getPreviousFocusableAncestor(this, false, false);

		this._opener = opener;
		this.#addAutoCloseHandlers();

		await this.position();

		this._showBackdrop = this._mobile && this._mobileTrayLocation;
		if (ifrauBackdropService && this._showBackdrop) {
			this.#ifrauContextInfo = await ifrauBackdropService.showBackdrop();
		}

		this._dismissibleId = setDismissible(() => this.close());

		this.#focusContent(this);

		this.#addRepositionHandlers();

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-popover-open', { bubbles: true, composed: true }));

	}

	async position(contentRect, options) {
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

			this._position = this.#getPosition(spaceAround, openerRect, contentRect);
			if (!this._noPointer) this._pointerPosition = this.#getPointerPosition(openerRect);

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

			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-popover-position', { bubbles: true, composed: true }));

		};

		const scrollWidth = content.scrollWidth;
		const availableWidth = window.innerWidth - 40;

		this._width = (availableWidth > scrollWidth ? scrollWidth : availableWidth);

		await this.updateComplete;

		await adjustPosition();

	}

	renderPopover(content) {

		const mobileTrayLocation = this._mobile ? this._mobileTrayLocation : null;

		let stylesMap;
		if (mobileTrayLocation === 'block-end') {
			stylesMap = this.#getMobileTrayBlockStyleMaps();
		} else if (mobileTrayLocation === 'inline-start' || mobileTrayLocation === 'inline-end') {
			stylesMap = this.#getMobileTrayInlineStyleMaps();
		} else {
			stylesMap = this.#getStyleMaps();
		}
		const widthStyle = stylesMap['width'];
		const contentStyle = stylesMap['content'];

		content = html`
			<div id="content-wrapper" class="content-width vdiff-target" style=${styleMap(widthStyle)}>
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

		const positionStyles = {};
		if (this._position) {
			for (const prop in this._position) {
				positionStyles[prop] = `${this._position[prop]}px`;
			}
		}

		content = html`
			<div class="content-position" style=${styleMap(positionStyles)}>
				${content}
			</div>
		`;

		const pointerPositionStyles = {};
		if (this._pointerPosition) {
			for (const prop in this._pointerPosition) {
				pointerPositionStyles[prop] = `${this._pointerPosition[prop]}px`;
			}
		}

		const pointerClasses = {
			'pointer': true,
			'pointer-mirror': this._rtl
		};
		const pointer = !this._noPointer ? html`
			<div class="${classMap(pointerClasses)}" style="${styleMap(pointerPositionStyles)}">
				<div></div>
			</div>
		` : nothing;

		const backdrop = this._mobileTrayLocation ?
			html`<d2l-backdrop for-target="content-wrapper" ?shown="${this._showBackdrop}"></d2l-backdrop>` :
			nothing;

		return html`${content}${backdrop}${pointer}`;

	}

	async resize() {
		if (!this._opened) return;
		this._showBackdrop = this._mobile && this._mobileTrayLocation;
		await this.position();
	}

	toggleOpen(opener, applyFocus = true) {
		if (this._opened) return this.close();
		else return this.open(opener, (!this._noAutoFocus && applyFocus));
	}

	#ifrauContextInfo;
	#mediaQueryList;
	#handleAncestorMutationBound;
	#handleAutoCloseClickBound;
	#handleAutoCloseFocusBound;
	#handleMobileResizeBound;
	#handleResizeBound;
	#repositionBound;

	#addAutoCloseHandlers() {
		this.addEventListener('blur', this.#handleAutoCloseFocusBound, { capture: true });
		document.body.addEventListener('focus', this.#handleAutoCloseFocusBound, { capture: true });
		document.addEventListener('click', this.#handleAutoCloseClickBound, { capture: true });
	}

	#addMediaQueryHandlers() {
		this.#mediaQueryList = window.matchMedia(`(max-width: ${this._mobileBreakpoint - 1}px)`);
		this._mobile = this.#mediaQueryList.matches;
		this.#mediaQueryList.addEventListener?.('change', this.#handleMobileResizeBound);
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

		if ((this._preferredPosition.span === 'end' && !this._rtl) || (this._preferredPosition.span === 'start' && this._rtl)) {
			constrained.left = Math.max(0, spaceRequired.width - (openerRect.width + spaceAround.right));
		} else if ((this._preferredPosition.span === 'end' && this._rtl) || (this._preferredPosition.span === 'start' && !this._rtl)) {
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

		if (preferred.location === 'inline-end') {
			if (this._rtl) {
				if (spaceAround.left >= spaceRequired.width) return 'inline-end';
				if (spaceAround.right >= spaceRequired.width) return 'inline-start';
			} else {
				if (spaceAround.right >= spaceRequired.width) return 'inline-end';
				if (spaceAround.left >= spaceRequired.width) return 'inline-start';
			}
		}

		if (preferred.location === 'inline-start') {
			if (this._rtl) {
				if (spaceAround.right >= spaceRequired.width) return 'inline-start';
				if (spaceAround.left >= spaceRequired.width) return 'inline-end';
			} else {
				if (spaceAround.left >= spaceRequired.width) return 'inline-start';
				if (spaceAround.right >= spaceRequired.width) return 'inline-end';
			}
		}

		// if auto-fit is disabled and it doesn't fit in the scrollable space above or below, always open down because it can add scrollable space
		return 'block-end';
	}

	#getMobileTrayBlockStyleMaps() {

		let maxHeightOverride;
		let availableHeight = Math.min(window.innerHeight, window.screen.height);
		if (this.#ifrauContextInfo) availableHeight = this.#ifrauContextInfo.availableHeight;

		// default maximum height for bottom tray (42px margin)
		const mobileTrayMaxHeightDefault = availableHeight - minBackdropHeightMobile;
		if (this._maxHeight) {
			// if maxHeight provided is smaller, use the maxHeight
			maxHeightOverride = Math.min(mobileTrayMaxHeightDefault, this._maxHeight);
		} else {
			maxHeightOverride = mobileTrayMaxHeightDefault;
		}
		maxHeightOverride = `${maxHeightOverride}px`;

		let bottomOverride;
		if (this.#ifrauContextInfo) {
			// the bottom override is measured as the distance from the bottom of the screen
			const screenHeight = window.innerHeight - this.#ifrauContextInfo.availableHeight + Math.min(this.#ifrauContextInfo.top, 0);
			bottomOverride = `${screenHeight}px`;
		}

		const widthOverride = '100vw';

		const widthStyle = {
			minWidth: widthOverride,
			width: widthOverride,
			maxHeight: maxHeightOverride,
			bottom: bottomOverride
		};

		const contentWidthStyle = {
			// set width of content in addition to width container so header and footer borders are full width
			width: widthOverride
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: maxHeightOverride,
		};

		return {
			width: widthStyle,
			content: contentStyle
		};
	}

	#getMobileTrayInlineStyleMaps() {

		let maxWidthOverride = this._maxWidth;
		let availableWidth = Math.min(window.innerWidth, window.screen.width);
		if (this.#ifrauContextInfo) availableWidth = this.#ifrauContextInfo.availableWidth;

		// default maximum width for tray (30px margin)
		const mobileTrayMaxWidthDefault = Math.min(availableWidth - minBackdropWidthMobile, 420);
		if (maxWidthOverride) {
			// if maxWidth provided is smaller, use the maxWidth
			maxWidthOverride = Math.min(mobileTrayMaxWidthDefault, maxWidthOverride);
		} else {
			maxWidthOverride = mobileTrayMaxWidthDefault;
		}

		let minWidthOverride = this.minWidth;
		// minimum size - 285px
		const mobileTrayMinWidthDefault = 285;
		if (minWidthOverride) {
			// if minWidth provided is smaller, use the minumum width for tray
			minWidthOverride = Math.max(mobileTrayMinWidthDefault, minWidthOverride);
		} else {
			minWidthOverride = mobileTrayMinWidthDefault;
		}

		// if no width property set, automatically size to maximum width
		let widthOverride = this._width ? this._width : maxWidthOverride;
		// ensure width is between minWidth and maxWidth
		if (widthOverride && maxWidthOverride && widthOverride > (maxWidthOverride - 20)) widthOverride = maxWidthOverride - 20;
		if (widthOverride && minWidthOverride && widthOverride < (minWidthOverride - 20)) widthOverride = minWidthOverride - 20;
		maxWidthOverride = `${maxWidthOverride}px`;
		minWidthOverride = `${minWidthOverride}px`;

		const contentWidth = `${widthOverride + 18}px`;
		// add 2 to content width since scrollWidth does not include border
		const containerWidth = `${widthOverride + 20}px`;

		const maxHeightOverride = this.#ifrauContextInfo ? `${this.#ifrauContextInfo.availableHeight}px` : '';

		let topOverride;
		if (this.#ifrauContextInfo) {
			// if inside iframe, use ifrauContext top as top of screen
			topOverride = `${this.#ifrauContextInfo.top < 0 ? -this.#ifrauContextInfo.top : 0}px`;
		} else if (window.innerHeight > window.screen.height) {
			// non-responsive page, manually override top to scroll distance
			topOverride = window.pageYOffset;
		}

		let inlineEndOverride;
		let inlineStartOverride;
		if (this._mobileTrayLocation === 'inline-end') {
			// On non-responsive pages, the innerWidth may be wider than the screen,
			// override right to stick to right of viewport
			inlineEndOverride = `${Math.max(window.innerWidth - window.screen.width, 0)}px`;
		} else if (this._mobileTrayLocation === 'inline-start') {
			// On non-responsive pages, the innerWidth may be wider than the screen,
			// override left to stick to left of viewport
			inlineStartOverride = `${Math.max(window.innerWidth - window.screen.width, 0)}px`;
		}

		if (minWidthOverride > maxWidthOverride) {
			minWidthOverride = maxWidthOverride;
		}
		const widthStyle = {
			maxWidth: maxWidthOverride,
			minWidth: minWidthOverride,
			width: containerWidth,
			top: topOverride,
			maxHeight: maxHeightOverride,
			insetInlineStart: inlineStartOverride,
			insetInlineEnd: inlineEndOverride
		};

		const contentWidthStyle = {
			minWidth: minWidthOverride,
			// set width of content in addition to width container so header and footer borders are full width
			width: contentWidth,
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: maxHeightOverride,
		};

		return {
			width: widthStyle,
			content: contentStyle
		};
	}

	#getPointer() {
		return this.shadowRoot.querySelector('.pointer');
	}

	#getPointerPosition(openerRect) {
		const position = {};
		const pointer = this.#getPointer();
		if (!pointer) return position;

		const pointerRect = pointer.getBoundingClientRect();

		if (this._location === 'block-end' || this._location === 'block-start') {

			if (this._preferredPosition.span !== 'all') {
				const xAdjustment = Math.min(20 + ((pointerRotatedLength - pointerLength) / 2), (openerRect.width - pointerLength) / 2);
				if (!this._rtl) {
					if (this._preferredPosition.span === 'end') {
						position.left = openerRect.left + xAdjustment;
					} else {
						position.right = (openerRect.right * -1) + xAdjustment;
					}
				} else {
					if (this._preferredPosition.span === 'end') {
						position.right = window.innerWidth - openerRect.right + xAdjustment;
					} else {
						position.left = (window.innerWidth - openerRect.left - xAdjustment) * -1;
					}
				}
			} else {
				if (!this._rtl) {
					position.left = openerRect.left + ((openerRect.width - pointerRect.width) / 2);
				} else {
					position.right = window.innerWidth - openerRect.left - ((openerRect.width + pointerRect.width) / 2);
				}
			}

			if (this._location === 'block-start') {
				position.bottom = window.innerHeight - openerRect.top + this._offset - 8;
			} else {
				position.top = openerRect.top + openerRect.height + this._offset - 7;
			}

		} else if (this._location === 'inline-end' || this._location === 'inline-start') {

			position.top = openerRect.top + (openerRect.height / 2) - 9;

			if (this._location === 'inline-start') {
				if (!this._rtl) {
					position.right = (openerRect.left - this._offset + 7) * -1;
				} else {
					position.left = (window.innerWidth - openerRect.right + 7 - this._offset - getScrollbarWidth()) * -1;
				}
			} else {
				if (!this._rtl) {
					position.left = openerRect.left + openerRect.width + this._offset - 7;
				} else {
					position.right = window.innerWidth - openerRect.left - 7 + this._offset - getScrollbarWidth();
				}
			}

		}

		return position;
	}

	#getPosition(spaceAround, openerRect, contentRect) {
		const position = {};

		if (this._location === 'block-end' || this._location === 'block-start') {

			const xAdjustment = this.#getPositionXAdjustment(spaceAround, openerRect, contentRect);
			if (xAdjustment !== null) {
				if (!this._rtl) {
					position.left = openerRect.left + xAdjustment;
				} else {
					position.right = window.innerWidth - openerRect.left - openerRect.width + xAdjustment;
				}
			}

			if (this._location === 'block-start') {
				position.bottom = window.innerHeight - openerRect.top + this._offset;
			} else {
				position.top = openerRect.top + openerRect.height + this._offset;
			}

		} else if (this._location === 'inline-end' || this._location === 'inline-start') {

			const yAdjustment = 0;
			if (yAdjustment !== null) {
				position.top = openerRect.top;
			}

			if (this._location === 'inline-start') {
				if (!this._rtl) {
					position.right = (openerRect.left - this._offset) * -1;
				} else {
					position.left = (window.innerWidth - openerRect.right - this._offset - getScrollbarWidth()) * -1;
				}
			} else {
				if (!this._rtl) {
					position.left = openerRect.left + openerRect.width + this._offset;
				} else {
					position.right = window.innerWidth - openerRect.left + this._offset - getScrollbarWidth();
				}
			}

		}

		return position;
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

			if (!this._rtl) {
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
			width: widthStyle,
			content: contentStyle
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
				|| isComposedAncestor(this._opener, activeElement)
				|| activeElement === this._previousFocusableAncestor) {
				return;
			}

			this.close();
		}, 0);

	}

	#handleFocusTrapEnter() {
		this.#focusContent(this.#getContentContainer());

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-popover-focus-enter', { detail: { applyFocus: this._applyFocus } }));
	}

	async #handleMobileResize() {
		this._mobile = this.#mediaQueryList.matches;
		if (this._opened) {
			this._showBackdrop = this._mobile && this._mobileTrayLocation;
			await this.position();
		}
	}

	#handleResize() {
		this.resize();
	}

	#removeAutoCloseHandlers() {
		this.removeEventListener('blur', this.#handleAutoCloseFocusBound, { capture: true });
		document.body?.removeEventListener('focus', this.#handleAutoCloseFocusBound, { capture: true }); // DE41322: document.body can be null in some scenarios
		document.removeEventListener('click', this.#handleAutoCloseClickBound, { capture: true });
	}

	#removeMediaQueryHandlers() {
		this.#mediaQueryList?.removeEventListener?.('change', this.#handleMobileResizeBound);
	}

	#removeRepositionHandlers() {
		if (this._opener) {
			this._openerIntersectionObserver?.unobserve(this._opener);
		}
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
				this.position(undefined, { updateLocation: false, updateHeight: false });
				this._repositioning = false;
			});
		}
		this._repositioning = true;
	}

};

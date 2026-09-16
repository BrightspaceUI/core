import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { findComposedAncestor, getOffsetParent, isVisible } from '../../helpers/dom.js';
import { getFocusPseudoClass, getFocusRingStyles } from '../../helpers/focus.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getOverflowDeclarations } from '../../helpers/overflow.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollButtonWidth = 56;

function getOffsetLeft(tab, tabRect) {
	const offsetParent = getOffsetParent(tab);
	return Math.round(tabRect.left - offsetParent.getBoundingClientRect().left);
}

/**
 * A component for tabbed content. It supports the "d2l-tab" component and "TabMixin" consumers for tabs, the "d2l-tab-panel" component for the tab content, renders tabs responsively, and provides virtual scrolling for large tab lists.
 * @slot ext - Additional content (e.g., a button) positioned at right
 * @slot tabs - Contains the tabs (e.g., "d2l-tab" components or custom components that use `TabMixin`)
 * @slot panels - Contains the tab panels (e.g., "d2l-tab-panel" components)
 */
class Tabs extends LocalizeCoreElement(ArrowKeysMixin(SkeletonMixin(LitElement))) {

	static properties = {
		/**
		 * Limit the number of tabs to initially display
		 * @type {number}
		 */
		maxToShow: { type: Number, attribute: 'max-to-show' },
		/**
		 * REQUIRED: ACCESSIBILITY: Accessible text for the tablist
		 * @type {string}
		 */
		text: { type: String },
		_allowScrollNext: { type: Boolean },
		_allowScrollPrevious: { type: Boolean },
		_maxWidth: { type: Number },
		_scrollCollapsed: { type: Boolean },
		_state: { type: String },
		_translationValue: {}
	};

	static styles = [super.styles, bodyCompactStyles, css`
		:host {
			--d2l-tabs-background-color: var(--d2l-theme-background-color-base);
			box-sizing: border-box;
			display: block;
			margin-bottom: 1.2rem;
		}
		.d2l-tabs-layout {
			border-bottom: 1px solid var(--d2l-theme-border-color-subtle);
			display: none;
			max-height: 0;
			opacity: 0;
			transform: translateY(-10px);
			-webkit-transition: max-height 200ms ease-out, transform 200ms ease-out, opacity 200ms ease-out;
			transition: max-height 200ms ease-out, transform 200ms ease-out, opacity 200ms ease-out;
			width: 100%;
		}
		.d2l-tabs-layout-anim {
			display: flex;
		}
		.d2l-tabs-layout-shown {
			display: flex;
			max-height: 60px;
			opacity: 1;
			transform: none;
		}
		.d2l-tabs-container {
			box-sizing: border-box;
			flex: auto;
			margin-left: -3px;
			padding-left: 3px;
			position: relative;
			-webkit-transition: max-width 200ms ease-in;
			transition: max-width 200ms ease-in;
			${getOverflowDeclarations({ textOverflow: 'clip' })}
		}
		.d2l-tabs-container-ext {
			flex: none;
			padding-inline: 4px 0;
		}
		.d2l-tabs-container-list {
			display: flex;
			position: relative;
			-webkit-transition: transform 200ms ease-out;
			transition: transform 200ms ease-out;
			white-space: nowrap;
		}
		.d2l-tabs-scroll-previous-container,
		.d2l-tabs-scroll-next-container {
			background-color: var(--d2l-tabs-background-color);
			box-shadow: 0 0 12px 18px var(--d2l-tabs-background-color);
			clip-path: rect(0% 200% 100% -100%);
			display: none;
			height: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}
		.d2l-tabs-scroll-previous-container {
			inset-inline-start: 0;
			margin-inline: 4px 0;
		}
		.d2l-tabs-container[data-allow-scroll-previous] > .d2l-tabs-scroll-previous-container {
			display: inline-block;
		}
		.d2l-tabs-scroll-next-container {
			inset-inline-end: 0;
			margin-inline: 0 4px;
		}
		.d2l-tabs-container[data-allow-scroll-next] > .d2l-tabs-scroll-next-container {
			display: inline-block;
		}
		.d2l-tabs-scroll-button {
			background-color: transparent;
			border: 1px solid transparent;
			border-radius: 15px;
			box-sizing: border-box;
			cursor: pointer;
			display: inline-block;
			height: 30px;
			margin: 0;
			outline: none;
			padding: 0;
			transform: translateY(10px);
			width: 30px;
		}
		.d2l-tabs-scroll-button[disabled] {
			cursor: default;
			opacity: 0.5;
		}
		.d2l-tabs-scroll-button::-moz-focus-inner {
			border: 0;
		}
		.d2l-tabs-scroll-button[disabled]:hover,
		.d2l-tabs-scroll-button[disabled]:${unsafeCSS(getFocusPseudoClass())} {
			background-color: transparent;
		}
		.d2l-tabs-scroll-button:hover,
		.d2l-tabs-scroll-button:${unsafeCSS(getFocusPseudoClass())} {
			background-color: var(--d2l-theme-background-color-interactive-tertiary-hover);
		}
		${getFocusRingStyles('.d2l-tabs-scroll-button')}
		:host([skeleton]) .d2l-tabs-scroll-button {
			visibility: hidden;
		}
		.d2l-panels-container-no-whitespace ::slotted(*) {
			margin-top: 0;
			-webkit-transition: margin-top 200ms ease-out;
			transition: margin-top 200ms ease-out;
		}

		::slotted([role="tab"]) {
			-webkit-transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
			transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
		}
		::slotted([role="tab"][data-state="adding"]),
		::slotted([role="tab"][data-state="removing"]) {
			max-width: 0;
			opacity: 0;
			transform: translateY(20px);
		}

		@media (prefers-reduced-motion: reduce) {

			.d2l-tabs-layout {
				-webkit-transition: none;
				transition: none;
			}
			.d2l-tabs-container {
				-webkit-transition: none;
				transition: none;
			}
			.d2l-tabs-container-list {
				-webkit-transition: none;
				transition: none;
			}
			.d2l-panels-container-no-whitespace ::slotted(*) {
				-webkit-transition: none;
				transition: none;
			}
			::slotted([role="tab"]) {
				-webkit-transition: none;
				transition: none;
			}

		}

		@media (prefers-contrast: more) {
			.d2l-tabs-scroll-previous-container,
			.d2l-tabs-scroll-next-container {
				margin-inline: 0;
				padding-inline: 4px;
			}
			.d2l-tabs-scroll-next-container {
				border-inline-start: 1px solid var(--d2l-theme-border-color-subtle);
				padding-inline-start: 11px;
			}
			.d2l-tabs-scroll-previous-container {
				border-inline-end: 1px solid var(--d2l-theme-border-color-subtle);
				padding-inline-end: 11px;
			}
		}
	`];

	constructor() {
		super();
		this.maxToShow = -1;
		this._allowScrollNext = false;
		this._allowScrollPrevious = false;
		this._loadingCompleteResolve = undefined;
		this._loadingCompletePromise = new Promise(resolve => this._loadingCompleteResolve = resolve);
		this._maxWidth = null;
		this._scrollCollapsed = false;
		this._state = 'shown';
		this._tabIds = {};
		this._tabs = [];
		this._translationValue = 0;
	}

	connectedCallback() {
		super.connectedCallback();

		queueMicrotask(() => {
			const bgColor = this.#getComputedBackgroundColor();
			if (bgColor && bgColor !== 'rgb(255, 255, 255)' && bgColor !== 'rgba(255, 255, 255, 1)') {
				this.style.setProperty('--d2l-tabs-background-color', bgColor);
			}
		});

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.arrowKeysFocusablesProvider = async() => {
			return this._tabs;
		};

		this.arrowKeysOnBeforeFocus = async(tab) => {
			this.#setFocusable(tab);

			this.requestUpdate();
			await this.updateComplete;

			if (!this._scrollCollapsed) {
				return this.#updateScrollPosition(tab);
			} else {
				const measures = this.#getMeasures();
				const newTranslationValue = this.#calculateScrollPosition(tab, measures);

				if (!this.#isRTL()) {
					if (newTranslationValue >= 0) return;
				} else {
					if (newTranslationValue <= 0) return;
				}

				const expanded = await this.#tryExpandTabsContainer(measures);
				if (expanded) {
					return;
				} else {
					return this.#updateScrollPosition(tab);
				}
			}
		};

		this._handleResize = this._handleResize.bind(this);
		this._resizeObserver = new ResizeObserver(this._handleResize);
		this._resizeObserver.observe(this.shadowRoot.querySelector('.d2l-tabs-container-list'));

	}

	render() {

		const tabsLayoutClasses = {
			'd2l-tabs-layout': true,
			'd2l-body-compact': true,
			'd2l-skeletize-container': true,
			'd2l-tabs-layout-anim': this._state === 'anim',
			'd2l-tabs-layout-shown': this._state === 'shown'
		};
		const panelContainerClasses = {
			'd2l-panels-container': true,
			'd2l-panels-container-no-whitespace': this._state !== 'shown'
		};

		const tabsContainerStyles = {};
		if (this._maxWidth) tabsContainerStyles['max-width'] = `${this._maxWidth}px`;

		const tabsContainerListStyles = {
			transform: `translateX(${this._translationValue}px)`
		};

		return html`
			<div class="${classMap(tabsLayoutClasses)}">
				<div ?data-allow-scroll-next="${this._allowScrollNext}"
					?data-allow-scroll-previous="${this._allowScrollPrevious}"
					class="d2l-tabs-container"
					style="${styleMap(tabsContainerStyles)}">
					<div class="d2l-tabs-scroll-previous-container">
						<button class="d2l-tabs-scroll-button"
							@click="${this.#handleScrollPrevious}"
							title="${this.localize('components.tabs.previous')}">
							<d2l-icon icon="tier1:chevron-left"></d2l-icon>
						</button>
					</div>
					${this.arrowKeysContainer(html`
						<div class="d2l-tabs-container-list"
							@d2l-tab-content-change="${this.#handleTabContentChange}"
							@d2l-tab-hidden-change="${this.#handleTabHiddenChange}"
							@d2l-tab-selected="${this.#handleTabSelected}"
							@d2l-tab-deselected="${this.#handleTabDeselected}"
							@focusout="${this.#handleFocusOut}"
							aria-label="${ifDefined(this.text)}"
							role="tablist"
							style="${styleMap(tabsContainerListStyles)}">
							<slot name="tabs" @slotchange="${this.#handleTabsSlotChange}"></slot>
						</div>
					`)}
					<div class="d2l-tabs-scroll-next-container">
						<button class="d2l-tabs-scroll-button"
							@click="${this.#handleScrollNext}"
							title="${this.localize('components.tabs.next')}">
							<d2l-icon icon="tier1:chevron-right"></d2l-icon>
						</button>
					</div>
				</div>
				<div class="d2l-tabs-container-ext"><slot name="ext"></slot></div>
			</div>
			<div class="${classMap(panelContainerClasses)}">
				<slot name="panels" @slotchange="${this.#handlePanelsSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		return this.#focusSelected();
	}

	async getLoadingComplete() {
		return this._loadingCompletePromise;
	}

	getTabListRect() {
		if (!this.shadowRoot) return undefined;
		return this.shadowRoot.querySelector('.d2l-tabs-container-list').getBoundingClientRect();
	}

	hideTab(tab) {
		tab.setAttribute('data-state', 'removing');
		return (Object.keys(this._tabIds).length > 1 && !reduceMotion) ? this.#animateTabRemoval(tab) : Promise.resolve();
	}

	#checkTabPanelMatchRequested;
	#panels;
	#updateAriaControlsRequested;

	#animateTabAddition(tab) {
		if (!tab || reduceMotion) {
			return new Promise((resolve) => {
				tab.setAttribute('data-state', '');
				this.requestUpdate();
				resolve();
			});
		}

		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				tab.removeEventListener('transitionend', handleTransitionEnd);
				resolve();
			};
			tab.addEventListener('transitionend', handleTransitionEnd);
			tab.setAttribute('data-state', '');
			this.requestUpdate();
		});
	}

	#animateTabRemoval(tab) {
		if (!tab || reduceMotion) return Promise.resolve();

		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				tab.removeEventListener('transitionend', handleTransitionEnd);
				this.requestUpdate();
				resolve();
			};
			tab.addEventListener('transitionend', handleTransitionEnd);
		});
	}

	#calculateScrollPosition(selectedTab, measures) {
		const tabs = this._tabs;
		const selectedTabIndex = tabs.indexOf(selectedTab);
		return this.#calculateScrollPositionLogic(tabs, selectedTabIndex, measures);
	}

	async #focusSelected() {
		const selectedTab = this._tabs.find(ti => ti.selected);
		if (!selectedTab) return;

		await this.#updateScrollPosition(selectedTab);

		selectedTab.focus();
	}

	#getComputedBackgroundColor() {
		let bgColor = null;

		findComposedAncestor(this, (node) => {
			if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
			const nodeColor = getComputedStyle(node, null)['backgroundColor'];
			if (nodeColor === 'rgba(0, 0, 0, 0)' || nodeColor === 'transparent') return false;
			bgColor = nodeColor;
			return true;
		});

		return bgColor;
	}

	#getMeasures() {
		if (!this._measures) this.#updateMeasures();
		return this._measures;
	}

	#getPanel(id) {
		if (!this.#panels) return;
		return this.#panels.find(panel => panel.labelledBy === id);
	}

	#handleFocusOut(e) {
		if (e.relatedTarget && e.relatedTarget.role === 'tab') return;
		this.#resetFocusables();
	}

	#handlePanelsSlotChange(e) {
		this.#panels = e.target.assignedElements({ flatten: true }).filter((node) => node.role === 'tabpanel');
		this.#checkTabPanelMatch();
		this.#setAriaControls();
	}

	_handleResize(entries) {
		const measures = this.#getMeasures();
		if (entries.length === 1 && entries[0].contentRect.width === measures.tabsContainerListRect.width) return;
		this.#updateMeasures();
		this.#updateScrollVisibility(this.#getMeasures());
	}

	async #handleScrollNext() {

		const measures = this.#getMeasures();

		const expanded = await this.#tryExpandTabsContainer(measures);
		const newMeasures = expanded ? this.#getMeasures() : measures;

		let newTranslationValue;
		const lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
		let isOverflowingNext;

		if (!this.#isRTL()) {

			newTranslationValue = (this._translationValue - measures.tabsContainerRect.width + scrollButtonWidth);
			if (newTranslationValue < 0) newTranslationValue += scrollButtonWidth;

			isOverflowingNext = (lastTabMeasures.offsetLeft + lastTabMeasures.rect.width + newTranslationValue >= newMeasures.tabsContainerRect.width);
			if (!isOverflowingNext) {
				newTranslationValue = -1 * (lastTabMeasures.offsetLeft - newMeasures.tabsContainerRect.width + lastTabMeasures.rect.width);
				if (newTranslationValue > 0) newTranslationValue = 0;
			}

		} else {

			newTranslationValue = (this._translationValue + measures.tabsContainerRect.width - scrollButtonWidth);
			if (newTranslationValue > 0) newTranslationValue -= scrollButtonWidth;

			isOverflowingNext = (lastTabMeasures.offsetLeft + newTranslationValue < 0);
			if (!isOverflowingNext) {
				newTranslationValue = -1 * lastTabMeasures.offsetLeft;
				if (newTranslationValue < 0) newTranslationValue = 0;
			}

		}

		await this.#scrollToPosition(newTranslationValue);
		await this.#updateScrollVisibility(newMeasures);

		if (!isOverflowingNext && this.shadowRoot) {
			this.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').focus();
		}

	}

	async #handleScrollPrevious() {

		const measures = this.#getMeasures();

		const expanded = await this.#tryExpandTabsContainer(measures);
		const newMeasures = expanded ? this.#getMeasures() : measures;

		let newTranslationValue;
		let isOverflowingPrevious;

		if (!this.#isRTL()) {

			newTranslationValue = (this._translationValue + measures.tabsContainerRect.width - scrollButtonWidth);
			isOverflowingPrevious = (newTranslationValue < 0);
			if (!isOverflowingPrevious) newTranslationValue = 0;

		} else {

			newTranslationValue = (this._translationValue - measures.tabsContainerRect.width + scrollButtonWidth);
			isOverflowingPrevious = (newTranslationValue > 0);
			if (!isOverflowingPrevious) newTranslationValue = 0;

		}

		await this.#scrollToPosition(newTranslationValue);
		await this.#updateScrollVisibility(newMeasures);

		if (!isOverflowingPrevious && this.shadowRoot) {
			this.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button').focus();
		}

	}

	async #handleTabContentChange() {
		this.#updateMeasures();
		await this.#updateScrollVisibility(this.#getMeasures());
	}

	async #handleTabSelected(e) {
		const selectedTab = e.target;
		this.#updateSelectedTab(selectedTab);
		await this.updateComplete;
		this.#updateScrollPosition(selectedTab);
	}

	async #handleTabsSlotChange(e) {
		this._tabs = e.target.assignedElements({ flatten: true }).filter((node) => node.role === 'tab');

		// handle case where there are less than two tabs initially
		this.#updateTabListVisibility(this._tabs);

		if (!this._initialized && this._tabs.length === 0) return;

		let selectedTab = null;
		const newTabIds = {};
		this._tabs?.forEach((tab) => {
			const isNew = this._initialized && !this._tabIds[tab.id];
			if (isNew && !reduceMotion && this._tabs.length !== Object.keys(this._tabIds).length) {
				// if it's a new tab, update state to animate addition
				this._tabIds[tab.id] = true;
				tab.setAttribute('data-state', 'adding');
			}
			if (tab.selected && tab.getAttribute('data-state') !== 'removing') {
				// Newly added tabs with selected=true take priority over existing selected tabs
				if (!selectedTab || isNew) selectedTab = tab;
			}
			newTabIds[tab.id] = true;
		});

		this._tabIds = newTabIds;

		if (!selectedTab) {
			selectedTab = this._tabs.find((tab) => tab.getAttribute('data-state') !== 'removing');
			if (selectedTab) selectedTab.selected = true;
		}
		if (selectedTab) {
			this.#updateSelectedTab(selectedTab);
		}

		await this.updateComplete;
		this.#checkTabPanelMatch();
		this.#setAriaControls();

		const animPromises = [];

		if (!this._initialized && this._tabs.length > 0) {
			this._initialized = true;
			await this.#updateTabsContainerWidth(selectedTab);
		} else {
			if (this._tabs.length > 1) {
				this._tabs.forEach((tab) => {
					if (tab.getAttribute('data-state') === 'adding') animPromises.push(this.#animateTabAddition(tab));
				});
			}
			this.#updateMeasures();
		}

		if (selectedTab) {
			Promise.all(animPromises).then(async() => {
				await new Promise(resolve => requestAnimationFrame(resolve));
				this.#updateMeasures();
				this.#updateScrollPosition(selectedTab);
			});
		}
	}

	#isPositionInLeftScrollArea(position) {
		return position > 0 && position < scrollButtonWidth;
	}

	#isPositionInRightScrollArea(position, measures) {
		return (position > measures.tabsContainerRect.width - scrollButtonWidth) && (position < measures.tabsContainerRect.width);
	}

	#resetFocusables() {
		const selectedTab = this._tabs.find(ti => ti.selected);
		if (selectedTab) this.#setFocusable(selectedTab);
		this.requestUpdate();
	}

	#scrollToPosition(translationValue) {
		if (translationValue === this._translationValue) {
			return Promise.resolve();
		}

		this._translationValue = translationValue;
		if (!this.shadowRoot || reduceMotion) return this.updateComplete;

		return new Promise((resolve) => {
			const tabList = this.shadowRoot.querySelector('.d2l-tabs-container-list');
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'transform') {
					return;
				}
				tabList.removeEventListener('transitionend', handleTransitionEnd);
				resolve();
			};
			tabList.addEventListener('transitionend', handleTransitionEnd);
		});
	}

	#setFocusable(tab) {
		const currentFocusable = this._tabs.find(tab => tab.tabIndex === 0);
		if (currentFocusable) currentFocusable.tabIndex = -1;

		tab.tabIndex = 0;
	}

	async #tryExpandTabsContainer(measures) {

		if (!this._scrollCollapsed) return false;

		let expandedPromise;
		this.maxToShow = null;

		if (reduceMotion) {
			this._scrollCollapsed = false;
			this._maxWidth = measures.totalTabsWidth + 50;
			expandedPromise = this.updateComplete;
		} else {
			expandedPromise = new Promise((resolve) => {
				const tabsContainer = this.shadowRoot && this.shadowRoot.querySelector('.d2l-tabs-container');
				const handleTransitionEnd = (e) => {
					if (e.propertyName !== 'max-width') return;
					if (tabsContainer) tabsContainer.removeEventListener('transitionend', handleTransitionEnd);
					resolve();
				};
				if (tabsContainer) tabsContainer.addEventListener('transitionend', handleTransitionEnd);
				this._scrollCollapsed = false;
				this._maxWidth = measures.totalTabsWidth + 50;
			});
		}

		await expandedPromise;

		this._measures = null;

		await this.#updateScrollVisibility(this.#getMeasures());
		this._maxWidth = null;

		if (!this._allowScrollNext) {
			if (!this._allowScrollPrevious) {
				this.#focusSelected();
			} else {
				if (this.shadowRoot) this.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').focus();
			}
		}

		await this.updateComplete;
		return true;
	}

	#updateMeasures() {
		let totalTabsWidth = 0;
		if (!this.shadowRoot) return;
		const tabs = this._tabs;

		const tabRects = tabs.map((tab) => {
			const tabRect = tab.getBoundingClientRect();
			const offsetLeft = getOffsetLeft(tab, tabRect);

			const measures = {
				rect: tabRect,
				offsetLeft: offsetLeft
			};
			totalTabsWidth += measures.rect.width;
			return measures;
		});

		this._measures = {
			tabsContainerRect: this.shadowRoot.querySelector('.d2l-tabs-container').getBoundingClientRect(),
			tabsContainerListRect: this.shadowRoot.querySelector('.d2l-tabs-container-list').getBoundingClientRect(),
			tabRects: tabRects,
			totalTabsWidth: totalTabsWidth
		};
	}

	#updateScrollPosition(selectedTab) {
		const measures = this.#getMeasures();
		const newTranslationValue = this.#calculateScrollPosition(selectedTab, measures);
		return this.#updateScrollPositionLogic(measures, newTranslationValue);
	}

	#updateScrollVisibility(measures) {

		const lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
		if (!lastTabMeasures) {
			return Promise.resolve();
		}

		if (!this.#isRTL()) {
			// show/hide scroll buttons
			this._allowScrollPrevious = (this._translationValue < 0);
			this._allowScrollNext = (lastTabMeasures.offsetLeft + lastTabMeasures.rect.width + this._translationValue > measures.tabsContainerRect.width);
		} else {
			// show/hide scrolls buttons (rtl)
			this._allowScrollPrevious = (this._translationValue > 0);
			this._allowScrollNext = (lastTabMeasures.offsetLeft + this._translationValue < 0);
		}

		return this.updateComplete;
	}

	#updateTabListVisibility(tabs) {
		const visibleCount = tabs.filter(tab => !tab.hidden).length;
		if (this._state === 'shown' && visibleCount < 2) {
			this.#hideTabsList();
		} else if (this._state === 'hidden' && visibleCount > 1) {
			this.#showTabsList();
		} else if (this._state === 'shown' && visibleCount > 1) {
			// check if there are hidden tabs and tab list container should actually be hidden
			this.#handleTabHiddenChange();
		}
	}

	#updateTabsContainerWidth(selectedTab) {
		const tabs = this._tabs;
		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= tabs.length) return;
		if (tabs.indexOf(selectedTab) > this.maxToShow - 1) return;
		return this.#updateTabsContainerWidthLogic();
	}

	#calculateScrollPositionLogic(tabsDataStructure, selectedTabIndex, measures) {
		if (!measures.tabRects[selectedTabIndex]) return 0;

		const selectedTabMeasures = measures.tabRects[selectedTabIndex];

		const isOverflowingLeft = (selectedTabMeasures.offsetLeft + this._translationValue < 0);
		const isOverflowingRight = (selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + this._translationValue > measures.tabsContainerRect.width);

		const isRTL = this.#isRTL();

		let getNewTranslationValue;
		if (!isRTL) {
			getNewTranslationValue = () => {
				if (selectedTabIndex === 0) {
					// position selected tab at beginning
					return 0;
				} else if (selectedTabIndex === (tabsDataStructure.length - 1)) {
					// position selected tab at end
					return -1 * (selectedTabMeasures.offsetLeft - measures.tabsContainerRect.width + selectedTabMeasures.rect.width);
				} else {
					// position selected tab in middle
					return -1 * (selectedTabMeasures.offsetLeft - (measures.tabsContainerRect.width / 2) + (selectedTabMeasures.rect.width / 2));
				}
			};
		} else {
			getNewTranslationValue = () => {
				if (selectedTabIndex === 0) {
					// position selected tab at beginning
					return 0;
				} else if (selectedTabIndex === (tabsDataStructure.length - 1)) {
					// position selected tab at end
					return -1 * selectedTabMeasures.offsetLeft;
				} else {
					// position selected tab in middle
					return (measures.tabsContainerRect.width / 2) - (selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width / 2) + (selectedTabMeasures.rect.width / 2);
				}
			};
		}

		let newTranslationValue = this._translationValue;
		if (isOverflowingLeft || isOverflowingRight) {
			newTranslationValue = getNewTranslationValue();
		}

		let expectedPosition;

		// make sure the new position will not place selected tab behind left scroll button
		if (!isRTL) {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if (newTranslationValue < 0 && this.#isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if (newTranslationValue > 0 && this.#isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		if (!isRTL) {
			// make sure there will not be any empty space between left side of container and first tab
			if (newTranslationValue > 0) newTranslationValue = 0;
		} else {
			// make sure there will not be any empty space between right side of container and first tab
			if (newTranslationValue < 0) newTranslationValue = 0;
		}

		// make sure the new position will not place selected tab behind the right scroll button
		if (!isRTL) {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if ((selectedTabIndex < tabsDataStructure.length - 1) && this.#isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if ((selectedTabIndex < tabsDataStructure.length - 1) && this.#isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		return newTranslationValue;
	}

	#checkTabPanelMatch() {
		// debounce so only runs once when tabs/panels slots changing
		if (this.#checkTabPanelMatchRequested) return;

		this.#checkTabPanelMatchRequested = true;
		setTimeout(() => {
			if ((this._tabs && !this.#panels) || (this.#panels && !this._tabs)) {
				console.warn('d2l-tabs: tabs and panels are not in sync');
			} else if (this._tabs.length !== this.#panels.length) {
				console.warn('d2l-tabs: number of tabs and panels does not match');
			}
			this.#checkTabPanelMatchRequested = false;
		}, 0);
	}

	#handleTabDeselected(e) {
		const panel = this.#getPanel(e.target.id);
		if (panel) panel._selected = false;
	}

	#handleTabHiddenChange() {
		if (!this._tabs || this._tabs.length <= 1) return;

		let visibleTabCount = 0;
		this._tabs.forEach((tab) => {
			if (!tab.hidden) visibleTabCount++;
		});

		if (visibleTabCount > 1 && this._state === 'hidden') this.#showTabsList();
		else if (visibleTabCount <= 1 && this._state === 'shown') this.#hideTabsList();
	}

	#hideTabsList() {
		// don't animate the tabs list visibility if it's the inital render
		if (reduceMotion || !this._initialized || !isVisible(this)) {
			this._state = 'hidden';
		} else if (this.shadowRoot) {
			const layout = this.shadowRoot.querySelector('.d2l-tabs-layout');
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-height') return;
				layout.removeEventListener('transitionend', handleTransitionEnd);
				this._state = 'hidden';
			};
			layout.addEventListener('transitionend', handleTransitionEnd);
			this._state = 'anim';
		}
	}

	#isRTL() {
		return document.documentElement.getAttribute('dir') === 'rtl';
	}

	#setAriaControls() {
		// debounce so only runs once when tabs/panels slots changing
		if (this.#updateAriaControlsRequested) return;

		this.#updateAriaControlsRequested = true;
		setTimeout(() => {
			this._tabs?.forEach((tab) => {
				const panel = this.#getPanel(tab.id);
				if (!panel) {
					console.warn('d2l-tabs: tab without matching panel');
					return;
				}
				tab.setAttribute('aria-controls', `${panel.id}`);
			});
			this.#updateAriaControlsRequested = false;
		}, 0);
	}

	#showTabsList() {
		// don't animate the tabs list visibility if it's the inital render
		if (reduceMotion || !this._initialized) {
			this._state = 'shown';
		} else {
			this._state = 'anim';
			requestAnimationFrame(() => {
				this._state = 'shown';
			});
		}
	}

	#updateScrollPositionLogic(measures, newTranslationValue) {
		const scrollToPromise = this.#scrollToPosition(newTranslationValue);
		const scrollVisibilityPromise = this.#updateScrollVisibility(measures);
		const p = Promise.all([
			scrollVisibilityPromise,
			scrollToPromise
		]);
		p.then(() => {
			if (this._loadingCompleteResolve) {
				this._loadingCompleteResolve();
				this._loadingCompleteResolve = undefined;
			}
		});
		return p;
	}

	async #updateSelectedTab(selectedTab) {
		await this.updateComplete;

		selectedTab.selected = true;
		selectedTab.tabIndex = 0;

		const selectedPanel = this.#getPanel(selectedTab.id);
		if (selectedPanel) selectedPanel._selected = true;
		this._tabs.forEach((tab) => {
			if (tab.id !== selectedTab.id) {
				if (tab.selected) {
					tab.selected = false;
					const panel = this.#getPanel(tab.id);
					// panel may not exist if it's being removed
					if (panel) panel._selected = false;
				}
				if (tab.tabIndex === 0) tab.tabIndex = -1;
			}
		});
	}

	#updateTabsContainerWidthLogic() {
		const measures = this.#getMeasures();

		let maxWidth = 4; // initial value to allow for padding hack
		for (let i = 0; i < this.maxToShow; i++) {
			maxWidth += measures.tabRects[i].rect.width;
		}

		if (measures.tabsContainerListRect.width > maxWidth) {
			maxWidth += scrollButtonWidth;
		}

		if (maxWidth >= measures.tabsContainerRect.width) return;

		this._maxWidth = maxWidth;
		this._scrollCollapsed = true;
		this._measures = null;

		return this.updateComplete;
	}
}

customElements.define('d2l-tabs', Tabs);

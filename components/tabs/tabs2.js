import '../colors/colors.js';
import '../icons/icon.js';
import '../../helpers/queueMicrotask.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { ArrowKeysMixin } from '../../mixins/arrow-keys/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * TODO:
 * - add/remove animation
 * - move into tabs.js
 */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollButtonWidth = 56;

/**
 * A component for tabbed content. It supports the "d2l-tab-panel" component for the content, renders tabs responsively, and provides virtual scrolling for large tab lists.
 * @slot - Contains the tab panels (e.g., "d2l-tab-panel" components)
 * @slot ext - Additional content (e.g., a button) positioned at right
 * @fires d2l-tabs-initialized - Dispatched when the component is initialized
 */
class Tabs2 extends LocalizeCoreElement(ArrowKeysMixin(SkeletonMixin(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * Limit the number of tabs to initially display
			 * @type {number}
			 */
			maxToShow: { type: Number, attribute: 'max-to-show' },
			_allowScrollNext: { type: Boolean },
			_allowScrollPrevious: { type: Boolean },
			_maxWidth: { type: Number },
			_scrollCollapsed: { type: Boolean },
			_state: { type: String },
			_translationValue: {}
		};
	}

	static get styles() {
		return [super.styles, bodyCompactStyles, css`
			:host {
				--d2l-tabs-background-color: white;
				box-sizing: border-box;
				display: block;
				margin-bottom: 1.2rem;
				position: relative; /* necessary for offsetLeft measurement to be correct */
			}
			.d2l-tabs-layout {
				border-bottom: 1px solid var(--d2l-color-gypsum);
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
				overflow: hidden;
				overflow-x: hidden;
				padding-left: 3px;
				position: relative;
				-webkit-transition: max-width 200ms ease-in;
				transition: max-width 200ms ease-in;
				white-space: nowrap;
			}
			.d2l-tabs-container-ext {
				flex: none;
				padding-inline: 4px 0;
			}
			.d2l-tabs-container-list {
				display: flex;
				gap: 4px;
				-webkit-transition: transform 200ms ease-out;
				transition: transform 200ms ease-out;
				white-space: nowrap;
			}
			.d2l-tabs-scroll-previous-container,
			.d2l-tabs-scroll-next-container {
				background-color: var(--d2l-tabs-background-color);
				box-shadow: 0 0 12px 18px var(--d2l-tabs-background-color);
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
				background-color: var(--d2l-color-gypsum);
			}
			.d2l-tabs-scroll-button:${unsafeCSS(getFocusPseudoClass())} {
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}
			:host([skeleton]) .d2l-tabs-scroll-button {
				visibility: hidden;
			}
			.d2l-panels-container-no-whitespace ::slotted(*) {
				margin-top: 0;
				-webkit-transition: margin-top 200ms ease-out;
				transition: margin-top 200ms ease-out;
			}

			d2l-tab {
				-webkit-transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
				transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
			}
			d2l-tab[data-state="adding"], d2l-tab[data-state="removing"] {
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
				d2l-tab {
					-webkit-transition: none;
					transition: none;
				}

			}
		`];
	}

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
		this._translationValue = 0;

		this._tabs = [];
	}

	connectedCallback() {
		super.connectedCallback();

		queueMicrotask(() => {
			const bgColor = this._getComputedBackgroundColor();
			if (bgColor && bgColor !== 'rgb(255, 255, 255)' && bgColor !== 'rgba(255, 255, 255, 1)') {
				this.style.setProperty('--d2l-tabs-background-color', bgColor);
			}
		});

	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.arrowKeysFocusablesProvider = async() => {
			return this._getTabs();
		};

		this.arrowKeysOnBeforeFocus = async(tab) => {
			this._setFocusable(tab);

			this.requestUpdate();
			await this.updateComplete;

			if (!this._scrollCollapsed) {
				return this._updateScrollPosition(tab);
			} else {
				const measures = this._getMeasures();
				const newTranslationValue = this._calculateScrollPosition(tab, measures);

				if (this.dir !== 'rtl') {
					if (newTranslationValue >= 0) return;
				} else {
					if (newTranslationValue <= 0) return;
				}

				const expanded = await this._tryExpandTabsContainer(measures);
				if (expanded) {
					return;
				} else {
					return this._updateScrollPosition(tab);
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
							@click="${this._handleScrollPrevious}"
							title="${this.localize('components.tabs.previous')}">
							<d2l-icon icon="tier1:chevron-left"></d2l-icon>
						</button>
					</div>
					${this.arrowKeysContainer(html`
						<div class="d2l-tabs-container-list"
							@d2l-tab-change="${this._handleTabChange}"
							@d2l-tab-selected="${this._handleTabSelected}"
							@focusout="${this._handleFocusOut}"
							role="tablist"
							style="${styleMap(tabsContainerListStyles)}">
							<slot name="tabs" @slotchange="${this._handleTabsSlotChange}"></slot>
						</div>
					`)}
					<div class="d2l-tabs-scroll-next-container">
						<button class="d2l-tabs-scroll-button"
							@click="${this._handleScrollNext}"
							title="${this.localize('components.tabs.next')}">
							<d2l-icon icon="tier1:chevron-right"></d2l-icon>
						</button>
					</div>
				</div>
				<div class="d2l-tabs-container-ext"><slot name="ext"></slot></div>
			</div>
			<div class="${classMap(panelContainerClasses)}">
				<slot name="panels" @slotchange="${this._handlePanelsSlotChange}"></slot>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('skeleton')) {
			const tabs = this._getTabs();
			tabs.forEach(tab => {
				tab.skeleton = this.skeleton;
			});
		}
	}

	focus() {
		return this._focusSelected();
	}

	async getLoadingComplete() {
		return this._loadingCompletePromise;
	}

	getTabListRect() {
		if (!this.shadowRoot) return undefined;
		return this.shadowRoot.querySelector('.d2l-tabs-container-list').getBoundingClientRect();
	}

	_animateTabAddition(tab) {
		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				if (tab) tab.removeEventListener('transitionend', handleTransitionEnd);
				resolve();
			};
			if (tab) tab.addEventListener('transitionend', handleTransitionEnd);
			tab.state = '';
			this.requestUpdate();
		});
	}

	_animateTabRemoval(tab) {
		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				if (tab) tab.removeEventListener('transitionend', handleTransitionEnd);
				this.requestUpdate();
				resolve();
			};
			if (tab) tab.addEventListener('transitionend', handleTransitionEnd);
		});
	}

	// fine
	_calculateScrollPosition(selectedTab, measures) {

		const tabs = this._getTabs();
		const selectedTabIndex = tabs.indexOf(selectedTab);

		if (!measures.tabRects[selectedTabIndex]) return 0;

		const selectedTabMeasures = measures.tabRects[selectedTabIndex];

		const isOverflowingLeft = (selectedTabMeasures.offsetLeft + this._translationValue < 0);
		const isOverflowingRight = (selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + this._translationValue > measures.tabsContainerRect.width);

		let getNewTranslationValue;
		if (this.dir !== 'rtl') {
			getNewTranslationValue = () => {
				if (selectedTabIndex === 0) {
					// position selected tab at beginning
					return 0;
				} else if (selectedTabIndex === (tabs.length - 1)) {
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
				} else if (selectedTabIndex === (tabs.length - 1)) {
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
		if (this.dir !== 'rtl') {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if (newTranslationValue < 0 && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if (newTranslationValue > 0 && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		if (this.dir !== 'rtl') {
			// make sure there will not be any empty space between left side of container and first tab
			if (newTranslationValue > 0) newTranslationValue = 0;
		} else {
			// make sure there will not be any empty space between right side of container and first tab
			if (newTranslationValue < 0) newTranslationValue = 0;
		}

		// make sure the new position will not place selected tab behind the right scroll button
		if (this.dir !== 'rtl') {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if ((selectedTabIndex < tabs.length - 1) && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if ((selectedTabIndex < tabs.length - 1) && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		return newTranslationValue;

	}

	async _focusSelected() {
		const selectedTab = this._getTabs().find(ti => ti.selected);
		if (!selectedTab) return;

		await this._updateScrollPosition(selectedTab);

		selectedTab.focus();
	}

	_getComputedBackgroundColor() {
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

	_getMeasures() {
		if (!this._measures) this._updateMeasures();
		return this._measures;
	}

	_getPanel(tabId) {
		if (!this.shadowRoot) return;
		// use simple selector for slot (Edge)
		const slot = this.shadowRoot.querySelector('.d2l-panels-container').querySelector('slot');
		const panels = this._getPanels(slot);
		for (let i = 0; i < panels.length; i++) {
			if (panels[i].labelledBy === tabId) {
				return panels[i];
			}
		}
	}

	_getPanels(slot) {
		if (!slot) return;
		return slot.assignedNodes({ flatten: true })
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.role === 'tabpanel');
	}

	_getTabs() {
		return this._tabs;
	}

	_handleFocusOut(e) {
		if (e.relatedTarget && e.relatedTarget.role === 'tab') return;
		this._resetFocusables();
	}

	_handlePanelsSlotChange() {
		/**
		 * anything to do here? validation?
		 */
	}

	_handleResize(entries) {
		const measures = this._getMeasures();
		if (entries.length === 1 && entries[0].contentRect.width === measures.tabsContainerListRect.width) return;
		this._updateMeasures();
		this._updateScrollVisibility(this._getMeasures());
	}

	async _handleScrollNext() {

		const measures = this._getMeasures();

		const expanded = await this._tryExpandTabsContainer(measures);
		const newMeasures = expanded ? this._getMeasures() : measures;

		let newTranslationValue;
		const lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
		let isOverflowingNext;

		if (this.dir !== 'rtl') {

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

		await this._scrollToPosition(newTranslationValue);
		await this._updateScrollVisibility(newMeasures);

		if (!isOverflowingNext && this.shadowRoot) {
			this.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').focus();
		}

	}

	async _handleScrollPrevious() {

		const measures = this._getMeasures();

		const expanded = await this._tryExpandTabsContainer(measures);
		const newMeasures = expanded ? this._getMeasures() : measures;

		let newTranslationValue;
		let isOverflowingPrevious;

		if (this.dir !== 'rtl') {

			newTranslationValue = (this._translationValue + measures.tabsContainerRect.width - scrollButtonWidth);
			isOverflowingPrevious = (newTranslationValue < 0);
			if (!isOverflowingPrevious) newTranslationValue = 0;

		} else {

			newTranslationValue = (this._translationValue - measures.tabsContainerRect.width + scrollButtonWidth);
			isOverflowingPrevious = (newTranslationValue > 0);
			if (!isOverflowingPrevious) newTranslationValue = 0;

		}

		await this._scrollToPosition(newTranslationValue);
		await this._updateScrollVisibility(newMeasures);

		if (!isOverflowingPrevious && this.shadowRoot) {
			this.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button').focus();
		}
	}

	async _handleTabChange(e) {
		e.stopPropagation();
		this._updateMeasures();
		await this._updateScrollVisibility(this._getMeasures());
	}

	async _handleTabSelected(e) {
		e.stopPropagation();

		const selectedTab = e.target;
		const selectedPanel = this._getPanel(e.target.id);
		selectedTab.activeFocusable = true;

		await this.updateComplete;
		this._updateScrollPosition(selectedTab);

		selectedPanel.selected = true;
		this._getTabs().forEach(tab => {
			if (tab.id !== selectedTab.id) {
				if (tab.selected) {
					tab.selected = false;
					const panel = this._getPanel(tab.id);
					// panel may not exist if it's being removed
					if (panel) panel.selected = false;
				}
				if (tab.activeFocusable) tab.activeFocusable = false;
			}
		});

		this.requestUpdate();
	}

	async _handleTabsSlotChange(e) {
		this._updateTabs(e.target);
		const tabs = this._getTabs();

		// handle case where there are less than two tabs initially
		this._updateTabListVisibility(tabs);

		if (!this._initialized && tabs.length === 0) return;

		let selectedTab = null;
		tabs.forEach((tab) => {
			if (tab.selected) {
				selectedTab = tab;
				this._setFocusable(tab);
			}

			if (this.skeleton) {
				tab.skeleton = true;
			}
		});

		if (tabs.length > 0 && !selectedTab) {
			selectedTab = tabs.find((tab) => tab.state !== 'removing');
			if (selectedTab) {
				selectedTab.selected = true;
				selectedTab.activeFocusable = true;
			}
		}

		await this.updateComplete;

		const animPromises = [];
		if (!this._initialized && tabs.length > 0) {

			this._initialized = true;
			await this._updateTabsContainerWidth(selectedTab);
		} else {
			if (tabs.length > 1) {
				tabs.forEach((tab) => {
					if (tab.state === 'adding') animPromises.push(this._animateTabAddition(tab));
					else if (tab.state === 'removing') animPromises.push(this._animateTabRemoval(tab));
				});
			}

			// required for animation
			this._updateMeasures();
		}

		if (selectedTab) {
			// set corresponding panel to selected
			Promise.all(animPromises).then(() => {
				const selectedPanel = this._getPanel(selectedTab.id);
				if (selectedPanel)	selectedPanel.selected = true;
				this._updateMeasures();
				return this._updateScrollPosition(selectedTab);
			});
		}

		this.dispatchEvent(new CustomEvent(
			'd2l-tabs-initialized', { bubbles: true, composed: true }
		));
	}

	_isPositionInLeftScrollArea(position) {
		return position > 0 && position < scrollButtonWidth;
	}

	_isPositionInRightScrollArea(position, measures) {
		return (position > measures.tabsContainerRect.width - scrollButtonWidth) && (position < measures.tabsContainerRect.width);
	}

	_resetFocusables() {
		const selectedTab = this._getTabs().find(ti => ti.selected);
		if (selectedTab) this._setFocusable(selectedTab);
		this.requestUpdate();
	}

	_scrollToPosition(translationValue) {
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

	_setFocusable(tab) {
		const currentFocusable = this._getTabs().find(tab => tab.activeFocusable);
		if (currentFocusable) currentFocusable.activeFocusable = false;

		tab.activeFocusable = true;
	}

	async _tryExpandTabsContainer(measures) {

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

		await this._updateScrollVisibility(this._getMeasures());
		this._maxWidth = null;

		if (!this._allowScrollNext) {
			if (!this._allowScrollPrevious) {
				this._focusSelected();
			} else {
				if (this.shadowRoot) this.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').focus();
			}
		}

		await this.updateComplete;
		return true;
	}

	_updateMeasures() {
		let totalTabsWidth = 0;
		if (!this.shadowRoot) return;
		const tabs = this._getTabs();

		const tabRects = tabs.map((tab) => {
			const measures = {
				rect: tab.getBoundingClientRect(),
				offsetLeft: tab.offsetLeft
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

	_updateScrollPosition(selectedTab) {
		const measures = this._getMeasures();
		const newTranslationValue = this._calculateScrollPosition(selectedTab, measures);
		const scrollToPromise = this._scrollToPosition(newTranslationValue);
		const scrollVisibilityPromise = this._updateScrollVisibility(measures);
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

	_updateScrollVisibility(measures) {
		const lastTabMeasures = measures.tabRects[measures.tabRects.length - 1];
		if (!lastTabMeasures) {
			return Promise.resolve();
		}

		if (this.dir !== 'rtl') {
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

	_updateTabListVisibility(panels) {
		if (this._state === 'shown' && panels.length < 2) {
			// don't animate the tabs list visibility if it's the inital render
			if (reduceMotion || !this._initialized) {
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
		} else if (this._state === 'hidden' && panels.length > 1) {
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
	}

	_updateTabs(slot) {
		slot = slot || this.shadowRoot.querySelector('slot[name="tabs"]');
		this._tabs = slot.assignedNodes({ flatten: true })
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.role === 'tab');
	}

	_updateTabsContainerWidth(selectedTab) {
		const tabs = this._getTabs();
		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= tabs.length) return;
		if (tabs.indexOf(selectedTab) > this.maxToShow - 1) return;

		const measures = this._getMeasures();

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

customElements.define('d2l-tabs2', Tabs2);

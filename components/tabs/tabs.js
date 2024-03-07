import '../colors/colors.js';
import '../icons/icon.js';
import '../../helpers/queueMicrotask.js';
import './tab-internal.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { cssEscape, findComposedAncestor } from '../../helpers/dom.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { repeat } from 'lit/directives/repeat.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollButtonWidth = 56;

// remove once IE11 is no longer supported
if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, 'findIndex', {
		value: function(predicate) {

			if (this === null) throw new TypeError('"this" is null or not defined');

			const o = Object(this);
			const len = o.length >>> 0;

			if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

			const thisArg = arguments[1];
			let k = 0;

			while (k < len) {
				const kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) return k;
				k++;
			}

			return -1;
		},
		configurable: true,
		writable: true
	});
}

/**
 * A component for tabbed content. It supports the "d2l-tab-panel" component for the content, renders tabs responsively, and provides virtual scrolling for large tab lists.
 * @slot - Contains the tab panels (e.g., "d2l-tab-panel" components)
 * @slot ext - Additional content (e.g., a button) positioned at right
 * @fires d2l-tabs-initialized - Dispatched when the component is initialized
 */
class Tabs extends LocalizeCoreElement(LoadingCompleteMixin(ArrowKeysMixin(SkeletonMixin(RtlMixin(LitElement))))) {

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
			_tabInfos: { type: Array },
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
				padding-left: 4px;
			}
			:host([dir="rtl"]) .d2l-tabs-container-ext {
				padding-left: 0;
				padding-right: 4px;
			}
			.d2l-tabs-container-list {
				display: block;
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
				left: 0;
				margin-left: 4px;
			}
			:host([dir="rtl"]) .d2l-tabs-scroll-previous-container {
				left: auto;
				margin-left: 0;
				margin-right: 4px;
				right: 0;
			}
			.d2l-tabs-container[data-allow-scroll-previous] > .d2l-tabs-scroll-previous-container {
				display: inline-block;
			}
			.d2l-tabs-scroll-next-container {
				margin-right: 4px;
				right: 0;
			}
			:host([dir="rtl"]) .d2l-tabs-scroll-next-container {
				left: 0;
				margin-left: 4px;
				margin-right: 0;
				right: auto;
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

			d2l-tab-internal {
				-webkit-transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
				transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
			}
			d2l-tab-internal[data-state="adding"], d2l-tab-internal[data-state="removing"] {
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
				d2l-tab-internal {
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
		this._maxWidth = null;
		this._scrollCollapsed = false;
		this._state = 'shown';
		this._tabInfos = [];
		this._translationValue = 0;
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
		console.log('First render');

		this.arrowKeysFocusablesProvider = async() => {
			return [...this.shadowRoot.querySelectorAll('d2l-tab-internal')];
		};

		this.arrowKeysOnBeforeFocus = async(tab) => {
			const tabInfo = this._getTabInfo(tab.controlsPanel);
			this._setFocusable(tabInfo);

			this.requestUpdate();
			await this.updateComplete;

			if (!this._scrollCollapsed) {
				return this._updateScrollPosition(tabInfo);
			} else {
				const measures = this._getMeasures();
				const newTranslationValue = this._calculateScrollPosition(tabInfo, measures);

				if (this.dir !== 'rtl') {
					if (newTranslationValue >= 0) return;
				} else {
					if (newTranslationValue <= 0) return;
				}

				const expanded = await this._tryExpandTabsContainer(measures);
				if (expanded) {
					return;
				} else {
					return this._updateScrollPosition(tabInfo);
				}
			}
		};

		this._handleResize = this._handleResize.bind(this);
		this._resizeObserver = new ResizeObserver(this._handleResize);
		this._resizeObserver.observe(this.shadowRoot.querySelector('.d2l-tabs-container-list'));

		await this.loadingComplete;
		console.log('Loading complete');
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
							@d2l-tab-selected="${this._handleTabSelected}"
							@focusout="${this._handleFocusOut}"
							role="tablist"
							style="${styleMap(tabsContainerListStyles)}">
							${repeat(this._tabInfos, (tabInfo) => tabInfo.id, (tabInfo) => html`
								<d2l-tab-internal aria-selected="${tabInfo.selected ? 'true' : 'false'}"
									.controlsPanel="${tabInfo.id}"
									data-state="${tabInfo.state}"
									?skeleton="${this.skeleton}"
									tabindex="${tabInfo.activeFocusable ? 0 : -1}"
									text="${tabInfo.text}">
								</d2l-tab-internal>
							`)}
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
			<div class="${classMap(panelContainerClasses)}"
				@d2l-tab-panel-selected="${this._handlePanelSelected}"
				@d2l-tab-panel-text-changed="${this._handlePanelTextChange}">
				<slot @slotchange="${this._handlePanelsSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		return this._focusSelected();
	}

	getTabListRect() {
		if (!this.shadowRoot) return undefined;
		return this.shadowRoot.querySelector('.d2l-tabs-container-list').getBoundingClientRect();
	}

	_animateTabAddition(tabInfo) {
		const tab = this.shadowRoot
			&& this.shadowRoot.querySelector(`d2l-tab-internal[controls-panel="${cssEscape(tabInfo.id)}"]`);
		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				if (tab) tab.removeEventListener('transitionend', handleTransitionEnd);
				resolve();
			};
			if (tab) tab.addEventListener('transitionend', handleTransitionEnd);
			tabInfo.state = '';
			this.requestUpdate();
		});
	}

	_animateTabRemoval(tabInfo) {
		const tab = this.shadowRoot &&
			this.shadowRoot.querySelector(`d2l-tab-internal[controls-panel="${cssEscape(tabInfo.id)}"]`);
		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				if (tab) tab.removeEventListener('transitionend', handleTransitionEnd);
				this._tabInfos.splice(this._tabInfos.findIndex(info => info.id === tabInfo.id), 1);
				this.requestUpdate();
				resolve();
			};
			if (tab) tab.addEventListener('transitionend', handleTransitionEnd);
		});
	}

	_calculateScrollPosition(selectedTabInfo, measures) {

		const selectedTabIndex = this._tabInfos.indexOf(selectedTabInfo);

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
				} else if (selectedTabIndex === (this._tabInfos.length - 1)) {
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
				} else if (selectedTabIndex === (this._tabInfos.length - 1)) {
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
			if ((selectedTabIndex < this._tabInfos.length - 1) && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if ((selectedTabIndex < this._tabInfos.length - 1) && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		}

		return newTranslationValue;

	}

	async _focusSelected() {
		const selectedTab = this.shadowRoot && this.shadowRoot.querySelector('d2l-tab-internal[aria-selected="true"]');
		if (!selectedTab) return;

		const selectedTabInfo = this._getTabInfo(selectedTab.controlsPanel);
		await this._updateScrollPosition(selectedTabInfo);

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

	_getPanel(id) {
		if (!this.shadowRoot) return;
		// use simple selector for slot (Edge)
		const slot = this.shadowRoot.querySelector('.d2l-panels-container').querySelector('slot');
		const panels = this._getPanels(slot);
		for (let i = 0; i < panels.length; i++) {
			if (panels[i].nodeType === Node.ELEMENT_NODE && panels[i].role === 'tabpanel' && panels[i].id === id) {
				return panels[i];
			}
		}
	}

	_getPanels(slot) {
		if (!slot) return;
		return slot.assignedNodes({ flatten: true })
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.role === 'tabpanel');
	}

	_getTabInfo(id) {
		if (this._tabInfos.find) {
			return this._tabInfos.find((t) => t.id === id);
		} else {
			// IE11
			const index = this._tabInfos.findIndex((t) => t.id === id);
			return index !== -1 ? this._tabInfos[index] : null;
		}
	}

	_handleFocusOut(e) {
		if (e.relatedTarget && e.relatedTarget.role === 'tab') return;
		this._resetFocusables();
	}

	_handlePanelSelected(e) {
		const tabInfo = this._getTabInfo(e.target.id);
		// event could be from nested tabs
		if (!tabInfo) return;

		this._setFocusable(tabInfo);
		tabInfo.selected = true;
		this.requestUpdate();
	}

	async _handlePanelsSlotChange(e) {

		const panels = this._getPanels(e.target);

		// handle case where there are less than two tabs initially
		this._updateTabListVisibility(panels);

		if (!this._initialized && panels.length === 0) return;

		let selectedTabInfo = null;

		const newTabInfos = panels.map((panel) => {
			let state = '';
			if (this._initialized && !reduceMotion && panels.length !== this._tabInfos.length) {
				// if it's a new tab, update state to animate addition
				if (this._tabInfos.findIndex(info => info.id === panel.id) === -1) {
					state = 'adding';
				}
			}
			const tabInfo = {
				id: panel.id,
				text: panel.text,
				selected: panel.selected,
				state: state
			};
			if (tabInfo.selected) {
				selectedTabInfo = tabInfo;
				this._setFocusable(tabInfo);
			}
			return tabInfo;
		});

		if (this._initialized && !reduceMotion && this._tabInfos.length !== newTabInfos.length) {
			this._tabInfos.forEach((info, index) => {
				// if a tab was removed, include old info to animate it away
				if (newTabInfos.findIndex(newInfo => newInfo.id === info.id) === -1) {
					info.state = 'removing';
					info.selected = false;
					newTabInfos.splice(index, 0, info);
				}
			});
		}
		this._tabInfos = newTabInfos;

		if (this._tabInfos.length > 0 && !selectedTabInfo) {
			selectedTabInfo = this._tabInfos.find(tabInfo => tabInfo.state !== 'removing');
			if (selectedTabInfo) {
				selectedTabInfo.activeFocusable = true;
				selectedTabInfo.selected = true;
			}
		}

		await this.updateComplete;

		const animPromises = [];
		if (!this._initialized && this._tabInfos.length > 0) {

			this._initialized = true;
			await this._updateTabsContainerWidth(selectedTabInfo);

		} else {

			if (this._tabInfos.length > 1) {
				this._tabInfos.forEach((info) => {
					if (info.state === 'adding') animPromises.push(this._animateTabAddition(info));
					else if (info.state === 'removing') animPromises.push(this._animateTabRemoval(info));
				});
			}

			// required for animation
			this._updateMeasures();
		}

		if (selectedTabInfo) {
			Promise.all(animPromises).then(() => {
				this._updateMeasures();
				return this._updateScrollPosition(selectedTabInfo);
			});
		}

		this.dispatchEvent(new CustomEvent(
			'd2l-tabs-initialized', { bubbles: true, composed: true }
		));

	}

	async _handlePanelTextChange(e) {
		const tabInfo = this._getTabInfo(e.target.id);
		// event could be from nested tabs
		if (!tabInfo) return;
		tabInfo.text = e.target.text;
		this.requestUpdate();
		await this.updateComplete;
		this._updateMeasures();
		await this._updateScrollVisibility(this._getMeasures());
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

	async _handleTabSelected(e) {
		e.stopPropagation();

		const selectedTab = e.target;
		const selectedPanel = this._getPanel(selectedTab.controlsPanel);
		const selectedTabInfo = this._getTabInfo(selectedTab.controlsPanel);
		selectedTabInfo.activeFocusable = true;

		await this.updateComplete;
		this._updateScrollPosition(selectedTabInfo);

		selectedPanel.selected = true;
		this._tabInfos.forEach((tabInfo) => {
			if (tabInfo.id !== selectedTab.controlsPanel) {
				if (tabInfo.selected) {
					tabInfo.selected = false;
					const panel = this._getPanel(tabInfo.id);
					// panel may not exist if it's being removed
					if (panel) panel.selected = false;
				}
				if (tabInfo.activeFocusable) tabInfo.activeFocusable = false;
			}
		});

		this.requestUpdate();
	}

	_isPositionInLeftScrollArea(position) {
		return position > 0 && position < scrollButtonWidth;
	}

	_isPositionInRightScrollArea(position, measures) {
		return (position > measures.tabsContainerRect.width - scrollButtonWidth) && (position < measures.tabsContainerRect.width);
	}

	_resetFocusables() {
		const selectedTab = this._tabInfos.find(ti => ti.selected);
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

	_setFocusable(tabInfo) {
		const currentFocusable = this._tabInfos.find(ti => ti.activeFocusable);
		if (currentFocusable) currentFocusable.activeFocusable = false;

		tabInfo.activeFocusable = true;
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
		const tabs = [...this.shadowRoot.querySelectorAll('d2l-tab-internal')];

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

	async _updateScrollPosition(selectedTabInfo) {
		const measures = this._getMeasures();
		const newTranslationValue = this._calculateScrollPosition(selectedTabInfo, measures);
		const scrollToPromise = this._scrollToPosition(newTranslationValue);
		const scrollVisibilityPromise = this._updateScrollVisibility(measures);
		return Promise.all([
			scrollVisibilityPromise,
			scrollToPromise,
		]).then(() => new Promise(r => setTimeout(r, 5000))).then(this.resolveLoadingComplete);
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

	_updateTabsContainerWidth(selectedTabInfo) {
		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= this._tabInfos.length) return;
		if (this._tabInfos.indexOf(selectedTabInfo) > this.maxToShow - 1) return;

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

customElements.define('d2l-tabs', Tabs);

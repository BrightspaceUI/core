import '../colors/colors.js';
import '../icons/icon.js';
import '../../helpers/queueMicrotask.js';
import './tab-internal.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { cssEscape, findComposedAncestor, getOffsetParent } from '../../helpers/dom.js';
import { getFocusPseudoClass, getFocusRingStyles } from '../../helpers/focus.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFlag } from '../../helpers/flags.js';
import { getOverflowDeclarations } from '../../helpers/overflow.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { repeat } from 'lit/directives/repeat.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const overflowClipEnabled = getFlag('GAUD-7887-core-components-overflow-clipping', true);
const newTabStructure = getFlag('GAUD-7146-tabs-new-structure', true);

const scrollButtonWidth = 56;

function getOffsetLeft(tab, tabRect) {
	const offsetParent = getOffsetParent(tab);
	return Math.round(tabRect.left - offsetParent.getBoundingClientRect().left);
}

/**
 * A component for tabbed content. It supports the "d2l-tab" component and "TabMixin" consumers for tabs, the "d2l-tab-panel" component for the tab content, renders tabs responsively, and provides virtual scrolling for large tab lists.
 * @slot - DEPRECATED: Contains the tab panels (e.g., "d2l-tab-panel" components)
 * @slot ext - Additional content (e.g., a button) positioned at right
 * @slot tabs - Contains the tabs (e.g., "d2l-tab" components or custom components that use `TabMixin`)
 * @slot panels - Contains the tab panels (e.g., "d2l-tab-panel" components)
 */
class Tabs extends LocalizeCoreElement(ArrowKeysMixin(SkeletonMixin(LitElement))) {

	static get properties() {
		return {
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
			_defaultSlotBehavior: { state: true },
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
				padding-left: 3px;
				position: relative;
				-webkit-transition: max-width 200ms ease-in;
				transition: max-width 200ms ease-in;
				${overflowClipEnabled ? getOverflowDeclarations({ textOverflow: 'clip' }) : css`
					overflow: hidden;
					overflow-x: hidden;
					white-space: nowrap;
				`}
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
				${overflowClipEnabled ? css`clip-path: rect(0% 200% 100% -100%);` : css``}
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
			${getFocusRingStyles('.d2l-tabs-scroll-button')}
			:host([skeleton]) .d2l-tabs-scroll-button {
				visibility: hidden;
			}
			.d2l-panels-container-no-whitespace ::slotted(*) {
				margin-top: 0;
				-webkit-transition: margin-top 200ms ease-out;
				transition: margin-top 200ms ease-out;
			}

			d2l-tab-internal, ::slotted([role="tab"]) {
				-webkit-transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
				transition: max-width 200ms ease-out, opacity 200ms ease-out, transform 200ms ease-out;
			}
			d2l-tab-internal[data-state="adding"],
			d2l-tab-internal[data-state="removing"],
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
				d2l-tab-internal, ::slotted([role="tab"]) {
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
					border-inline-start: 1px solid var(--d2l-color-gypsum);
					padding-inline-start: 11px;
				}
				.d2l-tabs-scroll-previous-container {
					border-inline-end: 1px solid var(--d2l-color-gypsum);
					padding-inline-end: 11px;
				}
			}
		`];
	}

	constructor() {
		super();
		this.maxToShow = -1;
		this._allowScrollNext = false;
		this._allowScrollPrevious = false;
		this._defaultSlotBehavior = true; // remove after d2l-tab/d2l-tab-panel backport
		this._loadingCompleteResolve = undefined;
		this._loadingCompletePromise = new Promise(resolve => this._loadingCompleteResolve = resolve);
		this._maxWidth = null;
		this._scrollCollapsed = false;
		this._state = 'shown';
		this._tabIds = {};
		this._tabInfos = []; // remove after d2l-tab/d2l-tab-panel backport
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.arrowKeysFocusablesProvider = async() => {
			return this._defaultSlotBehavior ? [...this.shadowRoot.querySelectorAll('d2l-tab-internal')] : this._tabs;
		};

		this.arrowKeysOnBeforeFocus = async(tab) => {
			if (this._defaultSlotBehavior) {
				// remove this section after d2l-tab/d2l-tab-panel backport
				const tabInfo = this._getTabInfo(tab.controlsPanel);
				this._setFocusableDefaultSlotBehavior(tabInfo);

				this.requestUpdate();
				await this.updateComplete;

				if (!this._scrollCollapsed) {
					return this._updateScrollPositionDefaultSlotBehavior(tabInfo);
				} else {
					const measures = this._getMeasures();
					const newTranslationValue = this._calculateScrollPositionDefaultSlotBehavior(tabInfo, measures);

					if (!this.#isRTL()) {
						if (newTranslationValue >= 0) return;
					} else {
						if (newTranslationValue <= 0) return;
					}

					const expanded = await this._tryExpandTabsContainer(measures);
					if (expanded) {
						return;
					} else {
						return this._updateScrollPositionDefaultSlotBehavior(tabInfo);
					}
				}
			} else {
				this._setFocusable(tab);

				this.requestUpdate();
				await this.updateComplete;

				if (!this._scrollCollapsed) {
					return this._updateScrollPosition(tab);
				} else {
					const measures = this._getMeasures();
					const newTranslationValue = this._calculateScrollPosition(tab, measures);

					if (!this.#isRTL()) {
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
							@d2l-tab-content-change="${this._handleTabContentChange}"
							@d2l-tab-selected="${this._handleTabSelected}"
							@d2l-tab-deselected="${this.#handleTabDeselected}"
							@focusout="${this._handleFocusOut}"
							aria-label="${ifDefined(this.text)}"
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
			<div class="${classMap(panelContainerClasses)}"
				@d2l-tab-panel-selected="${this._handlePanelSelected}"
				@d2l-tab-panel-text-changed="${this._handlePanelTextChange}">
				<slot @slotchange="${this._handleDefaultSlotChange}"></slot>
				<slot name="panels" @slotchange="${this._handlePanelsSlotChange}"></slot>
			</div>
		`;
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

	hideTab(tab) {
		tab.setAttribute('data-state', 'removing');
		return (Object.keys(this._tabIds).length > 1 && !reduceMotion) ? this._animateTabRemoval(tab) : Promise.resolve();
	}

	#checkTabPanelMatchRequested;
	#panels;
	#updateAriaControlsRequested;

	_animateTabAddition(tab) {
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

	// remove after d2l-tab/d2l-tab-panel backport
	_animateTabAdditionDefaultSlotBehavior(tabInfo) {
		const tab = this.shadowRoot
			&& this.shadowRoot.querySelector(`d2l-tab-internal[controls-panel="${cssEscape(tabInfo.id)}"]`);
		if (!tab) Promise.resolve();

		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				tab.removeEventListener('transitionend', handleTransitionEnd);
				resolve();
			};
			tab.addEventListener('transitionend', handleTransitionEnd);
			tabInfo.state = '';
			this.requestUpdate();
		});
	}

	_animateTabRemoval(tab) {
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

	// remove after d2l-tab/d2l-tab-panel backport
	_animateTabRemovalDefaultSlotBehavior(tabInfo) {
		const tab = this.shadowRoot &&
			this.shadowRoot.querySelector(`d2l-tab-internal[controls-panel="${cssEscape(tabInfo.id)}"]`);
		if (!tab) Promise.resolve();

		return new Promise((resolve) => {
			const handleTransitionEnd = (e) => {
				if (e.propertyName !== 'max-width') return;
				tab.removeEventListener('transitionend', handleTransitionEnd);
				this._tabInfos.splice(this._tabInfos.findIndex(info => info.id === tabInfo.id), 1);
				this.requestUpdate();
				resolve();
			};
			tab.addEventListener('transitionend', handleTransitionEnd);
		});
	}

	_calculateScrollPosition(selectedTab, measures) {
		const tabs = this._tabs;
		const selectedTabIndex = tabs.indexOf(selectedTab);
		return this.#calculateScrollPositionLogic(tabs, selectedTabIndex, measures);
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_calculateScrollPositionDefaultSlotBehavior(selectedTabInfo, measures) {
		const selectedTabIndex = this._tabInfos.indexOf(selectedTabInfo);
		return this.#calculateScrollPositionLogic(this._tabInfos, selectedTabIndex, measures);
	}

	async _focusSelected() {
		if (this._defaultSlotBehavior) {
			this._focusSelectedDefaultSlotBehavior();
			return;
		}

		const selectedTab = this._tabs.find(ti => ti.selected);
		if (!selectedTab) return;

		await this._updateScrollPosition(selectedTab);

		selectedTab.focus();
	}

	// remove after d2l-tab/d2l-tab-panel backport
	async _focusSelectedDefaultSlotBehavior() {
		const selectedTab = this.shadowRoot && this.shadowRoot.querySelector('d2l-tab-internal[aria-selected="true"]');
		if (!selectedTab) return;

		const selectedTabInfo = this._getTabInfo(selectedTab.controlsPanel);
		await this._updateScrollPositionDefaultSlotBehavior(selectedTabInfo);

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
		if (this._defaultSlotBehavior) return this._getPanelDefaultSlotBehavior(id);

		if (!this.#panels) return;
		return this.#panels.find(panel => panel.labelledBy === id);
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_getPanelDefaultSlotBehavior(id) {
		if (!this.shadowRoot) return;
		// use simple selector for slot (Edge)
		const slot = this.shadowRoot.querySelector('.d2l-panels-container').querySelector('slot');
		const panels = this._getPanelsDefaultSlotBehavior(slot);
		for (let i = 0; i < panels.length; i++) {
			if (panels[i].nodeType === Node.ELEMENT_NODE && panels[i].role === 'tabpanel' && panels[i].id === id) {
				return panels[i];
			}
		}
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_getPanelsDefaultSlotBehavior(slot) {
		if (!slot) return;
		return slot.assignedElements({ flatten: true }).filter((node) => node.role === 'tabpanel');
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_getTabInfo(id) {
		return this._tabInfos.find((t) => t.id === id);
	}

	async _handleDefaultSlotChange(e) {
		if (!this._defaultSlotBehavior) return;

		const panels = this._getPanelsDefaultSlotBehavior(e.target);

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
				this._setFocusableDefaultSlotBehavior(tabInfo);
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
			await this._updateTabsContainerWidthDefaultSlotBehavior(selectedTabInfo);

		} else {

			if (this._tabInfos.length > 1) {
				this._tabInfos.forEach((info) => {
					if (info.state === 'adding') animPromises.push(this._animateTabAdditionDefaultSlotBehavior(info));
					else if (info.state === 'removing') animPromises.push(this._animateTabRemovalDefaultSlotBehavior(info));
				});
			}

			// required for animation
			this._updateMeasures();
		}

		if (selectedTabInfo) {
			Promise.all(animPromises).then(() => {
				this._updateMeasures();
				return this._updateScrollPositionDefaultSlotBehavior(selectedTabInfo);
			});
		}

	}

	_handleFocusOut(e) {
		if (e.relatedTarget && e.relatedTarget.role === 'tab') return;
		this._resetFocusables();
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_handlePanelSelected(e) {
		if (!this._defaultSlotBehavior) return;

		const tabInfo = this._getTabInfo(e.target.id);
		// event could be from nested tabs
		if (!tabInfo) return;

		this._setFocusableDefaultSlotBehavior(tabInfo);
		tabInfo.selected = true;
		this.requestUpdate();
	}

	_handlePanelsSlotChange(e) {
		if (this._defaultSlotBehavior) return;

		this.#panels = e.target.assignedElements({ flatten: true }).filter((node) => node.role === 'tabpanel');
		this.#checkTabPanelMatch();
		this.#setAriaControls();
	}

	// remove after d2l-tab/d2l-tab-panel backport
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

		if (!this.#isRTL()) {

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

	async _handleTabContentChange() {
		this._updateMeasures();
		await this._updateScrollVisibility(this._getMeasures());
	}

	async _handleTabSelected(e) {
		if (this._defaultSlotBehavior) {
			this._handleTabSelectedDefaultSlotBehavior(e);
			return;
		}

		const selectedTab = e.target;
		this.#updateSelectedTab(selectedTab);
		await this.updateComplete;
		this._updateScrollPosition(selectedTab);
	}

	// remove after d2l-tab/d2l-tab-panel backport
	async _handleTabSelectedDefaultSlotBehavior(e) {
		e.stopPropagation();

		const selectedTab = e.target;
		const selectedPanel = this._getPanel(selectedTab.controlsPanel);
		const selectedTabInfo = this._getTabInfo(selectedTab.controlsPanel);
		selectedTabInfo.activeFocusable = true;

		await this.updateComplete;
		this._updateScrollPositionDefaultSlotBehavior(selectedTabInfo);

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

	async _handleTabsSlotChange(e) {
		this._defaultSlotBehavior = false;

		this._tabs = e.target.assignedElements({ flatten: true }).filter((node) => node.role === 'tab');

		// handle case where there are less than two tabs initially
		this._updateTabListVisibility(this._tabs);

		if (!this._initialized && this._tabs.length === 0) return;

		let selectedTab = null;
		const newTabIds = {};
		this._tabs?.forEach((tab) => {
			if (this._initialized && !reduceMotion && this._tabs.length !== Object.keys(this._tabIds).length) {
				// if it's a new tab, update state to animate addition
				if (!this._tabIds[tab.id]) {
					this._tabIds[tab.id] = true;
					tab.setAttribute('data-state', 'adding');
				}
			}
			if (!selectedTab && tab.selected && tab.getAttribute('data-state') !== 'removing') {
				selectedTab = tab;
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
			await this._updateTabsContainerWidth(selectedTab);
		} else {
			if (this._tabs.length > 1) {
				this._tabs.forEach((tab) => {
					if (tab.getAttribute('data-state') === 'adding') animPromises.push(this._animateTabAddition(tab));
				});
			}
			this._updateMeasures();
		}

		if (selectedTab) {
			Promise.all(animPromises).then(() => {
				this._updateMeasures();
				this._updateScrollPosition(selectedTab);
			});
		}
	}

	_isPositionInLeftScrollArea(position) {
		return position > 0 && position < scrollButtonWidth;
	}

	_isPositionInRightScrollArea(position, measures) {
		return (position > measures.tabsContainerRect.width - scrollButtonWidth) && (position < measures.tabsContainerRect.width);
	}

	_resetFocusables() {
		if (this._defaultSlotBehavior) {
			const selectedTab = this._tabInfos.find(ti => ti.selected);
			if (selectedTab) this._setFocusableDefaultSlotBehavior(selectedTab);
		} else {
			const selectedTab = this._tabs.find(ti => ti.selected);
			if (selectedTab) this._setFocusable(selectedTab);
		}
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
		const currentFocusable = this._tabs.find(tab => tab.tabIndex === 0);
		if (currentFocusable) currentFocusable.tabIndex = -1;

		tab.tabIndex = 0;
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_setFocusableDefaultSlotBehavior(tabInfo) {
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
		const tabs = this._defaultSlotBehavior ? [...this.shadowRoot.querySelectorAll('d2l-tab-internal')] : this._tabs;

		const tabRects = tabs.map((tab) => {
			const tabRect = tab.getBoundingClientRect();
			const offsetLeft = this._defaultSlotBehavior ? tab.offsetLeft : getOffsetLeft(tab, tabRect);

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

	_updateScrollPosition(selectedTab) {
		const measures = this._getMeasures();
		const newTranslationValue = this._calculateScrollPosition(selectedTab, measures);
		return this.#updateScrollPositionLogic(measures, newTranslationValue);
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_updateScrollPositionDefaultSlotBehavior(selectedTabInfo) {
		const measures = this._getMeasures();
		const newTranslationValue = this._calculateScrollPositionDefaultSlotBehavior(selectedTabInfo, measures);
		return this.#updateScrollPositionLogic(measures, newTranslationValue);
	}

	_updateScrollVisibility(measures) {

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

	_updateTabsContainerWidth(selectedTab) {
		const tabs = this._tabs;
		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= tabs.length) return;
		if (tabs.indexOf(selectedTab) > this.maxToShow - 1) return;
		return this.#updateTabsContainerWidthLogic();
	}

	// remove after d2l-tab/d2l-tab-panel backport
	_updateTabsContainerWidthDefaultSlotBehavior(selectedTabInfo) {
		if (!this.maxToShow || this.maxToShow <= 0 || this.maxToShow >= this._tabInfos.length) return;
		if (this._tabInfos.indexOf(selectedTabInfo) > this.maxToShow - 1) return;
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
			if (newTranslationValue < 0 && this._isPositionInLeftScrollArea(expectedPosition)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + selectedTabMeasures.rect.width + newTranslationValue;
			if (newTranslationValue > 0 && this._isPositionInRightScrollArea(expectedPosition, measures)) {
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
			if ((selectedTabIndex < tabsDataStructure.length - 1) && this._isPositionInRightScrollArea(expectedPosition, measures)) {
				newTranslationValue = getNewTranslationValue();
			}
		} else {
			expectedPosition = selectedTabMeasures.offsetLeft + newTranslationValue;
			if ((selectedTabIndex < tabsDataStructure.length - 1) && this._isPositionInLeftScrollArea(expectedPosition)) {
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
		if (!newTabStructure) return;

		const panel = this._getPanel(e.target.id);
		if (panel) panel.selected = false;
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
				const panel = this._getPanel(tab.id);
				if (!panel) {
					console.warn('d2l-tabs: tab without matching panel');
					return;
				}
				tab.setAttribute('aria-controls', `${panel.id}`);
			});
			this.#updateAriaControlsRequested = false;
		}, 0);
	}

	#updateScrollPositionLogic(measures, newTranslationValue) {
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

	async #updateSelectedTab(selectedTab) {
		await this.updateComplete;

		selectedTab.selected = true;
		selectedTab.tabIndex = 0;

		const selectedPanel = this._getPanel(selectedTab.id);
		if (selectedPanel) selectedPanel.selected = true;
		this._tabs.forEach((tab) => {
			if (tab.id !== selectedTab.id) {
				if (tab.selected) {
					tab.selected = false;
					const panel = this._getPanel(tab.id);
					// panel may not exist if it's being removed
					if (panel) panel.selected = false;
				}
				if (tab.tabIndex === 0) tab.tabIndex = -1;
			}
		});
	}

	#updateTabsContainerWidthLogic() {
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

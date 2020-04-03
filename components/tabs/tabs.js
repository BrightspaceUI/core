import '../colors/colors.js';
import '../icons/icon.js';
import '../../helpers/queueMicrotask.js';
import './tab-internal.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { repeat } from 'lit-html/directives/repeat';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollButtonWidth = 56;

class Tabs extends LocalizeStaticMixin(ArrowKeysMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
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
		return [bodyCompactStyles, css`
			:host {
				--d2l-tabs-background-color: white;
				box-sizing: border-box;
				display: block;
				margin-bottom: 1.2rem;
			}
			.d2l-tabs-layout {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				width: 100%;
				display: none;
				max-height: 0;
				opacity: 0;
				transform: translateY(-10px);
				-webkit-transition: max-height 200ms ease-out, transform 200ms ease-out, opacity 200ms ease-out;
				transition: max-height 200ms ease-out, transform 200ms ease-out, opacity 200ms ease-out;
			}
			.d2l-tabs-layout-anim {
				display: flex;
			}
			.d2l-tabs-layout-shown {
				display: flex;
				max-height: 49px;
				opacity: 1;
				transform: translateY(0);
			}
			.d2l-tabs-container {
				box-sizing: border-box;
				flex: auto;
				overflow: hidden;
				overflow-x: hidden;
				margin-left: -3px;
				padding-left: 3px;
				position: relative;
				white-space: nowrap;
				-webkit-transition: max-width 200ms ease-in;
				transition: max-width 200ms ease-in;
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
				white-space: nowrap;
				-webkit-transition: transform 200ms ease-out;
				transition: transform 200ms ease-out;
			}
			.d2l-tabs-focus-start,
			.d2l-tabs-focus-end {
				position: absolute;
				left: 0;
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
			.d2l-tabs-container[allow-scroll-previous] > .d2l-tabs-scroll-previous-container {
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
			.d2l-tabs-container[allow-scroll-next] > .d2l-tabs-scroll-next-container {
				display: inline-block;
			}
			.d2l-tabs-scroll-button {
				background-color: transparent;
				border: 1px solid transparent;
				border-radius: 15px;
				box-shadow: 0 0 0 4px rgba(0, 0, 0, 0);
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
			.d2l-tabs-scroll-button[disabled]:focus {
				background-color: transparent;
			}
			.d2l-tabs-scroll-button:hover,
			.d2l-tabs-scroll-button:focus {
				background-color: var(--d2l-color-gypsum);
			}
			.d2l-tabs-scroll-button:focus {
				border-color: var(--d2l-color-celestine);
			}
			.d2l-panels-container-no-whitespace ::slotted(*) {
				margin-top: 0;
				-webkit-transition: margin-top 200ms ease-out;
				transition: margin-top 200ms ease-out;
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

			}
		`];
	}

	static get resources() {
		return {
			'ar': { 'scroll.previous': 'التمرير إلى اليسار', 'scroll.next':'التمرير إلى اليمين' },
			'en': { 'scroll.previous': 'Scroll Backward', 'scroll.next': 'Scroll Forward' },
			'es': { 'scroll.previous': 'Desplácese a la izquierda', 'scroll.next': 'Desplácese a la derecha' },
			'fr': { 'scroll.previous': 'Défilement vers la gauche', 'scroll.next': 'Défilement vers la droite' },
			'ja': { 'scroll.previous': '左にスクロール', 'scroll.next': '右にスクロール' },
			'ko': { 'scroll.previous': '왼쪽으로 스크롤', 'scroll.next': '오른쪽으로 스크롤' },
			'nl': { 'scroll.previous': 'Naar links schuiven', 'scroll.next': 'Naar rechts schuiven' },
			'pt': { 'scroll.previous': 'Rolar para Esquerda', 'scroll.next': 'Rolar para Direita' },
			'sv': { 'scroll.previous': 'Rulla till vänster', 'scroll.next': 'Rulla till höger' },
			'tr': { 'scroll.previous': 'Sola Kaydır', 'scroll.next': 'Sağa Kaydır' },
			'zh': { 'scroll.previous': '向左滚动', 'scroll.next': '向右滚动' },
			'zh-tw': { 'scroll.previous': '向左捲動', 'scroll.next': '向右捲動' }
		};
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.arrowKeysFocusablesProvider = async() => {
			return [...this.shadowRoot.querySelectorAll('d2l-tab-internal')];
		};

		this.arrowKeysOnBeforeFocus = async(tab) => {
			const tabInfo = this._getTabInfo(tab.controlsPanel);
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

	}

	focus() {
		return this._focusSelected();
	}

	getTabListRect() {
		return this.shadowRoot.querySelector('.d2l-tabs-container-list').getBoundingClientRect();
	}

	render() {

		const tabsLayoutClasses = {
			'd2l-tabs-layout': true,
			'd2l-body-compact': true,
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
				<div ?allow-scroll-next="${this._allowScrollNext}"
					?allow-scroll-previous="${this._allowScrollPrevious}"
					class="d2l-tabs-container"
					?scroll-collapsed="${this._scrollCollapsed}"
					style="${styleMap(tabsContainerStyles)}">
					<div class="d2l-tabs-scroll-previous-container">
						<button class="d2l-tabs-scroll-button"
							@click="${this._handleScrollPrevious}"
							title="${this.localize('scroll.previous')}">
							<d2l-icon icon="tier1:chevron-left"></d2l-icon>
						</button>
					</div>
					<span class="d2l-tabs-focus-start" @focus="${this._handleFocusStart}" tabindex="0"></span>
					${this.arrowKeysContainer(html`
						<div class="d2l-tabs-container-list"
							@d2l-tab-selected="${this._handleTabSelected}"
							role="tablist"
							style="${styleMap(tabsContainerListStyles)}">
							${repeat(this._tabInfos, (tabInfo) => tabInfo.id, (tabInfo) => html`
								<d2l-tab-internal aria-selected="${tabInfo.selected ? 'true' : 'false'}"
									.controlsPanel="${tabInfo.id}"
									text="${tabInfo.text}">
								</d2l-tab-internal>
							`)}
						</div>
					`)}
					<span class="d2l-tabs-focus-end" @focus="${this._handleFocusEnd}" tabindex="0"></span>
					<div class="d2l-tabs-scroll-next-container">
						<button class="d2l-tabs-scroll-button"
							@click="${this._handleScrollNext}"
							title="${this.localize('scroll.next')}">
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

	_calculateScrollPosition(selectedTabInfo, measures) {

		const selectedTabIndex = this._tabInfos.indexOf(selectedTabInfo);
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
		const selectedTab = this.shadowRoot.querySelector('d2l-tab-internal[aria-selected="true"]');
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
		return slot.assignedNodes({flatten: true})
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.role === 'tabpanel');
	}

	_getTabInfo(id) {
		return this._tabInfos.find((t) => t.id === id);
	}

	_handleFocusEnd(e) {
		if (e.relatedTarget && e.relatedTarget.role !== 'tab') {
			this._focusSelected();
		} else {
			const nextFocusable = getNextFocusable(e.target, false);
			if (nextFocusable) nextFocusable.focus();
		}
	}

	_handleFocusStart(e) {
		if (e.relatedTarget && e.relatedTarget.role === 'tab') {
			const previousFocusable = getPreviousFocusable(e.target, false);
			if (previousFocusable) previousFocusable.focus();
		} else {
			this._focusSelected();
		}
	}

	async _handlePanelsSlotChange(e) {

		const panels = this._getPanels(e.target);
		/*
		// do fancy remove the panels
		const removedPanels = this._tabInfos.filter(info => {
			for (let i = 0; i < panels.length; i++) {
				if (panels[i].id === info.id) return false;
			}
			return true;
		});
		*/

		// consider hidden panels?

		if (this._initialized) {
			if (this._state === 'shown' && panels.length < 2) {
				if (reduceMotion) {
					this._state = 'hidden';
				} else {
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
				if (reduceMotion) {
					this._state = 'shown';
				} else {
					this._state = 'anim';
					requestAnimationFrame(() => {
						this._state = 'shown';
					});
				}
			}
		}

		let selectedTabInfo = null;
		this._tabInfos = [];
		panels.forEach(panel => {
			const tabInfo = {
				id: panel.id,
				text: panel.text,
				selected: panel.selected
			};
			if (tabInfo.selected) selectedTabInfo = tabInfo;
			this._tabInfos.push(tabInfo);
		});

		if (!this._initialized && this._tabInfos.length > 0) {
			this._initialized = true;
			if (!selectedTabInfo) {
				this._tabInfos[0].selected = true;
				selectedTabInfo = this._tabInfos[0];
			}

			await this.updateComplete;
			await this._updateTabsContainerWidth(selectedTabInfo);
			this._updateMeasures();
			await this._updateScrollPosition(selectedTabInfo);
		} else {
			await this.updateComplete;
			this._updateMeasures();
		}

		this.dispatchEvent(new CustomEvent(
			'd2l-tabs-initialized', { bubbles: true, composed: true }
		));

	}

	_handlePanelSelected(e) {
		this._getTabInfo(e.target.id).selected = true;
		this.requestUpdate();
	}

	async _handlePanelTextChange(e) {
		this._getTabInfo(e.target.id).text = e.target.text;
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

		if (!isOverflowingNext) {
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

		if (!isOverflowingPrevious) {
			this.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button').focus();
		}

	}

	async _handleTabSelected(e) {
		e.stopPropagation();

		const selectedTab = e.target;
		const selectedPanel = this._getPanel(selectedTab.controlsPanel);
		const selectedTabInfo = this._getTabInfo(selectedTab.controlsPanel);

		await this.updateComplete;
		this._updateScrollPosition(selectedTabInfo);

		selectedPanel.selected = true;
		this._tabInfos.forEach((tabInfo) => {
			if (tabInfo.selected && tabInfo.id !== selectedTab.controlsPanel) {
				tabInfo.selected = false;
				this._getPanel(tabInfo.id).selected = false;
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
				const tabsContainer = this.shadowRoot.querySelector('.d2l-tabs-container');
				const handleTransitionEnd = (e) => {
					if (e.propertyName !== 'max-width') return;
					tabsContainer.removeEventListener('transitionend', handleTransitionEnd);
					resolve();
				};
				tabsContainer.addEventListener('transitionend', handleTransitionEnd);
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
				this.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').focus();
			}
		}

		await this.updateComplete;
		return true;
	}

	_updateMeasures() {
		let totalTabsWidth = 0;
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

	_updateScrollPosition(selectedTabInfo) {
		const measures = this._getMeasures();
		const newTranslationValue = this._calculateScrollPosition(selectedTabInfo, measures);
		const scrollToPromise = this._scrollToPosition(newTranslationValue);
		const scrollVisibilityPromise = this._updateScrollVisibility(measures);

		return Promise.all([
			scrollVisibilityPromise,
			scrollToPromise
		]);
	}

	_scrollToPosition(translationValue) {
		if (translationValue === this._translationValue) {
			return Promise.resolve();
		}

		this._translationValue = translationValue;
		if (reduceMotion) return this.updateComplete;

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

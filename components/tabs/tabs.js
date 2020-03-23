import '../colors/colors.js';
import '../icons/icon.js';
import '../../helpers/queueMicrotask.js';
import './tab.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import {repeat} from 'lit-html/directives/repeat';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

//const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

//const scrollButtonWidth = 56;

class Tabs extends LocalizeStaticMixin(ArrowKeysMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			maxToShow: { type: Number },
			_tabInfos: { type: Array }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				--d2l-tabs-background-color: white;
				box-sizing: border-box;
				display: block;
			}
			.d2l-tabs-layout {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				display: flex;
				width: 100%;
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
				-webkit-transition: box-shadow 0.2s;
				transition: box-shadow 0.2s;
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

			@media (prefers-reduced-motion: reduce) {

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
		this._tabInfos = [];
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
		/*
		this.arrowKeysOnBeforeFocus = async(tab) => {

			if the scroll is collapsed
				calculate the new translation value
				if RTL and new translation value is >= 0 then return
				if LTR and new translation value is <= 0 then return

				try to expand the tabs container then...
				if it was expanded then return
				if it was not expanded then update the virtual scroll position
			else
				update the virtual scroll position so that the browser doesn't force a scroll

		};
		*/
	}

	render() {
		return html`
			<div class="d2l-tabs-layout d2l-body-compact">
				<div class="d2l-tabs-container">
					<div class="d2l-tabs-scroll-previous-container">
						<button class="d2l-tabs-scroll-button" title="${this.localize('scroll.previous')}"><d2l-icon icon="tier1:chevron-left"></d2l-icon></button>
					</div>
					<span class="d2l-tabs-focus-start" @focus="${this._handleFocusStart}" tabindex="0"></span>
					${this.arrowKeysContainer(html`
						<div class="d2l-tabs-container-list"
							@d2l-tab-selected="${this._handleTabSelected}"
							role="tablist">
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
						<button class="d2l-tabs-scroll-button" title="${this.localize('scroll.next')}"><d2l-icon icon="tier1:chevron-right"></d2l-icon></button>
					</div>
				</div>
				<div class="d2l-tabs-container-ext"><slot name="ext"></slot></div>
			</div>
			<div class="d2l-panels-container"
				@d2l-tab-panel-selected="${this._handlePanelSelected}"
				@d2l-tab-panel-text-changed="${this._handlePanelTextChange}">
				<slot @slotchange="${this._handlePanelsSlotChange}"></slot>
			</div>
		`;
	}

	_focusSelected() {
		const selectedTab = this.shadowRoot.querySelector('d2l-tab-internal[aria-selected="true"]');
		if (selectedTab) {
			/*
				update the virtual scroll position so that the browser doesn't force a scroll then...
			*/
			selectedTab.focus();
		}
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

	_handlePanelsSlotChange(e) {

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
			}
			/*
				update the tabs container width then...
				update the virtual scroll position to bring the selected tab into view
			*/
		}

		/*
			wait for init then dispatch d2l-tabs-initialized event
		*/

	}

	_handlePanelSelected(e) {
		this._getTabInfo(e.target.id).selected = true;
		this.requestUpdate();
	}

	_handlePanelTextChange() {
		/*
			update text of the corrsponding d2l-tab
			update measurements
			update virtual scroll button visibility
		*/
	}

	_handleTabSelected(e) {
		e.stopPropagation();
		const selectedTab = e.target;
		const selectedPanel = this._getPanel(selectedTab.controlsPanel);

		/*
			update the virtual scroll position to bring selected tab into view
		*/

		selectedPanel.selected = true;
		this._tabInfos.forEach((tabInfo) => {
			if (tabInfo.selected && tabInfo.id !== selectedTab.controlsPanel) {
				tabInfo.selected = false;
				this._getPanel(tabInfo.id).selected = false;
			}
		});
		this.requestUpdate();
	}

}

customElements.define('d2l-tabs', Tabs);

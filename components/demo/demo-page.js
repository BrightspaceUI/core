import './demo-flags.js';
import '../button/button.js';
import './demo-snippet.js';
import '../inputs/input-checkbox-group.js';
import '../inputs/input-checkbox.js';
import './code-view.js';
import '../collapsible-panel/collapsible-panel.js';
import '../collapsible-panel/collapsible-panel-summary-item.js';
import '../colors/colors.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit';
import { getDocumentLocaleSettings, supportedLocalesDetails } from '@brightspace-ui/intl/lib/common.js';
import { classMap } from 'lit/directives/class-map.js';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { selectStyles } from '../inputs/input-select-styles.js';

document.body.classList.add('d2l-typography');

window.isD2LDemoPage = true;

(async() => {
	const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
	await Promise.all([
		customElements.whenDefined('d2l-demo-page'),
		fontsPromise
	]);
	document.body.removeAttribute('unresolved');
})();

class DemoPage extends LitElement {

	static get properties() {
		return {
			pageTitle: { type: String, attribute: 'page-title' },
			_flagOverrides: { state: true },
			_knownFlags: { state: true },
			_noScroll: { state: true }
		};
	}

	static get styles() {
		return [ inputLabelStyles, selectStyles, css`
			:host {
				background-color: var(--d2l-color-sylvite);
				display: block;
				padding: 30px;
			}
			main.no-scroll {
				height: 0;
				overflow: hidden;
				padding: 0;
			}
			header {
				align-items: center;
				display: flex;
				margin-bottom: 1.5rem;
				max-width: 900px;
			}
			d2l-collapsible-panel {
				width: 100%;
			}
			.d2l-input-label {
				margin-bottom: 0;
			}
			.d2l-demo-page-content > ::slotted(h2),
			.d2l-demo-page-content > ::slotted(h3) {
				font-size: 0.8rem;
				font-weight: 700;
				line-height: 1.2rem;
				margin: 1.5rem 0 1.5rem 0;
			}

			.d2l-demo-page-content > ::slotted(d2l-code-view),
			.d2l-demo-page-content > ::slotted(d2l-demo-snippet) {
				margin-bottom: 36px;
			}

			#applyFlagsButton {
				margin-block-start: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this._flagOverrides = new Map();
		this._knownFlags = new Map();
		this.#handleFlagsKnownBound = this.#handleFlagsKnown.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		const title = document.createElement('title');
		title.textContent = this.pageTitle;
		document.head.insertBefore(title, document.head.firstChild);
		document.addEventListener('d2l-flags-known', this.#handleFlagsKnownBound);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('d2l-flags-known', this.#handleFlagsKnownBound);
	}

	render() {
		const classes = {
			'no-scroll': this._noScroll
		};
		let selectedLanguageCode = getDocumentLocaleSettings().language;
		if (selectedLanguageCode === 'en') selectedLanguageCode = 'en-us';
		let foundSelected = false;
		const languageOptions = supportedLocalesDetails.map((l) => {
			const selected = !foundSelected && l.code.startsWith(selectedLanguageCode);
			foundSelected = foundSelected || selected;
			return html`<option value="${l.code}" ?selected="${selected}">${l.code} - ${l.name}</option>`;
		});

		const knownFlagCheckboxes = [];
		this._knownFlags.forEach((knownFlag, key) => {
			knownFlagCheckboxes.push(html`<d2l-input-checkbox label="${key}" data-flag-key="${key}" ?checked="${knownFlag.value}"></d2l-input-checkbox>`);
		});

		const flagOverrideItems = [];
		this._flagOverrides.forEach((value, key) => {
			flagOverrideItems.push(html`<d2l-collapsible-panel-summary-item slot="summary" text="${key} overridden (${value})"></d2l-collapsible-panel-summary-item>`);
		});

		return html`
			<header>
				<d2l-collapsible-panel panel-title="${this.pageTitle}" heading-level="1" heading-style="3" type="subtle">
					<label class="d2l-input-label" slot="actions">
						Language:
						<select class="d2l-input-select" @change="${this.#handleLanguageChange}">${languageOptions}</select>
					</label>
					${knownFlagCheckboxes.length > 0 ? html`
						<d2l-input-checkbox-group id="flagsCheckboxGroup" label="Flags">
							${knownFlagCheckboxes}
						</d2l-input-checkbox-group>
					` : 'No known flags'}
					<d2l-button id="applyFlagsButton" @click="${this.#handleApplyFlagsClick}">Apply</d2l-button>
					${flagOverrideItems}
				</d2l-collapsible-panel>
			</header>
			<main class="${classMap(classes)}">
				<div class="d2l-demo-page-content" @d2l-demo-snippet-fullscreen-toggle="${this.#handleFullscreenToggle}"><slot></slot></div>
			</main>
		`;
	}

	#handleFlagsKnownBound;

	#handleApplyFlagsClick() {
		const urlParams = new URLSearchParams(window.location.search);
		const elems = [...this.shadowRoot.querySelectorAll('#flagsCheckboxGroup > d2l-input-checkbox')];

		elems.forEach(elem => {
			const key = elem.dataset.flagKey;
			const flag = this._knownFlags.get(key);

			if (flag.defaultValue === elem.checked) {
				urlParams.delete(`demo-flag-${key}`);
			} else if (flag.defaultValue !== elem.checked) {
				urlParams.set(`demo-flag-${key}`, elem.checked);
			}
		});

		window.location.search = urlParams.toString();
	}

	#handleFlagsKnown(e) {
		this._flagOverrides = e.detail.flagOverrides;
		this._knownFlags = e.detail.knownFlags;
	}

	async #handleFullscreenToggle() {
		if (this._noScroll) {
			this._noScroll = false;
			await this.updateComplete;
			document.documentElement.scrollTop = this._previousScrollTop;
		}
		else {
			this._previousScrollTop = document.documentElement.scrollTop;
			this._noScroll = true;
		}
	}

	#handleLanguageChange(e) {
		const newLanguageCode = e.target[e.target.selectedIndex].value;
		document.documentElement.dir = newLanguageCode === 'ar-sa' ? 'rtl' : 'ltr';
		document.documentElement.lang = newLanguageCode;
	}

}

customElements.define('d2l-demo-page', DemoPage);

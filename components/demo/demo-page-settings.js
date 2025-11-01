import './demo-flags.js';
import '../button/button.js';
import '../inputs/input-checkbox-group.js';
import '../inputs/input-checkbox.js';
import '../inputs/input-group.js';
import '../collapsible-panel/collapsible-panel.js';
import '../collapsible-panel/collapsible-panel-summary-item.js';
import { css, html, LitElement, nothing } from 'lit';
import { getDocumentLocaleSettings, supportedLocalesDetails } from '@brightspace-ui/intl/lib/common.js';
import { getFlagOverrides, getKnownFlags } from '../../helpers/flags.js';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { selectStyles } from '../inputs/input-select-styles.js';

const localeSettings = getDocumentLocaleSettings();

class DemoPageSettings extends LitElement {

	static get properties() {
		return {
			pageTitle: { type: String, attribute: 'page-title' },
			_language: { state: true }
		};
	}

	static get styles() {
		return [ inputLabelStyles, selectStyles, css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
			d2l-collapsible-panel {
				width: 100%;
			}
			#applyFlagsButton {
				margin-block-start: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this.#handleFlagsKnownBound = this.#handleFlagsKnown.bind(this);
		this.#handleDocumentLanguageChangeBound = this.#handleDocumentLanguageChange.bind(this);
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('lang')) {
			const newLanguageCode = urlParams.get('lang');
			document.documentElement.dir = newLanguageCode === 'ar-sa' ? 'rtl' : 'ltr';
			document.documentElement.lang = newLanguageCode;
			this._language = newLanguageCode;
		} else {
			this._language = getDocumentLocaleSettings().language;
		}
	}

	connectedCallback() {
		super.connectedCallback();
		document.addEventListener('d2l-flags-known', this.#handleFlagsKnownBound);
		localeSettings.addChangeListener(this.#handleDocumentLanguageChangeBound);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('d2l-flags-known', this.#handleFlagsKnownBound);
		localeSettings.removeChangeListener(this.#handleDocumentLanguageChangeBound);
	}

	render() {

		let selectedLanguageCode = this._language;
		if (selectedLanguageCode === 'en') selectedLanguageCode = 'en-us';
		let foundSelected = false;
		const languageOptions = supportedLocalesDetails.map((l) => {
			const selected = !foundSelected && l.code.startsWith(selectedLanguageCode);
			foundSelected = foundSelected || selected;
			return html`<option value="${l.code}" ?selected="${selected}">${l.code} - ${l.name}</option>`;
		});
		let languageItem = nothing;
		if (selectedLanguageCode !== 'en-us') {
			languageItem = html`<d2l-collapsible-panel-summary-item slot="summary" text="Language: ${selectedLanguageCode}"></d2l-collapsible-panel-summary-item>`;
		}

		const knownFlags = this.#getKnownFlagsSorted();
		const knownFlagCheckboxes = [];
		knownFlags.forEach((knownFlag, key) => {
			knownFlagCheckboxes.push(html`<d2l-input-checkbox label="${key}" data-flag-key="${key}" ?checked="${knownFlag.value}"></d2l-input-checkbox>`);
		});

		const flagOverrides = getFlagOverrides();
		const flagOverrideItems = [];
		flagOverrides.forEach((value, key) => {
			const knownFlag = knownFlags.get(key);
			const defaultValue = knownFlag ? knownFlag.defaultValue : 'unknown';
			flagOverrideItems.push(html`<d2l-collapsible-panel-summary-item slot="summary" text="${key} (default: ${defaultValue}; override: ${value})"></d2l-collapsible-panel-summary-item>`);
		});

		return html`
			<d2l-collapsible-panel panel-title="${this.pageTitle}" heading-level="1" heading-style="3" type="subtle">
				<d2l-input-group>
					<label>
						<span class="d2l-input-label">Language</span>
						<select class="d2l-input-select" @change="${this.#handleLanguageChange}">${languageOptions}</select>
					</label>
					${knownFlagCheckboxes.length > 0 ? html`
						<d2l-input-checkbox-group id="flagsCheckboxGroup" label="Flags">
							${knownFlagCheckboxes}
						</d2l-input-checkbox-group>
						<d2l-button id="applyFlagsButton" @click="${this.#handleApplyFlagsClick}">Apply</d2l-button>
					` : 'No known flags'}
				</d2l-input-group>
				${languageItem}
				${flagOverrideItems}
			</d2l-collapsible-panel>
		`;
	}

	#handleDocumentLanguageChangeBound;
	#handleFlagsKnownBound;

	#getKnownFlagsSorted() {
		return new Map([...getKnownFlags().entries()].sort((entry1, entry2) => {
			const key1 = entry1[0].toLowerCase();
			const key2 = entry2[0].toLowerCase();
			if (key1 < key2) return -1;
			else if (key1 > key2) return 1;
			else return 0;
		}));
	}

	#handleApplyFlagsClick() {
		const urlParams = new URLSearchParams(window.location.search);
		const elems = [...this.shadowRoot.querySelectorAll('#flagsCheckboxGroup > d2l-input-checkbox')];

		const knownFlags = getKnownFlags();
		elems.forEach(elem => {
			const key = elem.dataset.flagKey;
			const flag = knownFlags.get(key);

			if (flag.defaultValue === elem.checked) {
				urlParams.delete(`demo-flag-${key}`);
			} else if (flag.defaultValue !== elem.checked) {
				urlParams.set(`demo-flag-${key}`, elem.checked);
			}
		});

		window.location.search = urlParams.toString();
	}

	#handleDocumentLanguageChange() {
		this._language = localeSettings.language;
		const url = new URL(window.location.href);
		if (this._language === 'en-us') {
			url.searchParams.delete('lang');
		} else {
			url.searchParams.set('lang', this._language);
		}
		window.history.replaceState({}, '', url.toString());
	}

	#handleFlagsKnown() {
		this.requestUpdate();
	}

	#handleLanguageChange(e) {
		const newLanguageCode = e.target[e.target.selectedIndex].value;
		document.documentElement.dir = newLanguageCode === 'ar-sa' ? 'rtl' : 'ltr';
		document.documentElement.lang = newLanguageCode;
	}

}

customElements.define('d2l-demo-page-settings', DemoPageSettings);

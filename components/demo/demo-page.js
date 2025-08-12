import './demo-flags.js';
import './demo-snippet.js';
import './code-view.js';
import '../button/button.js';
import '../collapsible-panel/collapsible-panel.js';
import '../collapsible-panel/collapsible-panel-summary-item.js';
import '../colors/colors.js';
import '../inputs/input-checkbox-group.js';
import '../inputs/input-checkbox.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit';
import { getDocumentLocaleSettings, supportedLocalesDetails } from '@brightspace-ui/intl/lib/common.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFlag } from '../../helpers/flags.js';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { selectStyles } from '../inputs/input-select-styles.js';

const { flags } = await import('/generated/flags.js').catch(() => { return { flags: [] } ; });
flags.forEach(flag => {
	flag.value = getFlag(flag.name, flag.defaultValue);
});

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
			#applyFlagsButton {
				margin-block-start: 1rem;
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
		`];
	}

	connectedCallback() {
		super.connectedCallback();
		const title = document.createElement('title');
		title.textContent = this.pageTitle;
		document.head.insertBefore(title, document.head.firstChild);
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

		const flagOverrides = flags.filter(flag => flag.value !== flag.defaultValue);

		return html`
			<header>
				<d2l-collapsible-panel panel-title="${this.pageTitle}" heading-level="1" heading-style="3" type="subtle">
					${ flagOverrides.map(flag => {
						return html`<d2l-collapsible-panel-summary-item slot="summary" text="${flag.name} overridden (${flag.value})"></d2l-collapsible-panel-summary-item>`;
					})}
					<label class="d2l-input-label" slot="actions">
						Language:
						<select class="d2l-input-select" @change="${this._handleLanguageChange}">${languageOptions}</select>
					</label>
					${flags.length > 0 ? html`
						<d2l-input-checkbox-group id="flagsCheckboxGroup" label="Flags">
							${flags.map(flag => {
								return html`<d2l-input-checkbox label="${flag.name}" data-flag-name="${flag.name}" ?checked="${flag.value}"></d2l-input-checkbox>`;
							})}
						</d2l-input-checkbox-group>
					` : `No Flags`}
					<d2l-button id="applyFlagsButton" @click="${this._handleApplyFlagsClick}">Apply</d2l-button>
				</d2l-collapsible-panel>
			</header>
			<main class="${classMap(classes)}">
				<div class="d2l-demo-page-content" @d2l-demo-snippet-fullscreen-toggle="${this._handleFullscreenToggle}"><slot></slot></div>
			</main>
		`;
	}

	_handleApplyFlagsClick() {
		const urlParams = new URLSearchParams(window.location.search);
		const elems = [...this.shadowRoot.querySelectorAll('#flagsCheckboxGroup > d2l-input-checkbox')];

		elems.forEach(elem => {
			const flag = flags.find(flag => flag.name === elem.dataset.flagName);
			if (flag.defaultValue === elem.checked) {
				urlParams.delete(flag.name);
			} else if (flag.defaultValue !== elem.checked) {
				urlParams.set(flag.name, elem.checked);
			}
		});

		window.location.search = urlParams.toString();
	}

	async _handleFullscreenToggle() {
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

	_handleLanguageChange(e) {
		const newLanguageCode = e.target[e.target.selectedIndex].value;
		document.documentElement.dir = newLanguageCode === 'ar-sa' ? 'rtl' : 'ltr';
		document.documentElement.lang = newLanguageCode;
	}

}

customElements.define('d2l-demo-page', DemoPage);

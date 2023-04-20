import './demo-snippet.js';
import './code-view.js';
import '../colors/colors.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit';
import { getDocumentLocaleSettings, supportedLocalesDetails } from '@brightspace-ui/intl/lib/common.js';
import { classMap } from 'lit/directives/class-map.js';
import { heading2Styles } from '../typography/styles.js';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { selectStyles } from '../inputs/input-select-styles.js';

document.body.classList.add('d2l-typography');

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
		return [ heading2Styles, inputLabelStyles, selectStyles, css`
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
			.d2l-heading-2 {
				flex-grow: 1;
				margin: 0;
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
		return html`
			<header>
				<h1 class="d2l-heading-2">${this.pageTitle}</h1>
				<label class="d2l-input-label">
					Language: 
					<select class="d2l-input-select" @change="${this._handleLanguageChange}">${languageOptions}</select>
				</label>
			</header>
			<main class="${classMap(classes)}">
				<div class="d2l-demo-page-content" @d2l-demo-snippet-fullscreen-toggle="${this._handleFullscreenToggle}"><slot></slot></div>
			</main>
		`;
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
		getDocumentLocaleSettings().language = newLanguageCode;
	}

}

customElements.define('d2l-demo-page', DemoPage);

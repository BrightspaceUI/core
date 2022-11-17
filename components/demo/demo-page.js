import './demo-snippet.js';
import './code-view.js';
import '../colors/colors.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { heading2Styles } from '../typography/styles.js';

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
		return [ heading2Styles, css`
			:host {
				background-color: var(--d2l-color-background-base);
				display: block;
				padding: 30px;
			}
			main.no-scroll {
				height: 0;
				overflow: hidden;
				padding: 0;
			}
			.d2l-heading-2 {
				margin-top: 0;
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
		return html`
			<main class="${classMap(classes)}">
				<h1 class="d2l-heading-2">${this.pageTitle}</h1>
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
}

customElements.define('d2l-demo-page', DemoPage);

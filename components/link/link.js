import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { linkStyles } from './link-styles.js';

class Link extends LitElement {

	static get properties() {
		return {
			ariaLabel: { stype: String, attribute: 'aria-label' },
			download: { type: Boolean },
			href: { type: String },
			main: { type: Boolean, reflect: true },
			small: { type: Boolean, reflect: true },
			target: { type: String }
		};
	}

	static get styles() {
		return [ linkStyles,
			css`
				:host {
					display: inline;
				}
				:host([hidden]) {
					display: none;
				}
				:host([small]) {
					/* needed to keep host element same height as link */
					font-size: 0.7rem;
					line-height: 1.05rem;
				}
			`
		];
	}

	constructor() {
		super();
		this.main = false;
		this.small = false;
	}

	render() {
		return html`
			<a class="d2l-link"
				aria-label="${ifDefined(this.ariaLabel)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				?main="${this.main}"
				?small="${this.small}"
				target="${ifDefined(this.target)}"><slot></slot></a>
		`;
	}

	focus() {
		const link = this.shadowRoot.querySelector('.d2l-link');
		if (link) link.focus();
	}
}
customElements.define('d2l-link', Link);

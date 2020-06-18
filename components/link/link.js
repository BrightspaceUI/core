import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		text-decoration: none;
		cursor: pointer;
	}
	.d2l-link:hover, .d2l-link:focus {
		color: var(--d2l-color-celestine-minus-1);
		text-decoration: underline;
		outline-width: 0;
	}
	.d2l-link.d2l-link-main {
		font-weight: 700;
	}
	.d2l-link.d2l-link-small {
		font-size: 0.7rem;
		line-height: 1.05rem;
		letter-spacing: 0.01rem;
	}
`;

class Link extends LitElement {

	static get properties() {
		return {
			ariaLabel: { type: String, attribute: 'aria-label' },
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
		const linkClasses = {
			'd2l-link': true,
			'd2l-link-main': this.main,
			'd2l-link-small': this.small
		};
		return html`<a
				aria-label="${ifDefined(this.ariaLabel)}"
				class="${classMap(linkClasses)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				target="${ifDefined(this.target)}"><slot></slot></a>`;
	}

	focus() {
		const link = this.shadowRoot.querySelector('.d2l-link');
		if (link) link.focus();
	}
}
customElements.define('d2l-link', Link);

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { linkStyles } from '../../link/link.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestLink extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			type: { type: String },
			width: { type: Number }
		};
	}

	static get styles() {
		return [
			super.styles,
			linkStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
		this.type = 'normal';
	}

	render() {
		const classes = {
			'd2l-link': true,
			'd2l-link-main': this.type === 'main',
			'd2l-link-small': this.type === 'small',
			'd2l-skeletize': true
		};
		if (this.width !== undefined) {
			classes[`d2l-skeletize-${this.width}`] = true;
		}
		return html`<a href="https://d2l.com" class="${classMap(classes)}">Link (${this.type})</a>`;
	}
}

customElements.define('d2l-test-skeleton-link', SkeletonTestLink);

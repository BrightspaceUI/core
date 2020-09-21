import { bodyCompactStyles, bodySmallStyles, bodyStandardStyles, labelStyles } from '../../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestParagraph extends SkeletonMixin(LitElement) {

	static get properties() {
		return {
			lines: { type: Number },
			type: { type: String }
		};
	}

	static get styles() {
		return [
			super.styles,
			bodyStandardStyles,
			bodyCompactStyles,
			bodySmallStyles,
			labelStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
		this.type = 'standard';
	}

	render() {
		const classes = {
			'd2l-body-standard': this.type === 'standard',
			'd2l-body-compact': this.type === 'compact',
			'd2l-body-small': this.type === 'small',
			'd2l-label-text': this.type === 'label',
			'd2l-skeletize': this.lines !== 2 && this.lines !== 3 && this.lines !== 5,
			'd2l-skeletize-paragraph-2': this.lines === 2,
			'd2l-skeletize-paragraph-3': this.lines === 3,
			'd2l-skeletize-paragraph-5': this.lines === 5
		};
		if (this.lines) {
			return html`<p class="${classMap(classes)}">${this.type} ${this.lines}-line</p>`;
		} else {
			return html`<span class="${classMap(classes)}">${this.type}</span>`;
		}
	}
}

customElements.define('d2l-test-skeleton-paragraph', SkeletonTestParagraph);

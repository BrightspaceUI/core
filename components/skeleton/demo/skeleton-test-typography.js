import {
	bodyCompactStyles,
	bodySmallStyles,
	bodyStandardStyles,
	heading1Styles,
	heading2Styles,
	heading3Styles,
	heading4Styles,
	labelStyles
} from '../../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { linkStyles } from '../../link/link.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestTypography extends SkeletonMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			bodyStandardStyles,
			bodyCompactStyles,
			bodySmallStyles,
			heading1Styles,
			heading2Styles,
			heading3Styles,
			heading4Styles,
			labelStyles,
			linkStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	render() {
		return html`
			<p class="d2l-body-standard d2l-skeletize d2l-skeletize-20">Body Standard</p>
			<p class="d2l-body-compact d2l-skeletize d2l-skeletize-15">Body Compact</p>
			<p class="d2l-body-small d2l-skeletize d2l-skeletize-10">Body Small</p>
			<p class="d2l-label-text d2l-skeletize d2l-skeletize-5">Label</p>
			<hr>
			<a href="https://d2l.com" class="d2l-link d2l-skeletize">Link (Normal)</a><br>
			<a href="https://d2l.com" class="d2l-link d2l-link-main d2l-skeletize">Link (Main)</a><br>
			<a href="https://d2l.com" class="d2l-link d2l-link-small d2l-skeletize">Link (Small)</a>
			<hr>
			<h1 class="d2l-heading-1 d2l-skeletize d2l-skeletize-25">Heading 1</h1>
			<h2 class="d2l-heading-2 d2l-skeletize d2l-skeletize-20">Heading 2</h2>
			<h3 class="d2l-heading-3 d2l-skeletize d2l-skeletize-15">Heading 3</h3>
			<h4 class="d2l-heading-4 d2l-skeletize d2l-skeletize-10">Heading 4</h4>
			<hr>
			<h3 class="d2l-heading-3 d2l-skeletize d2l-skeletize-15">Heading 3<br>spanning multiple lines</h3>
		`;
	}
}

customElements.define('d2l-test-skeleton-typography', SkeletonTestTypography);

import { bodyCompactStyles, bodySmallStyles, bodyStandardStyles } from '../../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SkeletonMixin } from '../skeleton-mixin.js';

export class SkeletonTestParagraphs extends SkeletonMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			bodyStandardStyles,
			bodyCompactStyles,
			bodySmallStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	render() {
		return html`
			<p class="d2l-body-standard d2l-skeletize-paragraph-2">Standard 2-line</p>
			<p class="d2l-body-standard d2l-skeletize-paragraph-3">Standard 3 line</p>
			<p class="d2l-body-standard d2l-skeletize-paragraph-5">Standard 5 line</p>
			<hr>
			<p class="d2l-body-compact d2l-skeletize-paragraph-2">Compact 2-line</p>
			<p class="d2l-body-compact d2l-skeletize-paragraph-3">Compact 3 line</p>
			<p class="d2l-body-compact d2l-skeletize-paragraph-5">Compact 5 line</p>
			<hr>
			<p class="d2l-body-small d2l-skeletize-paragraph-2">Small 2-line</p>
			<br>
			<p class="d2l-body-small d2l-skeletize-paragraph-3">Small 3 line</p>
			<br>
			<p class="d2l-body-small d2l-skeletize-paragraph-5">Small 5 line</p>
		`;
	}
}

customElements.define('d2l-test-skeleton-paragraphs', SkeletonTestParagraphs);

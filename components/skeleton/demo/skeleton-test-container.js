import '../../colors/colors.js';
import '../../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../../typography/styles.js';
import { SkeletonGroupMixin } from '../skeleton-group-mixin.js';

export class SkeletonTestContainer extends SkeletonGroupMixin(LitElement) {

	static get styles() {
		return [
			super.styles,
			bodyCompactStyles,
			css`
				:host {
					display: block;
				}
				.d2l-demo-box {
					background-color: var(--d2l-color-fluorite-plus-2);
					border: 3px solid var(--d2l-color-fluorite);
					border-radius: 4px;
					color: var(--d2l-color-fluorite);
					height: 100px;
					padding: 10px;
					width: 300px;
				}
				span {
					display: block;
					margin: 10px 0;
				}
			`
		];
	}

	render() {
		return html`
			<div class="d2l-demo-box d2l-skeletize-container">
				<div class="d2l-skeletize">Container with Skeletons Inside</div>
				<span class="d2l-body-compact">No skeleton</span>
				<d2l-input-checkbox checked>Skeleton</d2l-input-checkbox>
			</div>
		`;
	}
}

customElements.define('d2l-test-skeleton-container', SkeletonTestContainer);

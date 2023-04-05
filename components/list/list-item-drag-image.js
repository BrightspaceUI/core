import '../colors/colors.js';
import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

class ListItemDragImage extends LocalizeCoreElement(SkeletonMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			count: { type: Number },
			includePlusSign: { type: Boolean, attribute: 'include-plus-sign' }
		};
	}

	static get styles() {
		return [ super.styles, bodySmallStyles, css`
			:host {
				display: block;
				height: 70px;
				left: -10000px;
				position: absolute;
				width: 340px;
				z-index: 0;
			}
			:host([hidden]) {
				display: none;
			}
			:host([dir="rtl"]) {
				left: 0;
				right: -10000px;
			}
			.first, .second, .third {
				background-color: white;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 4px;
				box-sizing: border-box;
				height: 100%;
				position: absolute;
				width: 100%;
			}
			.first {
				align-items: start;
				display: flex;
				padding: 16px 8px;
			}
			.second {
				margin-inline-start: 6px;
				margin-top: 6px;
				z-index: -1;
			}
			.third {
				margin-inline-start: 12px;
				margin-top: 12px;
				z-index: -2;
			}
			.text {
				width: 100%;
			}
			.line-1 {
				height: 24px;
				margin-bottom: 4px;
				width: 100%;
			}
			.line-2 {
				height: 16px;
				width: 25%;
			}
			d2l-input-checkbox {
				line-height: 0;
				margin: 0;
				margin-inline-start: 16px;
			}
			.count {
				background-color: var(--d2l-color-celestine);
				border-radius: 0.7rem;
				box-sizing: border-box;
				color: white;
				left: 26px;
				min-width: 1.4rem;
				padding: 0.2rem 0.4rem;
				position: absolute;
				text-align: center;
				top: 30px;
				z-index: 1000; /* must be higher than the skeleton z-index (999) */
			}
			:host([dir="rtl"]) .count {
				left: 14px;
			}
		`];
	}

	constructor() {
		super();
		this.count = 0;
		this.skeleton = true;
	}

	render() {
		return html`
			<div class="first">
				<div class="count d2l-body-small">${this.includePlusSign ? this.localize('components.count-badge.plus', { number: this.count }) : formatNumber(this.count)}</div>
				<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
					<path fill="#494c4e" d="M8 16v1c0 .5-.4 1-1 1H6c-.6 0-1-.5-1-1v-1c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M13 16v1c0 .5-.4 1-1 1h-1c-.6 0-1-.5-1-1v-1c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M8 11v1c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M13 11v1c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1v-1c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M8 6v1c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M13 6v1c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1h1c.6 0 1 .4 1 1M8 1v1c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V1c0-.5.4-1 1-1h1c.6 0 1 .5 1 1M13 1v1c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1V1c0-.5.4-1 1-1h1c.6 0 1 .5 1 1"/>
				</svg>
				<d2l-input-checkbox disabled skeleton></d2l-input-checkbox>
				<div class="text">
					<div class="line-1 d2l-skeletize"></div>
					<div class="line-2 d2l-skeletize"></div>
				</div>
			</div>
			<div class="second"></div>
			<div class="third"></div>
		`;
	}

}

customElements.define('d2l-list-item-drag-image', ListItemDragImage);

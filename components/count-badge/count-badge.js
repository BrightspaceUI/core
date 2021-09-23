import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { CountBadgeMixin, countBadgeStyles } from './count-badge-mixin.js';
import { css, LitElement } from 'lit-element/lit-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class CountBadge extends CountBadgeMixin(RtlMixin(LitElement)) {

	static get styles() {
		return [offscreenStyles, countBadgeStyles, css`
		:host(.focus-visible) .d2l-count-badge-wrapper,
		.d2l-count-badge-wrapper.focus-visible {
			box-shadow: 0 0 0 2px var(--d2l-color-celestine);
		}
		`];
	}

	render() {
		return this.renderCount();
	}
}

customElements.define('d2l-count-badge', CountBadge);

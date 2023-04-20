import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { fixSvg } from './fix-svg.js';
import { iconStyles } from './icon-styles.js';
import { loadSvg } from '../../generated/icons/presetIconLoader.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

class Icon extends RtlMixin(LitElement) {

	static get properties() {
		return {
			icon: {
				type: String,
				reflect: true
			}
		};
	}

	static get styles() {
		return [ iconStyles, css`
			:host([icon*="tier1:"]) {
				height: var(--d2l-icon-height, 18px);
				width: var(--d2l-icon-width, 18px);
			}
			:host([icon*="tier2:"]) {
				height: var(--d2l-icon-height, 24px);
				width: var(--d2l-icon-width, 24px);
			}
			:host([icon*="tier3:"]) {
				height: var(--d2l-icon-height, 30px);
				width: var(--d2l-icon-width, 30px);
			}
		`];
	}

	render() {
		return html`${runAsync(this.icon, () => this._getIcon(), {
			success: (icon) => icon
		}, { pendingState: false })}`;
	}

	_fixSvg(svgStr) {

		if (svgStr === undefined) {
			return undefined;
		}

		const template = document.createElement('template');
		template.innerHTML = svgStr;

		const svg = template.content.firstChild;
		fixSvg(svg);

		return html`${unsafeSVG(template.innerHTML)}`;

	}

	async _getIcon() {
		if (this.icon) {
			let icon = this.icon;
			if (icon.substring(0, 4) === 'd2l-') {
				icon = icon.substring(4);
			}
			const svg = await loadSvg(icon);
			return this._fixSvg(svg ? svg.val : undefined);
		}
	}

}

customElements.define('d2l-icon', Icon);

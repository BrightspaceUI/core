import './navigation-button-icon.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../../../components/typography/styles.js';
import { LocalizeLabsElement } from './localize-labs-element.js';

class NavigationIterator extends LocalizeLabsElement(LitElement) {

	static get properties() {
		return {
			hideText: { attribute: 'hide-text', type: Boolean },
			previousDisabled: { attribute: 'previous-disabled', type: Boolean },
			previousText: { attribute: 'previous-text', type: String },
			nextDisabled: { attribute: 'next-disabled', type: Boolean },
			nextText: { attribute: 'next-text', type: String },
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				align-items: center;
				display: flex;
				gap: 1.2rem;
				height: 3.3rem;
				justify-content: space-between;
				max-width: 20rem;
			}
			:host([hidden]) {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.hideText = false;
		this.nextDisabled = false;
		this.nextText = '';
		this.previousDisabled = false;
		this.previousText = '';
	}

	render() {
		const previousText = this.previousText ? this.previousText : this.localize('components:navigation:previous');
		const nextText = this.nextText ? this.nextText : this.localize('components:navigation:next');
		return html`
			<d2l-labs-navigation-button-icon
				class="d2l-body-compact"
				icon="tier3:chevron-left-circle"
				icon-position="start"
				text="${previousText}"
				?text-hidden="${this.hideText}"
				?disabled="${this.previousDisabled}"
				@click="${this._dispatchPreviousClicked}"></d2l-labs-navigation-button-icon>
			<slot class="d2l-body-compact"></slot>
			<d2l-labs-navigation-button-icon
				class="d2l-body-compact"
				icon="tier3:chevron-right-circle"
				icon-position="end"
				text="${nextText}"
				?text-hidden="${this.hideText}"
				?disabled="${this.nextDisabled}"
				@click="${this._dispatchNextClicked}"></d2l-labs-navigation-button-icon>
		`;
	}

	_dispatchNextClicked(e) {
		if (this.nextDisabled) {
			return;
		}

		e.stopPropagation();

		this.dispatchEvent(new CustomEvent('next-click', {
			detail: {
				type: e.currentTarget.type
			}
		}));
	}

	_dispatchPreviousClicked(e) {
		if (this.previousDisabled) {
			return;
		}

		e.stopPropagation();

		this.dispatchEvent(new CustomEvent('previous-click', {
			detail: {
				type: e.currentTarget.type
			}
		}));
	}

}

window.customElements.define('d2l-labs-navigation-iterator', NavigationIterator);

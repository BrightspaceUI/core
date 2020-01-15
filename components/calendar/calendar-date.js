import { css, html, LitElement } from 'lit-element/lit-element.js';

class CalendarDate extends LitElement {

	static get properties() {
		return {
			date: { type: Number, reflect: true },
			month: { type: Number, reflect: true },
			year: { type: Number, reflect: true },
			otherMonth: { type: Boolean, attribute: 'other-month' },
			selected: { type: Boolean, reflect: true },
			selectedMonth: { type: Boolean, attribute: 'selected-month' },
			tabindex: { type: String, reflect: true },
		};
	}

	static get styles() {
		return css`
				:host {
					cursor: pointer;
					font-size: 0.8rem;
					position: relative;
					text-align: center;
				}

				div {
					align-items: center;
					border: 2.5px solid transparent;
					border-radius: 8px;
					color: var(--d2l-color-ferrite);
					display: flex;
					height: 2rem;
					justify-content: center;
					margin-left: auto;
					margin-right: auto;
					width: 2rem;
				}

				:host(:focus) {
					outline: none;
				}

				:host(:hover) div {
					background-color: var(--d2l-color-celestine-plus-2);
					color: var(--d2l-color-ferrite);
				}

				:host(:focus) div {
					background-color: white;
					border-color: var(--d2l-color-celestine);
					color: var(--d2l-color-ferrite);
				}

				:host([selected]) div {
					background-color: var(--d2l-color-celestine);
					color: white;
				}

				:host([other-month]) div,
				:host([other-month]):hover div,
				:host([other-month]):focus div {
					color: var(--d2l-color-chromite);
				}
			`;
	}

	constructor() {
		super();

		this.tabindex = -1;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('click', this._onDateSelected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((old, prop) => {
			if (prop === 'selected' || prop === 'date' || prop === 'otherMonth' || prop === 'selectedMonth') {
				if (this.selected ||
					(this.date === 1 && !this.otherMonth && !this.selectedMonth)) {
					this.tabindex = 0;
				} else {
					this.tabindex = -1;
				}
			}
		});
	}

	_onKeyDown(e) {
		const keyCodes = {
			DOWN: 40,
			ENTER: 13,
			ESCAPE: 27,
			LEFT: 37,
			SPACE: 32,
			RIGHT: 39,
			UP: 38
		};

		if (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE) {
			e.stopPropagation();
			e.preventDefault();
			this._onDateSelected(e);
		}

	}

	render() {
		return html`
			<div>${this.date}</div>
		`;
	}

	_onDateSelected() {
		const fullDate = `${parseInt(this.month) + 1}/${this.date}/${this.year}`;
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: fullDate }
		};
		console.log('date selected ' + eventDetails.detail.date)
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
	}

}
customElements.define('d2l-calendar-date', CalendarDate);

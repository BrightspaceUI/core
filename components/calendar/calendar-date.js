import { css, html, LitElement } from 'lit-element/lit-element.js';

class CalendarDate extends LitElement {

	static get properties() {
		return {
			date: { type: Number },
			month: { type: Number },
			year: { type: Number },
			otherMonth: { type: Boolean, attribute: 'other-month' },
			selected: { type: Boolean, reflect: true },
			selectedMonth: { type: Boolean, attribute: 'selected-month' },
			tabindex: { type: String, reflect: true },
			_today: { type: Boolean, reflect: true }
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

				:host(:focus) {
					outline: none;
				}

				:host(:hover) div,
				:host(:hover[selected]:not([other-month])) div {
					background-color: var(--d2l-color-celestine-plus-2);
					color: var(--d2l-color-ferrite);
				}

				:host(:focus) div,
				:host(:focus[selected]:not([other-month])) div {
					background-color: white;
					border-color: var(--d2l-color-celestine);
					color: var(--d2l-color-ferrite);
				}

				:host([selected]:not([other-month])) div {
					background-color: var(--d2l-color-celestine);
					color: white;
				}

				:host([other-month]) div,
				:host([other-month]):hover div,
				:host([other-month]):focus div {
					color: var(--d2l-color-chromite);
				}

				:host([_today]:not([selected])) div {
					font-size: 1.1rem;
					font-weight: 700;
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
			`;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('click', this._onDateSelected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((old, prop) => {
			if (prop === 'month' || prop === 'year') {
				const todayDate = new Date();
				this._today = (this.year === todayDate.getFullYear() && this.month === todayDate.getMonth() && this.date === todayDate.getDate());
			} else if (prop === 'selected' || prop === 'date' || prop === 'otherMonth' || prop === 'selectedMonth') {
				// tab index is 0 if this date is selected && selected not in other month
				// OR if it is the 1st day of the currently shown month and the currently shown month is
				// not the month containing the selected day
				if ((this.selected && !this.otherMonth) ||
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
			ENTER: 13,
			SPACE: 32
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
		const fullDate = {
			month: this.month,
			date: this.date,
			year: this.year
		};
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: fullDate }
		};
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
		this.selected = true;
	}

}
customElements.define('d2l-calendar-date', CalendarDate);

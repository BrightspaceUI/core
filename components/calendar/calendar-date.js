import { css, html, LitElement } from 'lit-element/lit-element.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

class CalendarDate extends LitElement {

	static get properties() {
		return {
			date: { type: Number },
			month: { type: Number },
			year: { type: Number },
			otherMonth: { type: Boolean, attribute: 'other-month' },
			selected: { type: Boolean, reflect: true },
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
					border: 2px solid transparent;
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

		this.addEventListener('keyup', this._onKeyUp);
		this.addEventListener('click', this._onDateSelected);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((old, prop) => {
			if (prop === 'month' || prop === 'year') {
				const todayDate = new Date();
				this._today = (this.year === todayDate.getFullYear() && this.month === todayDate.getMonth() && this.date === todayDate.getDate());
			}
		});
	}

	_onKeyUp(e) {

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

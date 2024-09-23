import { LitElement } from 'lit';

/**
 * A component can be used to display events in d2l-calendar.
 */
class CalendarEvent extends LitElement {

	static get properties() {
		return {
			/**
			 * End date
			 * @type {string}
			 */
			endValue: { attribute: 'end-value', type: String },
			/**
			 * Start date
			 * @type {string}
			 */
			startValue: { attribute: 'start-value', type: String }
		};
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const hasChanges = changedProperties.values().reduce((hasChanges, oldValue) => hasChanges || (oldValue !== undefined), false);
		if (!hasChanges) return;

		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-calendar-event-data-change', {
			bubbles: true,
			composed: false
		}));

	}

}

customElements.define('d2l-calendar-event', CalendarEvent);

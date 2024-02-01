import { html } from '@brightspace-ui/testing';

export const inlineHelpSlots = {
	normal: html`
		<div slot="inline-help">
			Help text <b>right here</b>!
		</div>
	`,
	multiline: html`
		<div slot="inline-help">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit,
			sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
			nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
			reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
			pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
			qui officia deserunt mollit anim id est laborum.
		</div>
	`
};

export class inlineHelpFixtures {
	constructor(
	{
		multiline = false,
		skeleton = false,
		disabled = false
	} = {}) {
		this.multiline = multiline;
		this.skeleton = skeleton;
		this.disabled = disabled;

		this.inlineHelpSlot = this.multiline ? inlineHelpSlots.multiline : inlineHelpSlots.normal;
	}

	checkbox = () => {
		return html`
			<d2l-input-checkbox
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
			>
				Inline help checkbox
				${this.inlineHelpSlot}
			</d2l-input-checkbox>
		`;
	}

	color = () => {
		return html`
			<d2l-input-color
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Custom Color"
				type="custom"
				value="#8ad934"
			>
				${this.inlineHelpSlot}
			</d2l-input-color>
		`;
	}

	date = () => {
		return  html`
			<d2l-input-date
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Date"
			>
				${this.inlineHelpSlot}
			</d2l-input-date>
		`;
	}

	dateRange = () => {
		return html`
			<d2l-input-date-range
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Date"
			>
				${this.inlineHelpSlot}
			</d2l-input-date-range>
		`;
	}

	dateTime = () => {
		return html`
			<d2l-input-date-time
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Name (with min and max)"
				min-value="2018-08-27T12:30:00Z"
				max-value="2018-09-30T12:30:00Z"
				value="2018-08-30T12:30:00Z"
			>
				${this.inlineHelpSlot}
			</d2l-input-date-time>
		`;
	}

	dateTimeRange = () => {
		return  html`
			<div style="width: 400px">
				<d2l-input-date-time-range
					?disabled="${this.disabled}"
					?skeleton="${this.skeleton}"
					class="vdiff-include"
					label="Assignment Dates"
				>
					${this.inlineHelpSlot}
				</d2l-input-date-time-range>
			</div>
		`;
	}

	number = () => {
		return  html`
			<d2l-input-number
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Age"
				value="18"
			>
				${this.inlineHelpSlot}
			</d2l-input-number>
		`;
	}

	percent = () => {
		return  html`
			<d2l-input-percent
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Grade"
				value="92"
			>
				${this.inlineHelpSlot}
			</d2l-input-percent>
		`;
	}

	search = () => {
		return html`
			<d2l-input-search
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Search"
				value="apples"
				placeholder="Search for some stuff"
			>
				${this.inlineHelpSlot}
			</d2l-input-search>
		`;
	}

	textArea = () => {
		return html`
			<d2l-input-textarea
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Description"
			>
				${this.inlineHelpSlot}
			</d2l-input-textarea>
		`;
	}

	text = () => {
		return html`
			<d2l-input-text
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Name"
			>
				${this.inlineHelpSlot}
			</d2l-input-text>
		`;
	}

	timeRange = () => {
		return  html`
			<d2l-input-time-range
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Time Range"
			>
				${this.inlineHelpSlot}
			</d2l-input-time-range>
		`;
	}

	time = () => {
		return html`
			<d2l-input-time
				?disabled="${this.disabled}"
				?skeleton="${this.skeleton}"
				label="Start Time"
				default-value="09:00:00"
			>
				${this.inlineHelpSlot}
			</d2l-input-time>
		`;
	}
}

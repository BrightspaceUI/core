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

export const inlineHelpFixtures = {
	checkbox: {
		normal: html`
			<d2l-input-checkbox>
				Inline help checkbox
				${inlineHelpSlots.normal}
			</d2l-input-checkbox>
		`,
		multiline: html`
			<d2l-input-checkbox>
				Inline help checkbox
				${inlineHelpSlots.multiline}
			</d2l-input-checkbox>
		`
	},
	color: {
		normal: html`
			<d2l-input-color label="Custom Color" type="custom" value="#8ad934" disabled>
				${inlineHelpSlots.normal}
			</d2l-input-color>`
	},
	number: {
		normal: html`
			<d2l-input-number label="Age" value="18">
				${inlineHelpSlots.normal}
			</d2l-input-number>
		`,
		multiline: html`
			<d2l-input-number label="Age" value="18">
				${inlineHelpSlots.multiline}
			</d2l-input-number>
		`
	},
	dateRange: {
		normal: html`
			<d2l-input-date-range label="Assignment Dates">
				${inlineHelpSlots.normal}
			</d2l-input-date-range>
		`,
		multiline: html`
			<d2l-input-date-range label="Assignment Dates">
				${inlineHelpSlots.multiline}
			</d2l-input-date-range>
		`
	},
	dateTimeRange: {
		normal: html`
			<d2l-input-date-time-range label="Assignment Dates">
				${inlineHelpSlots.normal}
			</d2l-input-date-time-range>
		`,
		multiline: html`
			<d2l-input-date-time-range label="Assignment Dates">
				${inlineHelpSlots.multiline}
			</d2l-input-date-time-range>
		`
	},
	dateTime: {
		normal: html`
			<d2l-input-date-time label="Name (with min and max)" min-value="2018-08-27T12:30:00Z" max-value="2018-09-30T12:30:00Z" value="2018-08-30T12:30:00Z">
				${inlineHelpSlots.normal}
			</d2l-input-date-time>
		`,
		multiline: html`
			<d2l-input-date-time label="Name (with min and max)" min-value="2018-08-27T12:30:00Z" max-value="2018-09-30T12:30:00Z" value="2018-08-30T12:30:00Z">
				${inlineHelpSlots.multiline}
			</d2l-input-date-time>
		`
	},
	search: {
		normal: html`
			<d2l-input-search label="Search" value="apples" placeholder="Search for some stuff">
				${inlineHelpSlots.normal}
			</d2l-input-search>
		`,
		multiline: html`
			<d2l-input-search label="Search" value="apples" placeholder="Search for some stuff">
				${inlineHelpSlots.multiline}
			</d2l-input-search>
		`
	},
	text: {
		normal: html`
			<d2l-input-text label="Name">
				${inlineHelpSlots.normal}
			</d2l-input-text>
		`,
		multiline: html`
			<d2l-input-text label="Name">
				${inlineHelpSlots.multiline}
			</d2l-input-text>
		`
	},
	timeRange: {
		normal: html`
			<d2l-input-time-range label="Time Range">
				${inlineHelpSlots.normal}
			</d2l-input-time-range>
		`,
		multiline: html`
			<d2l-input-time-range label="Time Range">
				${inlineHelpSlots.multiline}
			</d2l-input-time-range>
		`
	},
	time: {
		normal: html`
			<d2l-input-time label="Start Time" default-value="09:00:00">
				${inlineHelpSlots.normal}
			</d2l-input-time>
		`,
		multiline: html`
			<d2l-input-time label="Start Time" default-value="09:00:00">
				${inlineHelpSlots.multiline}
			</d2l-input-time>
		`
	},
};

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
	date: {
		normal: html`
			<d2l-input-date label="Date">
				${inlineHelpSlots.normal}
			</d2l-input-date>
		`,
		multiline: html`
			<d2l-input-date label="Date">
				<div slot="inline-help">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit,
					sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</div>
			</d2l-input-date>
		`
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
	percent: {
		normal: html`
			<d2l-input-percent label="Grade" value="92">
				${inlineHelpSlots.normal}
			</d2l-input-percent>
		`,
		multiline: html`
			<d2l-input-percent label="Grade" value="92">
				${inlineHelpSlots.multiline}
			</d2l-input-percent>
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
	textArea: {
		normal: html`
			<d2l-input-textarea label="Description">
				${inlineHelpSlots.normal}
			</d2l-input-textarea>
		`,
		multiline: html`
			<d2l-input-textarea label="Description">
				${inlineHelpSlots.multiline}
			</d2l-input-textarea>
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

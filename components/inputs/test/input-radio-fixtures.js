import '../input-radio.js';
import '../input-radio-group.js';
import { html } from 'lit';

export const radioFixtures = {
	disabledAllSecondChecked: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1" disabled></d2l-input-radio>
			<d2l-input-radio label="Two" value="2" disabled checked></d2l-input-radio>
			<d2l-input-radio label="Three" value="3" disabled></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	disabledChecked: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1" checked disabled></d2l-input-radio>
			<d2l-input-radio label="Two" value="2"></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	disabledFirstNoneChecked: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1" disabled></d2l-input-radio>
			<d2l-input-radio label="Two" value="2"></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	noneChecked: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1"></d2l-input-radio>
			<d2l-input-radio label="Two" value="2"></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	requiredSecondChecked: html`
		<d2l-input-radio-group label="One, two or three?" required>
			<d2l-input-radio label="One" value="1"></d2l-input-radio>
			<d2l-input-radio label="Two" value="2" checked></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	requiredNoneChecked: html`
		<d2l-input-radio-group label="One, two or three?" required>
			<d2l-input-radio label="One" value="1"></d2l-input-radio>
			<d2l-input-radio label="Two" value="2"></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	secondChecked: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1"></d2l-input-radio>
			<d2l-input-radio label="Two" value="2" checked></d2l-input-radio>
			<d2l-input-radio label="Three" value="3"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	secondCheckedThirdDisabled: html`
		<d2l-input-radio-group label="One, two or three?">
			<d2l-input-radio label="One" value="1"></d2l-input-radio>
			<d2l-input-radio label="Two" value="2" checked></d2l-input-radio>
			<d2l-input-radio label="Three" value="3" disabled></d2l-input-radio>
		</d2l-input-radio-group>
	`
};

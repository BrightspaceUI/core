import '../input-radio.js';
import '../input-radio-group.js';
import { html } from 'lit';

export const radioFixtures = {
	disabledAllSecondChecked: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat" disabled></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette" disabled checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye" disabled></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	disabledChecked: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat" checked disabled></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	disabledFirstNoneChecked: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat" disabled></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	inlineHelp: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat">
				<div slot="inline-help">A healthy option, rich in fiber and nutrients.</div>
			</d2l-input-radio>
			<d2l-input-radio label="Baguette" checked>
				<div slot="inline-help">A symbol of French culture and cuisine, with millions baked and consumed daily.</div>
			</d2l-input-radio>
			<d2l-input-radio label="Marble Rye">
				<div slot="inline-help">Characterized by its distinctive appearance, achieved by weaving together light and dark rye dough.</div>
			</d2l-input-radio>
		</d2l-input-radio-group>
	`,
	labelHidden: html`
		<d2l-input-radio-group label="Bread" label-hidden>
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette" checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	noneChecked: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	requiredSecondChecked: html`
		<d2l-input-radio-group label="Bread" required>
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette" checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	requiredNoneChecked: html`
		<d2l-input-radio-group label="Bread" required>
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette"></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	secondChecked: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette" checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	secondCheckedNoValues: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye"></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	secondCheckedThirdDisabled: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" value="whole-wheat"></d2l-input-radio>
			<d2l-input-radio label="Baguette" value="baguette" checked></d2l-input-radio>
			<d2l-input-radio label="Marble Rye" value="marble-rye" disabled></d2l-input-radio>
		</d2l-input-radio-group>
	`,
	supporting: html`
		<d2l-input-radio-group label="Bread">
			<d2l-input-radio label="Whole wheat" checked></d2l-input-radio>
			<d2l-input-radio label="Baguette"></d2l-input-radio>
			<d2l-input-radio label="Marble Rye"></d2l-input-radio>
			<d2l-input-radio label="Other" supporting-hidden-when-unchecked>
				<div slot="supporting" style="border: 1px solid black; padding: 6px;">Sourdough</div>
			</d2l-input-radio>
		</d2l-input-radio-group>
	`
};

import '../input-checkbox.js';
import '../input-checkbox-group.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-input-checkbox-group', () => {

	it('labelled', async() => {
		const template = html`
			<d2l-input-checkbox-group label="Checkbox Group">
				<d2l-input-checkbox label="Checkbox 1"></d2l-input-checkbox>
				<d2l-input-checkbox label="Checkbox 2"></d2l-input-checkbox>
				<d2l-input-checkbox label="Checkbox 3"></d2l-input-checkbox>
			</d2l-input-checkbox-group>
		`;
		const elem = await fixture(template);
		await expect(elem).to.be.golden();
	});

	Array.from({ length: 3 }, (_, i) => i).forEach(numItems => {
		it(`${numItems}`, async() => {
			const template = html`
				<div style="border: 1px solid black; width: 200px;">
					<d2l-input-checkbox-group label="Checkbox Group" label-hidden>
						${Array.from({ length: numItems }, (_, i) => html`<d2l-input-checkbox label="Checkbox ${i + 1}"></d2l-input-checkbox>`)}
					</d2l-input-checkbox-group>
				</div>
			`;
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

});

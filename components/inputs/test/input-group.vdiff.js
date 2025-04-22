import '../../form/form.js';
import '../input-group.js';
import '../input-text.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-input-group', () => {

	Array.from({ length: 3 }, (_, i) => i).forEach(numItems => {
		it(`${numItems}`, async() => {
			const template = html`
				<div style="border: 1px solid black; width: 200px;">
					<d2l-input-group>
						${Array.from({ length: numItems }, (_, i) => html`<d2l-input-text label="Input ${i + 1}"></d2l-input-text>`)}
					</d2l-input-group>
				</div>
			`;
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

	it('form', async() => {
		const elem = await fixture(html`
			<d2l-form>
				<d2l-input-group>
					<d2l-input-text label="Name" required></d2l-input-text>
				</d2l-input-group>
			</d2l-form>
		`);
		await elem.validate();
		await new Promise(resolve => setTimeout(resolve, 100));
		await expect(elem).to.be.golden();
	});

});

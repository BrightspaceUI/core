import '../button-icon.js';
import '../button-toggle.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-button-toggle', () => {

	const normalFixture = html`
		<d2l-button-toggle>
			<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
			<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
		</d2l-button-toggle>
	`;

	it('not pressed', async() => {
		const el = await fixture(normalFixture);
		await expect(el).to.be.accessible();
	});

	it('pressed', async() => {
		const el = await fixture(normalFixture);
		el.pressed = true;
		await el.updateComplete;
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`
			<d2l-button-toggle>
				<d2l-button-icon slot="not-pressed" disabled icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
				<d2l-button-icon slot="pressed" disabled icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
			</d2l-button-toggle>
		`);
		await expect(el).to.be.accessible();
	});

	describe('focus management', () => {

		it('focused not-pressed button', async() => {
			const el = await fixture(html`
				<d2l-button-toggle>
					<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
			await focusElem(el);
			await expect(el).to.be.accessible();
		});

		it('focused pressed button', async() => {
			const el = await fixture(html`
				<d2l-button-toggle pressed>
					<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
					<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
				</d2l-button-toggle>
			`);
			await focusElem(el);
			await expect(el).to.be.accessible();
		});

	});

});

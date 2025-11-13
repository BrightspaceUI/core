import '../button-add.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button-add', () => {
	['icon', 'icon-and-text', 'icon-when-interacted'].forEach((mode) => {
		describe(`mode ${mode}`, () => {
			[
				{ category: 'basic', template: html`<d2l-button-add mode="${mode}"></d2l-button-add>` },
				{ category: 'text', template: html`<d2l-button-add mode="${mode}" text="Custom Text"></d2l-button-add>` }
			].forEach(({ category, template }) => {
				describe(category, () => {
					[
						{ name: 'normal' },
						{ name: 'hover', action: hoverElem },
						{ name: 'focus', action: focusElem },
						{ name: 'click', action: clickElem }
					].forEach(({ action, name }) => {
						it(name, async() => {
							const elem = await fixture(template);
							if (action) await action(elem);
							if ((name === 'hover' || name === 'focus') && mode !== 'icon-and-text') await oneEvent(elem, 'd2l-tooltip-show');
							await expect(elem).to.be.golden({ margin: 12 });
						});
					});
				});

				[
					{ name: 'normal' },
					{ name: 'focus', action: focusElem }
				].forEach(({ action, name }) => {
					it(`text around ${name}`, async() => {
						const elem = await fixture(html`
							<div>
								<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
								<d2l-button-add mode="${mode}"></d2l-button-add>
								<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
							</div>
						`);
						const addButton = elem.querySelector('d2l-button-add');
						if (action) await action(addButton);
						if (name === 'focus' && mode !== 'icon-and-text') await oneEvent(addButton, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});
				});
			});

			it('rtl', async() => {
				const elem = await fixture(html`<d2l-button-add mode="${mode}"></d2l-button-add>`, { rtl: true });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('edge cases', () => {

		it('long text icon mode', async() => {
			const elem = await fixture(html`<d2l-button-add text="Add a New Item with a Very Long Description That Should Be Handled Properly"></d2l-button-add>`);
			await focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden({ margin: 12 });
		});

		it('long text icon-and-text mode', async() => {
			const elem = await fixture(html`<d2l-button-add mode="icon-and-text" text="Add a New Item with a Very Long Description That Should Be Handled Properly"></d2l-button-add>`);
			await expect(elem).to.be.golden({ margin: 12 });
		});

		it('long text icon-and-text mode constrained width', async() => {
			const elem = await fixture(html`
				<div style="width: 400px;">
					<d2l-button-add mode="icon-and-text" text="Add a New Item with a Very Long Description That Should Be Handled Properly"></d2l-button-add>
				</div>
			`);
			await expect(elem).to.be.golden();
		});

		it('long text icon-when-interacted mode hover', async() => {
			const elem = await fixture(html`<d2l-button-add mode="icon-when-interacted" text="Add a New Item with a Very Long Description That Should Be Handled Properly"></d2l-button-add>`);
			await hoverElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden({ margin: 12 });
		});

	});

	describe('backgrounds', () => {

		it('colored background', async() => {
			const elem = await fixture(html`
				<div style="background-color: #f9fafb; padding: 20px;">
					<d2l-button-add mode="icon-and-text" text="Add Item"></d2l-button-add>
				</div>
			`);
			await expect(elem).to.be.golden();
		});

		it('dark background icon mode', async() => {
			const elem = await fixture(html`
				<div style="background-color: #494c4e; padding: 20px;">
					<d2l-button-add text="Add Item"></d2l-button-add>
				</div>
			`);
			await expect(elem).to.be.golden();
		});

	});
});

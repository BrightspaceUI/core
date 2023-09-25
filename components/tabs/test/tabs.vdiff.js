import '../../button/button.js';
import '../tabs.js';
import '../tab-panel.js';
import { clickElem, expect, fixture, focusElem, html, sendKeysElem } from '@brightspace-ui/testing';

const noPanelSelectedFixture = html`
	<d2l-tabs>
		<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
		<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
		<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
	</d2l-tabs>
`;
const panelSelectedFixture = html`
	<d2l-tabs>
		<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
		<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
		<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
	</d2l-tabs>
`;

const viewport = { width: 376 };

describe('d2l-tabs', () => {

	describe('basic', () => {

		it('no panel selected', async() => {
			const elem = await fixture(noPanelSelectedFixture, { viewport });
			await expect(elem).to.be.golden();
		});

		it('panel selected', async() => {
			const elem = await fixture(panelSelectedFixture, { viewport });
			await expect(elem).to.be.golden();
		});

		it('one tab', async() => {
			const elem = await fixture(html`
				<d2l-tabs>
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

		it('skeleton', async() => {
			const elem = await fixture(html`
				<d2l-tabs skeleton>
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

		it('skeleton no text', async() => {
			const elem = await fixture(html`
				<d2l-tabs skeleton>
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel>Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Physics">Tab content for Physics</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

		it('ellipsis', async() => {
			const elem = await fixture(html`
				<d2l-tabs>
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Earth &amp; Planetary Sciences" selected>Tab content for Earth &amp; Planetary Sciences</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

		it('non-selected tab focus', async() => {
			const elem = await fixture(noPanelSelectedFixture, { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('selected tab focus', async() => {
			const elem = await fixture(panelSelectedFixture, { viewport });
			await focusElem(elem);
			await expect(elem).to.be.golden();
		});

		it('action slot', async() => {
			const elem = await fixture(html`
				<d2l-tabs>
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
					<d2l-button slot="ext">Search</d2l-button>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

		it('no padding', async() => {
			const elem = await fixture(html`
				<d2l-tabs>
					<d2l-tab-panel text="All" no-padding style="background-color: orange;">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
			await expect(elem).to.be.golden();
		});

	});

	describe('overflow', () => {

		const nextFixture = html`
			<d2l-tabs>
				<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				<d2l-tab-panel text="Geology">Tab content for Geology</d2l-tab-panel>
			</d2l-tabs>
		`;
		const previousFixture = html`
			<d2l-tabs>
				<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				<d2l-tab-panel text="Geology" selected>Tab content for Geology</d2l-tab-panel>
			</d2l-tabs>
		`;

		['ltr', 'rtl'].forEach((dir) => {

			const rtl = dir === 'rtl';

			describe(dir, () => {

				it('scroll next', async() => {
					const elem = await fixture(nextFixture, { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('scrolls next on click', async() => {
					const elem = await fixture(nextFixture, { viewport, rtl });
					await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
					await expect(elem).to.be.golden();
				});

				it('scroll previous', async() => {
					const elem = await fixture(previousFixture, { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('scrolls previous on click', async() => {
					const elem = await fixture(previousFixture, { viewport, rtl });
					await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
					await expect(elem).to.be.golden();
				});

				it('action slot', async() => {
					const elem = await fixture(html`
						<d2l-tabs>
							<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
							<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
							<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
							<d2l-button slot="ext">Search</d2l-button>
						</d2l-tabs>
					`, { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('focus next', async() => {
					const elem = await fixture(nextFixture, { viewport, rtl });
					await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
					await expect(elem).to.be.golden();
				});

				it('focus previous', async() => {
					const elem = await fixture(previousFixture, { viewport, rtl });
					await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
					await expect(elem).to.be.golden();
				});
			});

		});

	});

	describe('max-to-show', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-tabs max-to-show="2">
					<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`, { viewport });
		});

		it('initial', async() => {
			await expect(elem).to.be.golden();
		});

		it('expands on focus to overflow', async() => {
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('expands on scroll next click', async() => {
			await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
			await expect(elem).to.be.golden();
		});

	});

	describe('keyboard', () => {

		const keyboardFixture = html`
			<d2l-tabs>
				<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>
		`;

		it('focuses next on right arrow', async() => {
			const elem = await fixture(keyboardFixture, { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('focuses previous on left arrow', async() => {
			const elem = await fixture(keyboardFixture, { viewport });
			await sendKeysElem(elem, 'press', 'ArrowLeft');
			await expect(elem).to.be.golden();
		});

		it('focuses first on right arrow from last', async() => {
			const elem = await fixture(keyboardFixture, { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight+ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('focuses last on left arrow from first', async() => {
			const elem = await fixture(keyboardFixture, { viewport });
			await sendKeysElem(elem, 'press', 'ArrowLeft+ArrowLeft');
			await expect(elem).to.be.golden();
		});

		['Space', 'Enter'].forEach((key) => {
			it(`selects on ${key}`, async() => {
				const elem = await fixture(html`
					<d2l-tabs>
						<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
						<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				`, { viewport });
				await sendKeysElem(elem, 'press', `ArrowRight+${key}`);
				await expect(elem).to.be.golden();
			});
		});

	});

});

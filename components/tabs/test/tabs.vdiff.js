import '../../button/button.js';
import '../../count-badge/count-badge.js';
import '../../icons/icon.js';
import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, sendKeysElem } from '@brightspace-ui/testing';

const noPanelSelectedFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const panelSelectedFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const oneTabFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
		</d2l-tabs>
	`
};

const skeletonSetOnEachTabFixture = {
	paired: html`
		<d2l-tabs skeleton>
			<d2l-tab id="all" text="All" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="physics" text="Physics" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const skeletonSetOnEachTabNoTextFixture = {
	paired: html`
		<d2l-tabs skeleton>
			<d2l-tab id="all" text="All" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="physics" text="Physics" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="physics" slot="panels">Tab content for Physics</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs" skeleton></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const ellipsisFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Earth &amp; Planetary Sciences" selected>Tab content for Earth &amp; Planetary Sciences</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="earth" text="Earth &amp; Planetary Sciences" slot="tabs" selected></d2l-tab>
			<d2l-tab-panel labelled-by="earth" slot="panels">Tab content for Earth &amp; Planetary Sciences</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const actionSlotBasicFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
			<d2l-button slot="ext">Search</d2l-button>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-button slot="ext">Search</d2l-button>
		</d2l-tabs>
	`
};

const actionSlotOverflowFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
			<d2l-button slot="ext">Search</d2l-button>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
			<d2l-button slot="ext">Search</d2l-button>
		</d2l-tabs>
	`
};

const noPaddingFixture = {
	deprecated: html`
		<d2l-tabs>
			<d2l-tab-panel text="All" no-padding style="background-color: orange;">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs>
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels" no-padding style="background-color: orange;">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
		</d2l-tabs>
	`
};

const maxToShowFixture = {
	deprecated: html`
		<d2l-tabs max-to-show="2">
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`,
	paired: html`
		<d2l-tabs max-to-show="2">
			<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
			<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
			<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
			<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
			<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	`
};

const viewport = { width: 376 };
const useFixture = 'paired';

describe('d2l-tabs', () => {

	describe('basic', () => {

		it('no panel selected', async() => {
			const elem = await fixture(noPanelSelectedFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('panel selected', async() => {
			const elem = await fixture(panelSelectedFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('one tab', async() => {
			const elem = await fixture(oneTabFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('skeleton', async() => {
			const elem = await fixture(skeletonSetOnEachTabFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('skeleton no text', async() => {
			const elem = await fixture(skeletonSetOnEachTabNoTextFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('ellipsis', async() => {
			const elem = await fixture(ellipsisFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('non-selected tab focus', async() => {
			const elem = await fixture(noPanelSelectedFixture[useFixture], { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('selected tab focus', async() => {
			const elem = await fixture(panelSelectedFixture[useFixture], { viewport });
			await focusElem(elem);
			await expect(elem).to.be.golden();
		});

		it('action slot', async() => {
			const elem = await fixture(actionSlotBasicFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

		it('no padding', async() => {
			const elem = await fixture(noPaddingFixture[useFixture], { viewport });
			await expect(elem).to.be.golden();
		});

	});

	describe('overflow', () => {

		const nextFixture = {
			deprecated: html`
				<d2l-tabs>
					<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
					<d2l-tab-panel text="Geology">Tab content for Geology</d2l-tab-panel>
				</d2l-tabs>
			`,
			paired: html`
				<d2l-tabs>
					<d2l-tab id="all" text="All Courses" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
					<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
					<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					<d2l-tab id="geology" text="Geology" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="geology" slot="panels">Tab content for Geology</d2l-tab-panel>
				</d2l-tabs>
			`
		};
		const previousFixture = {
			deprecated: html`
				<d2l-tabs>
					<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
					<d2l-tab-panel text="Geology" selected>Tab content for Geology</d2l-tab-panel>
				</d2l-tabs>
			`,
			paired: html`
				<d2l-tabs>
					<d2l-tab id="all" text="All Courses" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
					<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					<d2l-tab id="geology" text="Geology" slot="tabs" selected></d2l-tab>
					<d2l-tab-panel labelled-by="geology" slot="panels">Tab content for Geology</d2l-tab-panel>
				</d2l-tabs>
			`
		};

		['ltr', 'rtl'].forEach((dir) => {

			const rtl = dir === 'rtl';

			describe(dir, () => {

				it('scroll next', async() => {
					const elem = await fixture(nextFixture[useFixture], { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('scrolls next on click', async() => {
					const elem = await fixture(nextFixture[useFixture], { viewport, rtl });
					await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
					await expect(elem).to.be.golden();
				});

				it('scroll previous', async() => {
					const elem = await fixture(previousFixture[useFixture], { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('scrolls previous on click', async() => {
					const elem = await fixture(previousFixture[useFixture], { viewport, rtl });
					await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
					await expect(elem).to.be.golden();
				});

				it('action slot', async() => {
					const elem = await fixture(actionSlotOverflowFixture[useFixture], { viewport, rtl });
					await expect(elem).to.be.golden();
				});

				it('focus next', async() => {
					const elem = await fixture(nextFixture[useFixture], { viewport, rtl });
					await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
					await expect(elem).to.be.golden();
				});

				it('focus previous', async() => {
					const elem = await fixture(previousFixture[useFixture], { viewport, rtl });
					await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button'));
					await expect(elem).to.be.golden();
				});
			});

		});

	});

	describe('max-to-show', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(maxToShowFixture[useFixture], { viewport });
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

		const keyboardFixture = {
			deprecated: html`
				<d2l-tabs>
					<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
					<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
					<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`,
			paired: html`
				<d2l-tabs>
					<d2l-tab id="all" text="All Courses" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
					<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
					<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
				</d2l-tabs>
			`
		};

		it('focuses next on right arrow', async() => {
			const elem = await fixture(keyboardFixture[useFixture], { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('focuses previous on left arrow', async() => {
			const elem = await fixture(keyboardFixture[useFixture], { viewport });
			await sendKeysElem(elem, 'press', 'ArrowLeft');
			await expect(elem).to.be.golden();
		});

		it('focuses first on right arrow from last', async() => {
			const elem = await fixture(keyboardFixture[useFixture], { viewport });
			await sendKeysElem(elem, 'press', 'ArrowRight+ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('focuses last on left arrow from first', async() => {
			const elem = await fixture(keyboardFixture[useFixture], { viewport });
			await sendKeysElem(elem, 'press', 'ArrowLeft+ArrowLeft');
			await expect(elem).to.be.golden();
		});

		['Space', 'Enter'].forEach((key) => {
			const keyboardSelectionFixture = {
				deprecated: html`
					<d2l-tabs>
						<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
						<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				`,
				paired: html`
					<d2l-tabs>
						<d2l-tab id="all" text="All Courses" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				`
			};
			it(`selects on ${key}`, async() => {
				const elem = await fixture(keyboardSelectionFixture[useFixture], { viewport });
				await sendKeysElem(elem, 'press', `ArrowRight+${key}`);
				await expect(elem).to.be.golden();
			});
		});

	});

	describe('slots', () => {
		if (useFixture === 'default') return;

		const slotsFixture = html`
			<d2l-tabs>
				<d2l-tab id="beforelong" text="Long Panel Text That Will Also Have Slot Content" slot="tabs">
					<d2l-icon icon="tier1:gear" slot="before"></d2l-icon>
				</d2l-tab>
				<d2l-tab id="beforeafter" text="All" slot="tabs">
					<d2l-count-badge number="5" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
					<d2l-count-badge number="10" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="afterlong" text="Long Panel Text That Will Also Have Slot Content" slot="tabs">
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="beforeshort" text="All" slot="tabs">
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="aftershort" text="All" slot="tabs">
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab-panel labelled-by="beforelong" slot="panels">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel labelled-by="afterlong" slot="panels">Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel labelled-by="beforeshort" slot="panels">Tab content for Chemistry</d2l-tab-panel>
				<d2l-tab-panel labelled-by="aftershort" slot="panels">Tab content for Physics</d2l-tab-panel>
				<d2l-tab-panel labelled-by="beforeafter" slot="panels">Tab content for Trig</d2l-tab-panel>
			</d2l-tabs>
		`;
		const slotsSkeletonFixture = html`
			<d2l-tabs skeleton>
				<d2l-tab id="beforelong" text="Long Panel Text That Will Also Have Slot Content" slot="tabs" skeleton>
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="beforeafter" text="All" slot="tabs" skeleton>
					<d2l-count-badge number="5" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
					<d2l-count-badge number="10" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="afterlong" text="Long Panel Text That Will Also Have Slot Content" slot="tabs" skeleton>
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="beforeshort" text="All" slot="tabs" skeleton>
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="aftershort" text="All" slot="tabs" skeleton>
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab-panel labelled-by="beforelong" slot="panels">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel labelled-by="afterlong" slot="panels">Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel labelled-by="beforeshort" slot="panels">Tab content for Chemistry</d2l-tab-panel>
				<d2l-tab-panel labelled-by="aftershort" slot="panels">Tab content for Physics</d2l-tab-panel>
				<d2l-tab-panel labelled-by="beforeafter" slot="panels">Tab content for Trig</d2l-tab-panel>
			</d2l-tabs>
		`;
		const slotsSkeletonNoTextFixture = html`
			<d2l-tabs skeleton>
				<d2l-tab id="beforelong" text="Long Panel Text That Will Also Have Slot Content" slot="tabs" skeleton>
					<d2l-count-badge number="100" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab id="beforeafter" slot="tabs" skeleton>
					<d2l-count-badge number="5" size="small" text="100 new notifications" type="notification" slot="before"></d2l-count-badge>
					<d2l-count-badge number="10" size="small" text="100 new notifications" type="notification" slot="after"></d2l-count-badge>
				</d2l-tab>
				<d2l-tab-panel labelled-by="beforelong" slot="panels">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel labelled-by="beforeafter" slot="panels">Tab content for Trig</d2l-tab-panel>
			</d2l-tabs>
		`;

		it('default', async() => {
			const elem = await fixture(slotsFixture);
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			const elem = await fixture(slotsFixture);
			await focusElem(elem);
			await expect(elem).to.be.golden();
		});

		it('focus both slots', async() => {
			const elem = await fixture(slotsFixture);
			await sendKeysElem(elem, 'press', 'ArrowRight');
			await expect(elem).to.be.golden();
		});

		it('hover with icon when selected', async() => {
			const elem = await fixture(slotsFixture);
			const listitem = elem.querySelector('d2l-tab');
			await hoverElem(listitem);
			await expect(elem).to.be.golden();
		});

		it('hover with icon when not selected', async() => {
			const elem = await fixture(slotsFixture);
			elem.querySelectorAll('d2l-tab')[1].selected = true;
			await elem.updateComplete;
			const listitem = elem.querySelector('d2l-tab');
			await hoverElem(listitem);
			await expect(elem).to.be.golden();
		});

		it('skeleton', async() => {
			const elem = await fixture(slotsSkeletonFixture);
			await expect(elem).to.be.golden();
		});

		it('skeleton no text', async() => {
			const elem = await fixture(slotsSkeletonNoTextFixture);
			await expect(elem).to.be.golden();
		});
	});

	describe('deprecated structure', () => {

		describe('basic', () => {
			it('no panel selected', async() => {
				const elem = await fixture(noPanelSelectedFixture['deprecated'], { viewport });
				await expect(elem).to.be.golden();
			});

			it('panel selected', async() => {
				const elem = await fixture(panelSelectedFixture['deprecated'], { viewport });
				await expect(elem).to.be.golden();
			});

			it('one tab', async() => {
				const elem = await fixture(oneTabFixture['deprecated'], { viewport });
				await expect(elem).to.be.golden();
			});
		});

		describe('overflow', () => {
			const nextFixture = {
				deprecated: html`
					<d2l-tabs>
						<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
						<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
						<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
						<d2l-tab-panel text="Geology">Tab content for Geology</d2l-tab-panel>
					</d2l-tabs>
				`
			};

			['ltr', 'rtl'].forEach((dir) => {

				const rtl = dir === 'rtl';

				describe(dir, () => {

					it('scroll next', async() => {
						const elem = await fixture(nextFixture['deprecated'], { viewport, rtl });
						await expect(elem).to.be.golden();
					});

					it('scrolls next on click', async() => {
						const elem = await fixture(nextFixture['deprecated'], { viewport, rtl });
						await clickElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
						await expect(elem).to.be.golden();
					});

					it('action slot', async() => {
						const elem = await fixture(actionSlotOverflowFixture['deprecated'], { viewport, rtl });
						await expect(elem).to.be.golden();
					});

					it('focus next', async() => {
						const elem = await fixture(nextFixture['deprecated'], { viewport, rtl });
						await focusElem(elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button'));
						await expect(elem).to.be.golden();
					});
				});
			});
		});

		describe('keyboard', () => {

			const keyboardFixture = {
				deprecated: html`
					<d2l-tabs>
						<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
						<d2l-tab-panel text="Biology" selected>Tab content for Biology</d2l-tab-panel>
						<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				`
			};

			it('focuses next on right arrow', async() => {
				const elem = await fixture(keyboardFixture['deprecated'], { viewport });
				await sendKeysElem(elem, 'press', 'ArrowRight');
				await expect(elem).to.be.golden();
			});

			['Space', 'Enter'].forEach((key) => {
				const keyboardSelectionFixture = {
					deprecated: html`
						<d2l-tabs>
							<d2l-tab-panel text="All Courses">Tab content for All</d2l-tab-panel>
							<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
						</d2l-tabs>
					`
				};
				it(`selects on ${key}`, async() => {
					const elem = await fixture(keyboardSelectionFixture['deprecated'], { viewport });
					await sendKeysElem(elem, 'press', `ArrowRight+${key}`);
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});

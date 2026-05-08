import { createTabs, pageHeaderCustomFixtures } from './page-header-custom-fixtures.js';
import { expect, fixture, focusElem, html, nextFrame } from '@brightspace-ui/testing';

describe('d2l-page-header-custom', () => {

	it('band-custom-color', async() => {
		const elem = await fixture(html`<div style="--d2l-branding-primary-color: #ff0000;">${pageHeaderCustomFixtures.topBottomSkipNav}</div>`);
		await expect(elem).to.be.golden();
	});

	it('band-tabs-no-overflow', async() => {
		const elem = await fixture(html`
			<d2l-page-header-custom has-skip-nav>
				${createTabs(3)}
				<div slot="top">Stuff in the top</div>
			</d2l-page-header-custom>`
		);
		await expect(elem).to.be.golden();
	});

	it('band-tabs-overflow-right', async() => {
		const elem = await fixture(html`
			<d2l-page-header-custom has-skip-nav>
				${createTabs(30)}
				<div slot="top">Stuff in the top</div>
			</d2l-page-header-custom>`
		);
		await expect(elem).to.be.golden();
	});

	it('band-tabs-overflow-both', async() => {
		const elem = await fixture(html`
			<d2l-page-header-custom has-skip-nav>
				${createTabs(30)}
				<div slot="top">Stuff in the top</div>
			</d2l-page-header-custom>`
		);
		const tabs = elem.querySelector('div[slot="band"]');
		const selectedTab = tabs.querySelector('div:nth-child(15)');
		tabs.dispatchEvent(
			new CustomEvent(
				'd2l-page-band-slot-scroll-request',
				{ detail: { pointToCenter: selectedTab.offsetLeft + (selectedTab.offsetWidth / 2) }, bubbles: true, composed: true }
			)
		);
		await nextFrame();
		await expect(elem).to.be.golden();
	});

	it('band-tabs-overflow-left', async() => {
		const elem = await fixture(html`
			<d2l-page-header-custom has-skip-nav>
				${createTabs(30)}
				<div slot="top">Stuff in the top</div>
			</d2l-page-header-custom>`
		);
		const tabs = elem.querySelector('div[slot="band"]');
		const selectedTab = tabs.querySelector('div:nth-child(30)');
		tabs.dispatchEvent(
			new CustomEvent(
				'd2l-page-band-slot-scroll-request',
				{ detail: { pointToCenter: selectedTab.offsetLeft + (selectedTab.offsetWidth / 2) }, bubbles: true, composed: true }
			)
		);
		await nextFrame();
		await expect(elem).to.be.golden();
	});

	it('top', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.top);
		await expect(elem).to.be.golden();
	});

	it('bottom', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.bottom);
		await expect(elem).to.be.golden();
	});

	it('top-bottom', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.topBottomSkipNav);
		await expect(elem).to.be.golden();
	});

	it('bottom-color', async() => {
		const elem = await fixture(html`
			<d2l-page-header-custom style="--d2l-page-header-bottom-background-color: #ff0000;">
				<div slot="top">Top</div>
				<div slot="bottom" style="color: white;">Bottom</div>
			</d2l-page-header-custom>`
		);
		await expect(elem).to.be.golden();
	});

	it('skip-nav', async() => {
		const elem = await fixture(pageHeaderCustomFixtures.topBottomSkipNav);
		await focusElem(elem.shadowRoot.querySelector('d2l-skip-nav-main'));
		await expect(elem).to.be.golden();
	});

});

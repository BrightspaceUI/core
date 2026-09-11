import { expect, fixture } from '@brightspace-ui/testing';
import { panelFixtures } from './panel-fixtures.js';

describe('page-main', () => {
	describe('header', () => {
		[
			{ name: 'none', fixture: panelFixtures.main },
			{ name: 'start', fixture: panelFixtures.mainHeaderStart },
			{ name: 'end', fixture: panelFixtures.mainHeaderEnd },
			{ name: 'start-end', fixture: panelFixtures.mainHeaderStartEnd },
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		it('rtl', async() => {
			const elem = await fixture(panelFixtures.mainHeaderStartEnd, { rtl: true });
			await expect(elem).to.be.golden({ margin: 0 });
		});
	});
});

describe('page-side-nav', () => {
	describe('header', () => {
		[
			{ name: 'none', fixture: panelFixtures.sideNav },
			{ name: 'start', fixture: panelFixtures.sideNavHeaderStart },
			{ name: 'end', fixture: panelFixtures.sideNavHeaderEnd },
			{ name: 'start-end', fixture: panelFixtures.sideNavHeaderStartEnd },
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		it('rtl', async() => {
			const elem = await fixture(panelFixtures.sideNavHeaderStartEnd, { rtl: true });
			await expect(elem).to.be.golden({ margin: 0 });
		});
	});
});

describe('page-supporting', () => {
	describe('header', () => {
		[
			{ name: 'none', fixture: panelFixtures.supporting },
			{ name: 'start', fixture: panelFixtures.supportingHeaderStart },
			{ name: 'end', fixture: panelFixtures.supportingHeaderEnd },
			{ name: 'start-end', fixture: panelFixtures.supportingHeaderStartEnd },
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				await expect(elem).to.be.golden({ margin: 0 });
			});
		});

		it('rtl', async() => {
			const elem = await fixture(panelFixtures.supportingHeaderStartEnd, { rtl: true });
			await expect(elem).to.be.golden({ margin: 0 });
		});
	});
});

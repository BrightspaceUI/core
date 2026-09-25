import '../page.js';
import { clearStoredPanelState, openPanel, setStoredPanelState, TEST_STATE_STORAGE_KEY } from './page-fixtures.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

// TO DO: See if we can remove once we are handling <h1> and page title setting
const rulesToIgnore = ['document-title', 'page-has-heading-one'];

const singlePanel = html`
	<d2l-page>
		<div slot="header">Header</div>
		<div>Content</div>
		<div slot="footer">Footer</div>
	</d2l-page>
`;

const sideNavPanel = html`
	<d2l-page state-storage-key="${TEST_STATE_STORAGE_KEY}">
		<div slot="header">Header</div>
		<div>Content</div>
		<div slot="side-nav">Side Nav</div>
		<div slot="footer">Footer</div>
	</d2l-page>
`;

const supportingPanel = html`
	<d2l-page state-storage-key="${TEST_STATE_STORAGE_KEY}">
		<div slot="header">Header</div>
		<div>Content</div>
		<div slot="supporting">Supporting</div>
		<div slot="footer">Footer</div>
	</d2l-page>
`;

describe('page', () => {
	afterEach(() => {
		clearStoredPanelState();
	});

	it('single panel', async() => {
		await fixture(singlePanel, { viewport: { width: 1300 } });
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with side-nav panel', async() => {
		await fixture(sideNavPanel, { viewport: { width: 1300 } });
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with side-nav panel collapsed', async() => {
		setStoredPanelState({ 'side-nav': { size: 400, collapsed: true } });
		await fixture(sideNavPanel, { viewport: { width: 1300 } });
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with supporting panel', async() => {
		await fixture(supportingPanel, { viewport: { width: 1300 } });
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	it('with supporting panel collapsed', async() => {
		setStoredPanelState({ 'supporting': { size: 400, collapsed: true } });
		await fixture(supportingPanel, { viewport: { width: 1300 } });
		await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
	});

	describe('overlay mode', () => {
		it('single panel', async() => {
			await fixture(singlePanel, { viewport: { width: 800 } });
			await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
		});

		it('with side-nav panel', async() => {
			await fixture(sideNavPanel, { viewport: { width: 800 } });
			await openPanel(document.querySelector('d2l-page'), 'side-nav-overlay');
			await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
		});

		it('with side-nav panel collapsed', async() => {
			await fixture(sideNavPanel, { viewport: { width: 800 } });
			await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
		});

		it('with supporting panel', async() => {
			await fixture(supportingPanel, { viewport: { width: 800 } });
			await openPanel(document.querySelector('d2l-page'), 'supporting-overlay');
			await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
		});

		it('with supporting panel collapsed', async() => {
			await fixture(supportingPanel, { viewport: { width: 800 } });
			await expect(document).to.be.accessible({ ignoredRules: rulesToIgnore });
		});
	});

	describe('mobile mode', () => {
		// TO DO
	});
});

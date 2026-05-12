
import '../dropdown-tabs.js';
import '../dropdown.js';
import '../../tabs/tabs.js';
import '../../tabs/tab.js';
import '../../tabs/tab-panel.js';
import { expect, fixture } from '@brightspace-ui/testing';
import { html } from 'lit';

const dropdownTabs = html`
	<d2l-dropdown>
		<button>Open it!</button>
		<d2l-dropdown-tabs>
			<d2l-tabs text="Tabs">
				<d2l-tab id="first" text="First" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="first" slot="panels">first content</d2l-tab-panel>
				<d2l-tab id="second" text="Second" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="second" slot="panels">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				</d2l-tab-panel>
				<d2l-tab id="third" text="Third" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="third" slot="panels">third content</d2l-tab-panel>
				<d2l-tab id="fourth" text="Fourth" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="fourth" slot="panels">fourth content</d2l-tab-panel>
				<d2l-tab id="fifth" text="Fifth" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="fifth" slot="panels">fifth content</d2l-tab-panel>
			</d2l-tabs>
		</d2l-dropdown-tabs>
	</d2l-dropdown>
`;

describe('d2l-dropdown-tabs', () => {
	describe('rendering', () => {
		it('should resize for large content', async() => {
			const el = await fixture(dropdownTabs);
			el.querySelector('d2l-dropdown-tabs').open(el.querySelector('button'));
			el.querySelector('d2l-tab#second').click();
			await expect(document).to.be.golden();
		});
	});
});

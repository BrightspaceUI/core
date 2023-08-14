import '../dialog.js';
import '../dialog-fullscreen.js';
import { dropdowns, filter, footer, general } from './dialog-shared-contents.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

const dialog = html`
	<d2l-dialog title-text="Dialog Title" opened>
		${general}${dropdowns}${filter}${footer}
	</d2l-dialog>
`;

const fullscreenDialog = html`
	<d2l-dialog-fullscreen title-text="Dialog Title" opened>
		${general}${dropdowns}${filter}${footer}
	</d2l-dialog-fullscreen>
`;

const nestedDialogs = html`
	<d2l-dialog-fullscreen title-text="Dialog Title" opened>
		<div id="top">Parent</div>
		<d2l-dialog title-text="Child Dialog" width="400" opened>
			<div>Child</div>
			<div>Line 1</div>
			<div>Line 2</div>
			<div>Line 3</div>
			<div>Line 4</div>
			<div>Bottom</div>
			${dropdowns}
			${filter}
		</d2l-dialog>
		${footer}
	</d2l-dialog-fullscreen>
`;

async function openDropdown(dropdown) {
	dropdown.toggleOpen();
	await oneEvent(dropdown, 'd2l-dropdown-open');
}

async function openFilter(filter) {
	filter.opened = true;
	await oneEvent(filter, 'd2l-filter-dimension-first-open');
}

describe('dialog-with-mobile-dropdown', () => {

	['native', 'custom'].forEach((type) => {

		describe(type, () => {
			before(async() => {
				window.D2L.DialogMixin.preferNative = type === 'native';
			});

			describe('default-breakpoint', () => {
				[
					{ name: 'opened', f: dialog },
					{ name: 'left', f: dialog, action: async(elem) => openDropdown(elem.querySelector('#mobile-left')) },
					{ name: 'bottom', f: dialog, action: async(elem) => openDropdown(elem.querySelector('#mobile-bottom')) },
					{ name: 'filter', f: dialog, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) },
					{ name: 'left-fullscreen', f: fullscreenDialog, action: async(elem) => openDropdown(elem.querySelector('#mobile-left')) },
					{ name: 'bottom-fullscreen', f: fullscreenDialog, action: async(elem) => openDropdown(elem.querySelector('#mobile-bottom')) },
					{ name: 'filter-fullscreen', f: fullscreenDialog, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) },
					{ name: 'left-nested', f: nestedDialogs, action: async(elem) => openDropdown(elem.querySelector('#mobile-left')) },
					{ name: 'bottom-nested', f: nestedDialogs, action: async(elem) => openDropdown(elem.querySelector('#mobile-bottom')) },
					{ name: 'filter-nested', f: nestedDialogs, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) }
				].forEach(({ name, f, action }) => {
					it(name, async() => {
						const elem = await fixture(f, { viewport: { width: 600, height: 500 } });
						if (action) await action(elem);
						await expect(document).to.be.golden();
					});
				});
			});

			describe('filter-breakpoint', () => {
				[
					{ name: 'filter', f: dialog, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) },
					{ name: 'filter-fullscreen', f: fullscreenDialog, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) },
					{ name: 'filter-nested', f: nestedDialogs, action: async(elem) => openFilter(elem.querySelector('d2l-filter')) }
				].forEach(({ name, f, action }) => {
					it(name, async() => {
						const elem = await fixture(f, { viewport: { width: 750, height: 500 } });
						if (action) await action(elem);
						await expect(document).to.be.golden();
					});
				});
			});
		});
	});
});

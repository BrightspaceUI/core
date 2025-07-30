import '../../button/button.js';
import '../../button/button-icon.js';
import '../../colors/colors.js';
import '../../link/link.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-content.js';
import '../../paging/pager-load-more.js';
import '../../selection/selection-action.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../tooltip/tooltip.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

function createSimpleList(opts) {
	const { color1, color2, extendSeparators, separatorType, addButton, addButtonText } = { extendSeparators: false, addButton: false, ...opts };
	return html`
		<d2l-list
			?extend-separators="${extendSeparators}"
			separators="${ifDefined(separatorType)}"
			style="width: 400px"
			?add-button="${addButton}"
			add-button-text="${ifDefined(addButtonText)}">
			<d2l-list-item label="1" color="${ifDefined(color1)}">Item 1</d2l-list-item>
			<d2l-list-item label="2" color="${ifDefined(color2)}">Item 2</d2l-list-item>
			<d2l-list-item>Item 3</d2l-list-item>
		</d2l-list>
	`;
}

describe('list', () => {
	describe('general', () => {
		it('simple', async() => {
			const elem = await fixture(createSimpleList({ color1: '#0000ff' }));
			await expect(elem).to.be.golden();
		});

		it('no-padding', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item label="1" padding-type="none">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('no-padding add-button', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px" add-button>
					<d2l-list-item label="1" padding-type="none">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
	});

	describe('illustration', () => {
		it('default', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="illustration" style="background-color: blue; height: 400px; width: 400px;"></div>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
	});

	describe('separators', () => {
		[
			{ name: 'default', template: createSimpleList({ color1: '#0000ff' }) },
			{ name: 'none', template: createSimpleList({ color1: '#00ff00', color2: '#00ff00', separatorType: 'none' }) },
			{ name: 'all', template: createSimpleList({ separatorType: 'all' }) },
			{ name: 'between', template: createSimpleList({ separatorType: 'between' }) },
			{ name: 'extended', template: createSimpleList({ color1: '#00ff00', extendSeparators: true }) }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('actions', () => {
		function createActionsList(opts) {
			const { extendSeparators } = { extendSeparators: false, ...opts };
			return html`
				<d2l-list ?extend-separators="${extendSeparators}" style="width: 400px;">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-link href="http://www.d2l.com">Action 1</d2l-link>
							<d2l-button-icon text="Action 2" icon="tier1:preview"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createActionsList() },
			{ name: 'extended separators', template: createActionsList({ extendSeparators: true }) },
			{ name: 'rtl', rtl: true, template: html`
				<d2l-list style="width: 400px;">
					<d2l-list-item>
						<div slot="illustration" style="background-color: blue; height: 400px; width: 400px;"></div>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-button-icon text="Action 1" icon="tier1:preview"></d2l-button-icon>
							<d2l-button-icon text="Action 2" icon="tier1:more"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			` },
		].forEach(({ name, template, rtl }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('pager', () => {
		[
			{ name: 'default', extendSeparators: false },
			{ name: 'extended separators', extendSeparators: true }
		].forEach(({ name, extendSeparators }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list ?extend-separators="${extendSeparators}" style="width: 400px;">
						<d2l-list-item label="Item 1" selectable key="1">
							<d2l-list-item-content>
								<div>Item 1</div>
								<div slot="supporting-info">Supporting info</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item label="Item 2" selectable key="2">
							<d2l-list-item-content>
								<div>Item 2</div>
								<div slot="supporting-info">Supporting info</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more>
					</d2l-list>
				`);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('breakpoints', () => {
		[
			{ name: '842', width: 900, color: '#00ff00' },
			{ name: '636', width: 700 },
			{ name: '580', width: 600 },
			{ name: '0', width: 490 },
			{ name: 'list', width: 900, breakpoints: '[1170, 391, 0, 0]', color: '#00ff00', largeSecondItem: true }
		].forEach(({ name, width, breakpoints, color, largeSecondItem = false }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list breakpoints="${ifDefined(breakpoints)}" style="width: ${width}px;">
						<d2l-list-item label="Item 1" color="${ifDefined(color)}">
							<div style="background: blue; height: 400px; width: 400px;" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item label="Item 2">
							<div style="background: blue; ${largeSecondItem ? 'height: 400px; width: 400px;' : 'height: 42px; width: 42px;'}" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
				`, { viewport: { width: 1000 } });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('href', () => {
		[
			{ name: 'default' },
			{ name: 'focus', action: focusElem, margin: 24 },
			{ name: 'hover', action: hoverElem, margin: 24 }
		].forEach(({ name, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list style="width: 400px;">
						<d2l-list-item label="Item" href="http://www.d2l.com">
							<d2l-list-item-content>
								<div>Item 1</div>
								<div slot="supporting-info">Secondary info for item 1</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
				`);
				if (action) await action(elem.querySelector('d2l-list-item'));
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

	describe('controls', () => {

		it('not selectable actions', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px;">
					<d2l-list-controls slot="controls" no-selection no-sticky>
						<d2l-selection-action text="Delete" icon="tier1:delete"></d2l-selection-action>
						<d2l-selection-action text="Edit" icon="tier1:edit"></d2l-selection-action>
					</d2l-list-controls>
					<d2l-list-item label="Item 1" key="1">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" key="2">Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});
		[
			{ actionName: 'top', action: elem => elem.scrollTo(0, 0) },
			{ actionName: 'scrolled', action: elem => elem.scrollTo(0, 45) },
			{ actionName: 'scrolled hover', action: async(elem) => {
				elem.scrollTo(0, 45);
				await hoverElem(elem.querySelector('[key="1"] [slot="supporting-info"]'));
			} }
		].forEach(({ actionName, action }) => {
			[
				{ name: 'sticky' },
				{ name: 'sticky color', color1: '#ff0000' },
				{ name: 'sticky extended separators', extendSeparators: true },
				{ name: 'sticky extended separators color', color2: '#00ff00', extendSeparators: true }
			].forEach(({ name, color1, color2, extendSeparators = false }) => {
				it(`${name}-${actionName}`, async() => {
					const elem = await fixture(html`
						<div style="height: 200px; overflow: scroll; width: 400px;">
							<d2l-list style="padding: 0 20px;" ?extend-separators="${extendSeparators}">
								<d2l-list-controls slot="controls"></d2l-list-controls>
								<d2l-list-item label="Item 1" selectable key="1" color="${ifDefined(color1)}">
									<d2l-list-item-content>
										<div>Item 1</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item label="Item 2" selectable key="2" color="${ifDefined(color2)}">
									<d2l-list-item-content>
										<div>Item 2</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item label="Item 3" selectable key="3">
									<d2l-list-item-content>
										<div>Item 3</div>
										<div slot="supporting-info">Supporting info</div>
									</d2l-list-item-content>
								</d2l-list-item>
							</d2l-list>
						</div>
					`);
					await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('action types', () => {
		const listWithDropdownTooltip = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item>
					Item 1
					<div slot="actions">
						<d2l-dropdown id="open-down">
							<button id="dropdown-btn-down" class="d2l-dropdown-opener">Open</button>
							<d2l-tooltip class="vdiff-include" for="dropdown-btn-down" position="bottom">Cookie pie apple pie</d2l-tooltip>
							<d2l-dropdown-content class="vdiff-include">donut gummies</d2l-dropdown-content>
						</d2l-dropdown>
					</div>
				</d2l-list-item>
				<d2l-list-item>Item 2</d2l-list-item>
				<d2l-list-item>Item 3</d2l-list-item>
			</d2l-list>
		`;

		it('dropdown open down', async() => {
			const elem = await fixture(listWithDropdownTooltip);
			const dropdown = elem.querySelector('d2l-dropdown');
			setTimeout(() => dropdown.toggleOpen());
			await oneEvent(dropdown, 'd2l-dropdown-open');
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('tooltip open down', async() => {
			const elem = await fixture(listWithDropdownTooltip);
			const tooltip = elem.querySelector('d2l-tooltip');
			setTimeout(() => tooltip.show());
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});
});

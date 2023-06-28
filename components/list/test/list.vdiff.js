import '../../button/button-icon.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../link/link.js';
import '../../tooltip/tooltip.js';
import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import { expect, fixture, focusElem, hoverElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

const buttonFixture = html`
	<d2l-list style="width: 400px">
		<d2l-list-item-button>
			<d2l-list-item-content>
				<div>Item 1</div>
				<div slot="supporting-info">Secondary info for item 1</div>
			</d2l-list-item-content>
		</d2l-list-item-button>
	</d2l-list>
`;

const dropdownTooltipFixture = html`
	<d2l-list style="width: 400px;">
		<d2l-list-item>
			Item 1
			<div slot="actions">
				<d2l-dropdown>
					<button id="dropdown-btn-down" class="d2l-dropdown-opener">Open</button>
					<d2l-tooltip for="dropdown-btn-down" position="bottom">Cookie pie apple pie</d2l-tooltip>
					<d2l-dropdown-content>donut gummies</d2l-dropdown-content>
				</d2l-dropdown>
			</div>
		</d2l-list-item>
		<d2l-list-item>Item 2</d2l-list-item>
		<d2l-list-item>Item 3</d2l-list-item>
	</d2l-list>
`;

const hrefFixture = html`
	<d2l-list style="width: 400px">
		<d2l-list-item href="http://www.d2l.com">
			<d2l-list-item-content>
				<div>Item 1</div>
				<div slot="supporting-info">Secondary info for item 1</div>
			</d2l-list-item-content>
		</d2l-list-item>
	</d2l-list>
`;

const selectableFixture = html`
	<d2l-list style="width: 400px">
		<d2l-list-item label="Item 1" selectable key="1">Item 1</d2l-list-item>
		<d2l-list-item label="Item 2" selection-disabled selectable key="2">Item 2</d2l-list-item>
	</d2l-list>
`;

function createSimpleFixture(separatorType, extendSeparators = false) {
	return html`
		<d2l-list ?extend-separators="${extendSeparators}" separators="${ifDefined(separatorType)}" style="width: 400px">
			<d2l-list-item>Item 1</d2l-list-item>
			<d2l-list-item>Item 2</d2l-list-item>
			<d2l-list-item>Item 3</d2l-list-item>
		</d2l-list>
	`;
}

function createExpandCollapseFixture(expanded, selectable, draggable) {
	return html`
		<d2l-list style="width: 600px;">
			<d2l-list-item expandable ?expanded="${expanded}" ?selectable="${selectable}" ?draggable="${draggable}" key="L1-1">
				<d2l-list-item-content>
					<div>Level 1, Item 1</div>
					<div slot="supporting-info">Supporting text for top level list item</div>
				</d2l-list-item-content>
				<d2l-list slot="nested">
					<d2l-list-item ?selectable="${selectable}" ?draggable="${draggable}" key="L2-1">
						<d2l-list-item-content>
							<div>Level 2, Item 1</div>
							<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item expandable ?expanded="${expanded}" ?selectable="${selectable}" ?draggable="${draggable}" key="L2-2">
						<d2l-list-item-content>
							<div>Level 2, Item 2</div>
							<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
						</d2l-list-item-content>
						<d2l-list slot="nested">
							<d2l-list-item ?selectable="${selectable}" ?draggable="${draggable}" key="L3-1">
								<d2l-list-item-content>
									<div>Level 3, Item 1</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item ?selectable="${selectable}" ?draggable="${draggable}" key="L3-2">
								<d2l-list-item-content>
									<div>Level 3, Item 2</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			</d2l-list-item>
		</d2l-list>
	`;
}

describe('d2l-list', () => {

	describe('general', () => {

		it('simple', async() => {
			const elem = await fixture(createSimpleFixture());
			await expect(elem).to.be.golden();
		});

		it('no-padding', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item padding-type="none">Item 1</d2l-list-item>
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

		it('default', async() => {
			const elem = await fixture(createSimpleFixture());
			await expect(elem).to.be.golden();
		});

		it('none', async() => {
			const elem = await fixture(createSimpleFixture('none'));
			await expect(elem).to.be.golden();
		});

		it('all', async() => {
			const elem = await fixture(createSimpleFixture('all'));
			await expect(elem).to.be.golden();
		});

		it('between', async() => {
			const elem = await fixture(createSimpleFixture('between'));
			await expect(elem).to.be.golden();
		});

		it('extended', async() => {
			const elem = await fixture(createSimpleFixture(undefined, true));
			await expect(elem).to.be.golden();
		});

	});

	describe('actions', () => {

		it('default', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-link href="http://www.d2l.com">Action 1</d2l-link>
							<d2l-button-icon text="Action 2" icon="tier1:preview"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('extended separators', async() => {
			const elem = await fixture(html`
				<d2l-list extend-separators style="width: 400px">
					<d2l-list-item>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-link href="http://www.d2l.com">Action 1</d2l-link>
							<d2l-button-icon text="Action 2" icon="tier1:preview"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('rtl', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<div slot="illustration" style="background-color: blue; height: 400px; width: 400px;"></div>
						<div>Item 1</div>
						<div slot="actions">
							<d2l-button-icon text="Action 1" icon="tier1:preview"></d2l-button-icon>
							<d2l-button-icon text="Action 2" icon="tier1:more"></d2l-button-icon>
						</div>
					</d2l-list-item>
				</d2l-list>
			`, { rtl: true });
			await expect(elem).to.be.golden();
		});

	});

	describe('item-content', () => {

		const clampSingleStyle = 'overflow: hidden; overflow-wrap: anywhere; text-overflow: ellipsis; white-space: nowrap;';

		it('all', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div>Item 1</div>
							<div slot="secondary">Secondary Info for item 1</div>
							<div slot="supporting-info">Supporting info for item 1</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('no padding', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item padding-type="none">
						<d2l-list-item-content>
							<div>Item 1</div>
							<div slot="secondary">Secondary Info for item 1</div>
							<div slot="supporting-info">Supporting info for item 1</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('long wrapping', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div>Overflow: wrap. Primary text. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="secondary">Overflow: wrap. Secondary Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="supporting-info">Overflow: wrap. Supporting Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('long single line ellipsis', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div style="${clampSingleStyle}">Overflow: single-line, ellipsis. Primary text. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="secondary" style="${clampSingleStyle}">Overflow: single-line, ellipsis. Secondary Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="supporting-info" style="${clampSingleStyle}">Overflow: single-line, ellipsis. Supporting Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('long unbreakable single line ellipsis', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div style="${clampSingleStyle}">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
							<div slot="secondary" style="${clampSingleStyle}">bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
							<div slot="supporting-info" style="${clampSingleStyle}">ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('long single line ellipsis nested', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div><div style="${clampSingleStyle}">Overflow: single-line, ellipsis. Primary text. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div></div>
							<div slot="secondary"><div style="${clampSingleStyle}">Overflow: single-line, ellipsis. Secondary Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div></div>
							<div slot="supporting-info"><div style="${clampSingleStyle}">Overflow: single-line, ellipsis. Supporting Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div></div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('short single line ellipsis', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div style="${clampSingleStyle}">Overflow: single-line, ellipsis. Primary text.</div>
							<div slot="secondary" style="${clampSingleStyle}">Overflow: single-line, ellipsis. Secondary Info.</div>
							<div slot="supporting-info" style="${clampSingleStyle}">Overflow: single-line, ellipsis. Supporting Info.</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('long multi line ellipsis', async() => {
			const clampMultiStyle = '-webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere;';
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item>
						<d2l-list-item-content>
							<div style="${clampMultiStyle}">Overflow: multi-line, ellipsis. Primary text. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="secondary" style="${clampMultiStyle}">Overflow: multi-line, ellipsis. Secondary Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
							<div slot="supporting-info" style="${clampMultiStyle}">Overflow: multi-line, ellipsis. Supporting Info. Lookout take a caulk rope's end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

	});

	describe('href', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(hrefFixture);
		});

		it('default', async() => {
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('a'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('hover', async() => {
			await hoverElem(elem.querySelector('d2l-list-item'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

	});

	describe('button', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(buttonFixture);
		});

		it('default', async() => {
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(elem.querySelector('d2l-list-item-button').shadowRoot.querySelector('button'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('hover', async() => {
			await hoverElem(elem.querySelector('d2l-list-item-button'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

	});

	describe('button-disabled', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item-button button-disabled>
						<d2l-list-item-content>
							<div>Item 1</div>
							<div slot="supporting-info">Secondary info for item 1</div>
						</d2l-list-item-content>
					</d2l-list-item-button>
				</d2l-list>
			`);
		});

		it('default', async() => {
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(elem.querySelector('d2l-list-item-button').shadowRoot.querySelector('button'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('hover', async() => {
			await hoverElem(elem.querySelector('d2l-list-item-button'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

	});

	describe('selectable', () => {

		const selectableButtonFixture = html`
			<d2l-list style="width: 400px">
				<d2l-list-item-button label="Item 2" selection-disabled selectable key="3">Item 3</d2l-list-item-button>
				<d2l-list-item-button label="Item 2" selection-disabled button-disabled selectable key="4">Item 4</d2l-list-item-button>
			</d2l-list>
		`;

		const selectableSelectedFixture = html`
			<d2l-list style="width: 400px">
				<d2l-list-item label="Item 1" selectable key="1" selected>Item 1</d2l-list-item>
				<d2l-list-item label="Item 2" selection-disabled selectable key="2" selected>Item 2</d2l-list-item>
			</d2l-list>
		`;

		it('not selected', async() => {
			const elem = await fixture(selectableFixture);
			await expect(elem).to.be.golden();
		});

		it('not selected focus', async() => {
			const elem = await fixture(selectableFixture);
			await focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('d2l-selection-input'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('not selected hover', async() => {
			const elem = await fixture(selectableFixture);
			await hoverElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('selection-disabled hover', async() => {
			const elem = await fixture(selectableFixture);
			await hoverElem(elem.querySelector('[key="2"]'));
			await expect(elem).to.be.golden();
		});

		it('button selection-disabled hover', async() => {
			const elem = await fixture(selectableButtonFixture);
			await hoverElem(elem.querySelector('[key="3"]'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('button selection-disabled button-disabled hover', async() => {
			const elem = await fixture(selectableButtonFixture);
			await hoverElem(elem.querySelector('[key="4"]'));
			await expect(elem).to.be.golden();
		});

		it('selected', async() => {
			const elem = await fixture(selectableSelectedFixture);
			await expect(elem).to.be.golden();
		});

		it('selected focus', async() => {
			const elem = await fixture(selectableSelectedFixture);
			await focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('d2l-selection-input'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('selected focus', async() => {
			const elem = await fixture(selectableSelectedFixture);
			await hoverElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('item-content', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item label="Item 1" selectable key="1">
						<d2l-list-item-content>
							<div>Item 1</div>
							<div slot="supporting-info">Secondary info for item 1</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('skeleton', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-item label="Item 1" selectable key="1" skeleton>
						<d2l-list-item-content>
							<div>Item 1</div>
							<div slot="supporting-info">Secondary info for item 1</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('extended separators', async() => {
			const elem = await fixture(html`
				<d2l-list extend-separators style="width: 400px">
					<d2l-list-item label="Item 1" selectable key="1">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

	});

	describe('selectableHref', () => {

		const selectableHrefFixture = html`
			<d2l-list style="width: 400px">
				<d2l-list-item href="http://www.d2l.com" selectable key="href" label="Introductory Earth Sciences">
					<d2l-list-item-content>Introductory Earth Sciences</d2l-list-item-content>
					<div slot="actions">
						<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
					</div>
				</d2l-list-item>
			</d2l-list>
		`;

		it('hover href', async() => {
			const elem = await fixture(selectableHrefFixture);
			await hoverElem(elem.querySelector('d2l-list-item'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('hover selection', async() => {
			const elem = await fixture(selectableHrefFixture);
			await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('[slot="control"]'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('hover secondary action', async() => {
			const elem = await fixture(selectableHrefFixture);
			await hoverElem(elem.querySelector('d2l-button-icon'));
			await expect(elem).to.be.golden();
		});

	});

	describe('controls', () => {

		const stickyFixture = html`
			<div style="height: 200px; overflow: scroll; width: 400px;">
				<d2l-list>
					<d2l-list-controls slot="controls"></d2l-list-controls>
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
					<d2l-list-item label="Item 3" selectable key="3">
						<d2l-list-item-content>
							<div>Item 3</div>
							<div slot="supporting-info">Supporting info</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>
			</div>
		`;

		it('not selectable', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-controls slot="controls" no-selection no-sticky>
						<d2l-button-subtle text="Action"></d2l-button-subtle>
					</d2l-list-controls>
					<d2l-list-item label="Item 1">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2">Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('none selected', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item label="Item 1" selectable key="1">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" selection-disabled selectable key="2">Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('some selected', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item label="Item 1" selectable key="1" selected>Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" selection-disabled selectable key="2">Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

		it('all selected', async() => {
			const elem = await fixture(html`
				<d2l-list style="width: 400px">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item label="Item 1" selectable key="1" selected>Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" selection-disabled selectable key="2" selected>Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('all selected pages', async() => {
			const elem = await fixture(html`
				<d2l-list item-count="50" style="width: 400px">
					<d2l-list-controls slot="controls" select-all-pages-allowed no-sticky></d2l-list-controls>
					<d2l-list-item label="Item 1" selectable key="1" selected>Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" selection-disabled selectable key="2" selected>Item 2</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('sticky top', async() => {
			const elem = await fixture(stickyFixture);
			elem.scrollTo(0, 45);
			await nextFrame();
			elem.scrollTo(0, 0);
			await expect(elem).to.be.golden();
		});

		it('sticky scrolled', async() => {
			const elem = await fixture(stickyFixture);
			elem.scrollTo(0, 45);
			await expect(elem).to.be.golden();
		});

	});

	describe('draggable', () => {

		function createDraggableFixture(selectable = false) {
			return html`
				<d2l-list style="width: 400px">
					<d2l-list-item label="Item 1" draggable ?selectable="${selectable}" key="1" href="http://www.d2l.com">Item 1</d2l-list-item>
					<d2l-list-item label="Item 1" draggable ?selectable="${selectable}" key="2" href="http://www.d2l.com">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		it('default', async() => {
			const elem = await fixture(createDraggableFixture());
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			const elem = await fixture(createDraggableFixture());
			await focusElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden();
		});

		it('hover', async() => {
			const elem = await fixture(createDraggableFixture());
			await hoverElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden();
		});

		it('selectable', async() => {
			const elem = await fixture(createDraggableFixture(true));
			await expect(elem).to.be.golden();
		});

		it('selectable focus', async() => {
			const elem = await fixture(createDraggableFixture(true));
			await focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('d2l-selection-input'));
			await expect(elem).to.be.golden();
		});

		it('selectable hover', async() => {
			const elem = await fixture(createDraggableFixture(true));
			await hoverElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden();
		});

		it('extended separators', async() => {
			const elem = await fixture(html`
				<d2l-list extend-separators style="width: 400px">
					<d2l-list-item label="Item 1" draggable selectable key="1">Item 1</d2l-list-item>
				</d2l-list>
			`);
			await expect(elem).to.be.golden();
		});

	});

	describe('focus method', () => {

		it('href', async() => {
			const elem = await fixture(hrefFixture);
			await focusElem(elem.querySelector('d2l-list-item'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('button', async() => {
			const elem = await fixture(buttonFixture);
			await focusElem(elem.querySelector('d2l-list-item-button'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('selectable', async() => {
			const elem = await fixture(selectableFixture);
			await focusElem(elem.querySelector('[key="1"]'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('expandable', async() => {
			const elem = await fixture(createExpandCollapseFixture(false, false, false));
			await focusElem(elem.querySelector('d2l-list-item'));
			await expect(elem).to.be.golden();
		});

	});

	describe('breakpoitns', () => {
		[900, 700, 600, 490].forEach((breakpoint) => {
			it(breakpoint.toString(), async() => {
				const elem = await fixture(html`
					<d2l-list style="width: ${breakpoint}px">
						<d2l-list-item>
							<div style="background: blue; height: 400px; width: 400px;" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<div style="background: blue; height: 42px; width: 42px;" slot="illustration"></div>
							<d2l-list-item-content>
								<div>Introductory Pirate Ipsum</div>
								<div slot="supporting-info">Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters.</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
				`);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('dropdown', () => {

		it('open down', async() => {
			const elem = await fixture(dropdownTooltipFixture);
			const dropdown = elem.querySelector('d2l-dropdown');
			setTimeout(() => dropdown.toggleOpen());
			await oneEvent(dropdown, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});

	});

	describe('tooltip', () => {

		it('open down', async() => {
			const elem = await fixture(dropdownTooltipFixture);
			const tooltip = elem.querySelector('d2l-tooltip');
			setTimeout(() => tooltip.show());
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

	});

	describe('nested', () => {

		function createNestedFixture(selectedType) {
			return html`
				<d2l-list style="width: 600px;">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<div slot="actions">
							<button>action 1</button>
							<button>action 2</button>
						</div>
						<d2l-list slot="nested" separators="between">
							<d2l-list-item selectable ?selected="${selectedType === 'all'}" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable key="L2-2">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" separators="between">
									<d2l-list-item selectable ?selected="${selectedType === 'all'}" key="L3-1">
										<d2l-list-item-content>
											<div>Level 3, Item 1</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item selectable ?selected="${selectedType === 'all' || selectedType === 'some'}" key="L3-2">
										<d2l-list-item-content>
											<div>Level 3, Item 2</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		it('none-selected', async() => {
			const elem = await fixture(createNestedFixture('none'));
			await expect(elem).to.be.golden();
		});

		it('some-selected', async() => {
			const elem = await fixture(createNestedFixture('some'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('all-selected', async() => {
			const elem = await fixture(createNestedFixture('all'));
			await expect(elem).to.be.golden({ margin: 24 });
		});

	});

	describe('expand-collapse', () => {

		it('default', async() => {
			const elem = await fixture(createExpandCollapseFixture(false, false, false));
			await expect(elem).to.be.golden();
		});

		it('default expanded', async() => {
			const elem = await fixture(createExpandCollapseFixture(true, false, false));
			await expect(elem).to.be.golden();
		});

		it('selectable', async() => {
			const elem = await fixture(createExpandCollapseFixture(true, true, false));
			await expect(elem).to.be.golden();
		});

		it('draggable', async() => {
			const elem = await fixture(createExpandCollapseFixture(true, false, true));
			await expect(elem).to.be.golden();
		});

		it('selectable draggable', async() => {
			const elem = await fixture(createExpandCollapseFixture(true, true, true));
			await expect(elem).to.be.golden();
		});

		it('button focus', async() => {
			const elem = await fixture(createExpandCollapseFixture(false, false, false));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-icon'));
			await expect(elem).to.be.golden();
		});

	});

});

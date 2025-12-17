import '../../button/button.js';
import '../../button/button-icon.js';
import '../../colors/colors.js';
import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import '../../icons/icon.js';
import '../../link/link.js';
import '../../paging/pager-load-more.js';
import '../../selection/selection-action.js';
import '../../tooltip/tooltip.js';
import '../../tooltip/tooltip-help.js';
import '../demo/demo-list-nested-iterations-helper.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../list-item-content.js';
import '../list-item-nav.js';
import { expect, fixture, focusElem, hoverElem, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { listLayouts } from '../list.js';
import { nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const simpleListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="supporting-info">Secondary info for item 1</div>
	</d2l-list-item-content>
`;

const interactiveListItemContent = html`
	<d2l-list-item-content>
		<div>Item 1</div>
		<div slot="secondary" style="padding: 5px;">Information: <d2l-tooltip-help text="Due: Jan 30, 2023">Available: Aug 11, 2023</d2l-tooltip-help></div>
		<div slot="supporting-info"><d2l-button style="padding: 10px;">Hi!</d2l-button></div>
	</d2l-list-item-content>
`;

function createOffColorBackground(template, { colorVar = null, colorHex = '#FFBBCC' } = {}) {
	const backgroundColor = colorVar ? `var(--d2l-color-${colorVar})` : colorHex;
	const style = `background-color: ${backgroundColor}; padding: 1rem; box-sizing: border-box; width: fit-content;`;
	return html`
        <div style=${style}>
            ${template}
        </div>
	`;
}

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

const clampSingleStyles = {
	overflow: 'hidden',
	overflowWrap: 'anywhere',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
};

const clampMultiStyles = {
	display: '-webkit-box',
	overflow: 'hidden',
	overflowWrap: 'anywhere',
	webkitBoxOrient: 'vertical',
	webkitLineClamp: '2'
};

const illustrationStyles = {
	height: '4rem'
};

function getFirstItem(elem) {
	return elem.querySelector('d2l-list-item') || elem.querySelector('d2l-list-item-button');
}

function focusFirstItem(elem) {
	return focusElem(getFirstItem(elem));
}

function hoverFirstItem(elem) {
	return hoverElem(getFirstItem(elem));
}

function createListItemContent({ primary = 'Item 1', secondary = 'Secondary info for item 1', supportingInfo = 'Supporting info for item 1', styles = {} } = {}) {
	return html`
		<d2l-list-item-content>
			<div style="${styleMap(styles)}">${primary}</div>
			<div slot="secondary" style="${styleMap(styles)}">${secondary}</div>
			<div slot="supporting-info" style="${styleMap(styles)}">${supportingInfo}</div>
		</d2l-list-item-content>
	`;
}

function createDivIllustration() {
	return html`<div slot="illustration" style="background-color: var(--d2l-color-olivine); color: white; height: 4rem; padding: 1rem;">I'm a &lt;div&gt;</div>`;
}

function createIconIllustration({ styles = illustrationStyles } = {}) {
	return html`<d2l-icon slot="illustration" style="${styleMap(styles)}" icon="tier3:home"></d2l-icon>`;
}

function createImgIllustration() {
	return html`<img slot="illustration" style="height: 4rem;" src="data:image/png;base64,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ICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KE+0EygAABEFJREFUeAHt07ENwCAQBEGgJ5dFg27OSI7RVjCEfDa6nc9+v+ERIHAVWNdfnwQI/AICMQQCISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEiIBAbIBACAgkcJwICsQECISCQwHEicADECgPrw9IKqwAAAABJRU5ErkJggg==" alt="" />`;
}

function createListItemContentParams({ includeLongText = true, nested = false, prefix = '', styles } = {}) {
	const longText = ' Lookout take a caulk rope\'s end Jack Ketch Admiral of the Black yard jury mast barque no prey, no pay port.';
	const primary = `${prefix} Primary text.${includeLongText ? longText : ''}`;
	const secondary = `${prefix} Secondary Info.${includeLongText ? longText : ''}`;
	const supportingInfo = `${prefix} Supporting Info.${includeLongText ? longText : ''}`;
	if (nested) {
		return {
			primary: html`<div style="${styleMap(styles)}">${primary}</div>`,
			secondary: html`<div style="${styleMap(styles)}">${secondary}</div>`,
			supportingInfo: html`<div style="${styleMap(styles)}">${supportingInfo}</div>`,
			styles
		};
	} else {
		return { primary, secondary, supportingInfo, styles };
	}
}

function createItemActions({ template, translucent = false } = {}) {
	template = template || html`
		<d2l-button-icon icon="tier1:pin-filled" text="Pin" ?translucent="${translucent}"></d2l-button-icon>
		<d2l-button-icon icon="tier1:more" text="More" ?translucent="${translucent}"></d2l-button-icon>
	`;
	return html`
		<div slot="actions">${template}</div>
	`;
}

function createItem({ actions = nothing, color, href, illustration = nothing, paddingType, selectable = false, selected = false, selectionDisabled = false, skeleton = false, template = 'Item 1', tileHeader = false, tilePaddingType, width } = {}) {
	const styles = {};
	if (width) styles['width'] = width;
	return html`
		<d2l-list-item
			label="some label"
			color="${ifDefined(color)}"
			href="${ifDefined(href)}"
			key="some key"
			padding-type="${ifDefined(paddingType)}"
			?selectable="${selectable}"
			?selected="${selected}"
			?selection-disabled="${selectionDisabled}"
			?skeleton="${skeleton}"
			style="${styleMap(styles)}"
			?tile-header="${tileHeader}"
			tile-padding-type="${ifDefined(tilePaddingType)}">
			${illustration}
			${template}
			${actions}
		</d2l-list-item>
	`;
}

function createLinkItem({ color, paddingType, template = 'Item 1', width } = {}) {
	return createItem({ color, href: 'https://www.d2l.com', paddingType, template, width });
}

function createButtonItem({ disabled = false, template = 'Item 1' } = {}) {
	return html`
		<d2l-list-item-button
			?button-disabled="${disabled}"
			label="some label">
			${template}
		</d2l-list-item-button>
	`;
}

function createItems({ lineBreak, paddingType, width, withColors = false } = {}) {
	return html`
		${createItem({ color: withColors ? '#006fbf' : undefined, paddingType, template: 'Item 1', width })}
		${lineBreak ? html`<div class="d2l-list-tile-break"></div>` : nothing}
		${createItem({ color: withColors ? '#46a661' : undefined, paddingType, template: 'Item 2 - The super fancy awesome item!', width })}
		${createItem({ paddingType, template: 'Item 3', width })}
	`;
}

function createList({ extendSeparators = false, itemsTemplate = createItems(), layout, selectionSingle = false, separators, width } = {}) {
	const styles = {};
	if (width) styles['width'] = width;
	return html`
		<d2l-list
			?extend-separators="${extendSeparators}"
			layout="${ifDefined(layout)}"
			?selection-single="${selectionSingle}"
			separators="${ifDefined(separators)}"
			style="${styleMap(styles)}">
			${itemsTemplate}
		</d2l-list>
	`;
}

describe('list', () => {

	[
		// basic
		{ name: 'list', template: createList({ layout: listLayouts.list }) },
		{ name: 'tiles', template: createList({ layout: listLayouts.tiles }) },
		{ name: 'tiles item width', template: createList({ itemsTemplate: createItems({ width: '250px' }), layout: listLayouts.tiles }) },
		// separators
		{ name: 'list separators none', template: createList({ separators: 'none', layout: listLayouts.list }) },
		{ name: 'list separators all', template: createList({ separators: 'all', layout: listLayouts.list }) },
		{ name: 'list separators between', template: createList({ separators: 'between', layout: listLayouts.list }) },
		// tile-padding-type
		{ name: 'tiles item tile-padding-type none', template: createList({ itemsTemplate: createItem({ template: createListItemContent(), tilePaddingType: 'none' }), layout: listLayouts.tiles, width: '400px' }), target: 'd2l-list-item' },
		{ name: 'tiles item tile-padding-type none illustration', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createImgIllustration(), template: createListItemContent(), tilePaddingType: 'none', selectable: true }), layout: listLayouts.tiles, width: '400px' }), target: 'd2l-list-item' },
		{ name: 'tiles item tile-padding-type none icon', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createIconIllustration(), template: createListItemContent(), tilePaddingType: 'none', selectable: true }), layout: listLayouts.tiles, width: '400px' }), target: 'd2l-list-item' },
		{ name: 'tiles item tile-padding-type none tile-header illustration', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createImgIllustration(), template: createListItemContent(), tileHeader: true, tilePaddingType: 'none', selectable: true }), layout: listLayouts.tiles, width: '400px' }), target: 'd2l-list-item' },
		{ name: 'tiles item tile-padding-type none tile-header icon', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createIconIllustration(), template: createListItemContent(), tileHeader: true, tilePaddingType: 'none', selectable: true }), layout: listLayouts.tiles, width: '400px' }), target: 'd2l-list-item' }
	].forEach(({ name, template, action, margin, target }) => {

		it(name, async() => {
			const elem = await fixture(template);
			if (action) await action(elem);
			await expect(elem.querySelector(target) ?? elem).to.be.golden({ margin });
		});

	});

	[listLayouts.list, listLayouts.tiles].forEach(layout => {

		describe(layout, () => {

			[
				// separators
				{ name: 'extend-separators', template: createList({ extendSeparators: true, separators: 'all', layout }) },
				// padding-type
				{ name: 'item padding-type none', template: createList({ itemsTemplate: createItem({ paddingType: 'none' }), layout }), target: 'd2l-list-item' },
				// list-item-content
				{ name: 'item content all', template: createList({ itemsTemplate: createItem({ template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content padding-type none', template: createList({ itemsTemplate: createItem({ paddingType: 'none', template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content long wrapping', template: createList({ itemsTemplate: createItem({ template: createListItemContent(createListItemContentParams({ prefix: 'Overflow: wrap.' })) }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content long single line ellipsis', template: createList({ itemsTemplate: createItem({ template: createListItemContent(createListItemContentParams({ prefix: 'Overflow: single-line, ellipsis.', styles: clampSingleStyles })) }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content long unbreakable single line ellipsis', template: createList({ itemsTemplate: createItem({ template: createListItemContent({ primary: 'a'.repeat(77), secondary: 'b'.repeat(77), supportingInfo: 'c'.repeat(77), styles: clampSingleStyles }) }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content long single line ellipsis nested', template: createList({ itemsTemplate: createItem({ template: createListItemContent(createListItemContentParams({ prefix: 'Overflow: single-line, ellipsis.', nested: true, styles: clampSingleStyles })) }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content short single line ellipsis', template: createList({ itemsTemplate: createItem({ template: createListItemContent(createListItemContentParams({ includeLongText: false, prefix: 'Overflow: ellipsis.', styles: clampSingleStyles })) }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item content long multi line ellipsis', template: createList({ itemsTemplate: createItem({ template: createListItemContent(createListItemContentParams({ prefix: 'Overflow: multi-line, ellipsis.', styles: clampMultiStyles })) }), layout, width: '400px' }), target: 'd2l-list-item' },
				// link without d2l-list-item-content
				{ name: 'item link', template: createList({ itemsTemplate: createLinkItem(), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item link focus', template: createList({ itemsTemplate: createLinkItem(), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item link hover', template: createList({ itemsTemplate: createLinkItem(), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				// link with d2l-list-item-content
				{ name: 'item link content', template: createList({ itemsTemplate: createLinkItem({ template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item link content focus', template: createList({ itemsTemplate: createLinkItem({ template: createListItemContent() }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item link content hover', template: createList({ itemsTemplate: createLinkItem({ template: createListItemContent() }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				// button without d2l-list-item-content
				{ name: 'item button', template: createList({ itemsTemplate: createButtonItem(), layout, width: '400px' }), margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled', template: createList({ itemsTemplate: createButtonItem({ disabled: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button focus', template: createList({ itemsTemplate: createButtonItem(), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled focus', template: createList({ itemsTemplate: createButtonItem({ disabled: true }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button hover', template: createList({ itemsTemplate: createButtonItem(), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled hover', template: createList({ itemsTemplate: createButtonItem({ disabled: true }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item-button' },
				// button with d2l-list-item-content
				{ name: 'item button content', template: createList({ itemsTemplate: createButtonItem({ template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled content', template: createList({ itemsTemplate: createButtonItem({ disabled: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button content focus', template: createList({ itemsTemplate: createButtonItem({ template: createListItemContent() }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled content focus', template: createList({ itemsTemplate: createButtonItem({ disabled: true, template: createListItemContent() }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button content hover', template: createList({ itemsTemplate: createButtonItem({ template: createListItemContent() }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item-button' },
				{ name: 'item button disabled content hover', template: createList({ itemsTemplate: createButtonItem({ disabled: true, template: createListItemContent() }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item-button' },
				// line break
				{ name: 'line break', template: createList({ itemsTemplate: createItems({ lineBreak: true }), layout }) },
				// illustration slot
				{ name: 'item illustration slot img', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item illustration slot icon', template: createList({ itemsTemplate: createItem({ illustration: createIconIllustration(), template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item illustration slot icon custom', template: createList({ itemsTemplate: createItem({ illustration: createIconIllustration({ styles: { height: '6rem', padding: '1.5rem' } }), template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				{ name: 'item illustration slot div', template: createList({ itemsTemplate: createItem({ illustration: createDivIllustration(), template: createListItemContent() }), layout, width: '400px' }), target: 'd2l-list-item' },
				// selection (multiple)
				{ name: 'item multiple selectable illustration', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration rtl', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, rtl: true, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration selected', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration selection-disabled', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selectionDisabled: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration selection-disabled selected', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, selectionDisabled: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration not selected focus', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration not selected hover', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration selected focus', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration selected hover', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable illustration skeleton', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, skeleton: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header rtl', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, rtl: true, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header selected', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header selection-disabled', template: createList({ itemsTemplate: createItem({ selectable: true, selectionDisabled: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header selection-disabled selected', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, selectionDisabled: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header not selected focus', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header not selected hover', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header selected focus', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header selected hover', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item multiple selectable tile-header skeleton', template: createList({ itemsTemplate: createItem({ selectable: true, skeleton: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				// selection (single)
				{ name: 'item single selectable illustration', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration selected', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration selection-disabled', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selectionDisabled: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration skeleton', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, skeleton: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration not selected focus', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration not selected hover', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration selected focus', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable illustration selected hover', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, selected: true, template: createListItemContent() }), layout, selectionSingle: true, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header selected', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header selection-disabled', template: createList({ itemsTemplate: createItem({ selectable: true, selectionDisabled: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header skeleton', template: createList({ itemsTemplate: createItem({ selectable: true, skeleton: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header not selected focus', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header not selected hover', template: createList({ itemsTemplate: createItem({ selectable: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header selected focus', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), action: focusFirstItem, margin: 24, target: 'd2l-list-item' },
				{ name: 'item single selectable tile-header selected hover', template: createList({ itemsTemplate: createItem({ selectable: true, selected: true, template: createListItemContent(), tileHeader: true }), layout, selectionSingle: true, width: '400px' }), action: hoverFirstItem, margin: 24, target: 'd2l-list-item' },
				// other odd selection cases
				{ name: 'item selectable tile-header illustration', template: createList({ itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item selectable extend-separators', template: createList({ extendSeparators: true, itemsTemplate: createItem({ illustration: createImgIllustration(), selectable: true, template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				// actions
				{ name: 'item actions illustration translucent', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createImgIllustration(), template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item actions illustration translucent rtl', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createImgIllustration(), template: createListItemContent() }), layout, width: '400px' }), margin: 24, rtl: true, target: 'd2l-list-item' },
				{ name: 'item actions illustration extend-separators', template: createList({ extendSeparators: true, itemsTemplate: createItem({ actions: createItemActions({ translucent: true }), illustration: createImgIllustration(), template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item actions tile-header', template: createList({ itemsTemplate: createItem({ actions: createItemActions(), template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item actions tile-header rtl', template: createList({ itemsTemplate: createItem({ actions: createItemActions(), template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, rtl: true, target: 'd2l-list-item' },
				{ name: 'item actions tile-header extend-separators', template: createList({ extendSeparators: true, itemsTemplate: createItem({ actions: createItemActions(), template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item actions tile-header link', template: createList({ itemsTemplate: createItem({ actions: createItemActions({ template: html`<d2l-link href="http://www.d2l.com">Action 1</d2l-link>` }), template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				// color
				{ name: 'item color indicator', template: createList({ itemsTemplate: createItem({ color: '#46a661', template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item color indicator rtl', template: createList({ itemsTemplate: createItem({ color: '#46a661', template: createListItemContent() }), layout, width: '400px' }), margin: 24, rtl: true, target: 'd2l-list-item' },
				{ name: 'item color indicator alpha', template: createList({ itemsTemplate: createItem({ color: '#46a66199', template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item color indicator illustration', template: createList({ itemsTemplate: createItem({ color: '#46a661', illustration: createImgIllustration(), template: createListItemContent() }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' },
				{ name: 'item color indicator tile-header', template: createList({ itemsTemplate: createItem({ actions: createItemActions(), color: '#46a661', template: createListItemContent(), tileHeader: true }), layout, width: '400px' }), margin: 24, target: 'd2l-list-item' }
			].forEach(({ name, template, action, margin, rtl, target }) => {

				it(name, async() => {
					const elem = await fixture(template, { rtl });
					if (action) await action(elem);
					await expect(elem.querySelector(target) ?? elem).to.be.golden({ margin });
				});

			});

		});

	});

	describe('general', () => {

		it('simple', async() => {
			const elem = await fixture(createSimpleList({ color1: '#0000ff' }));
			await expect(elem).to.be.golden();
		});

		it('add-button', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await expect(elem).to.be.golden();
		});

		it('add-button focus first item top', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await expect(elem).to.be.golden({ margin: 20 });
		});

		it('add-button focus first item bottom', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1]);
			await expect(elem).to.be.golden();
		});

		it('add-button add-button-text focus', async() => {
			const elem = await fixture(createSimpleList({ addButton: true, addButtonText: 'Custom Text' }));
			await focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await expect(elem).to.be.golden({ margin: 20 });
		});

		it('add-button hover', async() => {
			const elem = await fixture(createSimpleList({ addButton: true }));
			await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await oneEvent(elem, 'd2l-tooltip-show');
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

	describe('separators', () => {

		[ true, false ].forEach((addButton) => {
			[
				{ name: `default${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#0000ff', addButton }) },
				{ name: `none${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#00ff00', color2: '#00ff00', separatorType: 'none', addButton }) },
				{ name: `all${addButton ? ' add-button' : ''}`, template: createSimpleList({ separatorType: 'all', addButton }) },
				{ name: `between${addButton ? ' add-button' : ''}`, template: createSimpleList({ separatorType: 'between', addButton }) },
				{ name: `extended${addButton ? ' add-button' : ''}`, template: createSimpleList({ color1: '#00ff00', extendSeparators: true, addButton }) }
			].forEach(({ name, template }) => {
				it(name, async() => {
					const elem = await fixture(template);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	describe('interactive content', () => {

		describe('href', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" href="http://www.d2l.com">
								${interactiveListItemContent}
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('button', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item-button')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item-button')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item-button label="Item">
								${interactiveListItemContent}
							</d2l-list-item-button>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('selectable', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" selectable>
								${interactiveListItemContent}
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('expandable', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'focus-interactive', action: elem => focusElem(elem.querySelector('d2l-button')), margin: 24 },
				{ name: 'hover-interactive', action: elem => hoverElem(elem.querySelector('d2l-button')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" expandable key="key-1">
								${interactiveListItemContent}
								<d2l-list slot="nested">
									${simpleListItemContent}
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
			});
		});

		describe('href-selectable-expandable-color', () => {
			[
				{ name: 'default' },
				{ name: 'focus', action: elem => focusElem(elem.querySelector('d2l-list-item')), margin: 24 },
				{ name: 'hover', action: elem => hoverElem(elem.querySelector('d2l-list-item')), margin: 24 }
			].forEach(({ name, action, margin }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item label="Item" href="http://www.d2l.com" expandable selectable key="key-1" color="#00ff00">
								${interactiveListItemContent}
								<d2l-list slot="nested">
									<d2l-list-item>
									${simpleListItemContent}
									</d2l-list-item>
								</d2l-list>
							</d2l-list-item>
						</d2l-list>
					`);
					if (action) await action(elem);
					await expect(elem).to.be.golden({ margin });
				});
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

	[true, false].forEach(disabled => {
		describe(`button${disabled ? '-disabled' : ''}`, () => {
			[
				{ name: 'focus add-button', action: focusElem, margin: disabled ? 75 : 24, addButton: true }
			].forEach(({ name, action, margin, addButton }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;" ?add-button="${addButton || false}">
							<d2l-list-item-button ?button-disabled="${disabled}">
								${simpleListItemContent}
							</d2l-list-item-button>
						</d2l-list>
					`);
					if (action) await action(elem.querySelector('d2l-list-item-button'));
					await expect(elem).to.be.golden({ margin });
				});
			});
		});
	});

	describe('nav add-button', () => {
		[
			{ name: 'default' },
			{ name: 'focus', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav')) },
			{ name: 'focus current', action: async(elem) => await focusElem(elem.querySelector('[current]')), current: true },
			{ name: 'hover', action: async(elem) => await hoverElem(elem.querySelector('d2l-list-item-nav')) },
			{ name: 'focus second item', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav[key="L1-2"]')) },
			{ name: 'focus second item current', action: async(elem) => await focusElem(elem.querySelector('d2l-list-item-nav[key="L1-2"]')), currentSecond: true }
		].forEach(({ name, action, current, currentSecond }) => {
			it(name, async() => {
				const elem = await fixture(html`
					<d2l-list grid style="width: 334px;" add-button>
						<d2l-list-item-nav action-href=" " key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable>
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid add-button>
								<d2l-list-item-nav action-href=" " key="L2-1" label="Syallabus Confirmation" draggable ?current="${current || false}">
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
								<d2l-list-item-nav action-href=" " key="L2-2" label="Lesson 1" draggable>
									<d2l-list-item-content>
										<div>Lesson 1</div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
						<d2l-list-item-nav action-href=" " key="L1-2" label="Welcome!" color="#006fbf" expandable expanded draggable ?current="${currentSecond || false}">
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid add-button>
								<d2l-list-item-nav action-href=" " key="L1-2-1" label="Syallabus Confirmation" draggable>
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
								<d2l-list-item-nav action-href=" " key="L1-2-2" label="Lesson 1" draggable>
									<d2l-list-item-content>
										<div>Lesson 1</div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
					</d2l-list>
				`);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin: 24 });
			});
		});
	});

	[true, false].forEach(disabled => {
		if (disabled) return; // skipping for now since no concept of disabled link item currently

		describe(`nav${disabled ? '-disabled' : ''}`, () => {
			[
				{ name: 'default' },
				{ name: 'default current', margin: disabled ? undefined : 24, current: true },
				{ name: 'focus', action: focusElem, margin: disabled ? undefined : 24 },
				{ name: 'focus current', action: focusElem, margin: disabled ? undefined : 24, current: true },
				{ name: 'hover', action: hoverElem, margin: disabled ? undefined : 24 }
			].forEach(({ name, action, margin, current }) => {
				it(name, async() => {
					const elem = await fixture(html`
						<d2l-list style="width: 400px;">
							<d2l-list-item-nav ?current="${current || false}" action-href=" ">
								${interactiveListItemContent}
							</d2l-list-item-nav>
						</d2l-list>
					`);
					if (action) await action(elem.querySelector('d2l-list-item-nav'));
					await expect(elem).to.be.golden({ margin });
				});

				it(`nested-${name}`, async() => {
					const elem = await fixture(html`
						<d2l-list grid style="width: 334px;">
							<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" ">
								<d2l-list-item-content>
									<div>Welcome!</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" grid>
									<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable ?current="${current || false}" action-href=" ">
										<d2l-list-item-content>
											<div>Syallabus Confirmation</div>
											<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
										</d2l-list-item-content>
									</d2l-list-item-nav>
								</d2l-list>
							</d2l-list-item-nav>
						</d2l-list>
					`);
					if (action) await action(elem.querySelectorAll('d2l-list-item-nav')[1]);
					await expect(elem).to.be.golden({ margin });
				});
			});

			it('nested-focused-secondary', async() => {
				const elem = await fixture(html`
					<d2l-list grid style="width: 334px;">
						<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" ">
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid>
								<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable action-href=" ">
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
					</d2l-list>
				`);
				focusElem(elem.querySelector('d2l-tooltip-help'));
				await oneEvent(elem, 'd2l-tooltip-show');
				await expect(elem).to.be.golden({ margin: 24 });
			});

			it('nested-indentation', async() => {
				const elem = await fixture(html`
					<d2l-list grid style="width: 334px;">
						<d2l-list-item-nav key="L1-1" label="Welcome!" color="#006fbf" expandable expanded draggable action-href=" " indentation="42">
							<d2l-list-item-content>
								<div>Welcome!</div>
							</d2l-list-item-content>
							<d2l-list slot="nested" grid>
								<d2l-list-item-nav key="L2-1" label="Syallabus Confirmation" draggable action-href=" " color="#29a6ff" expandable expanded indentation="30">
									<d2l-list-item-content>
										<div>Syallabus Confirmation</div>
										<div slot="secondary"><d2l-tooltip-help class="vdiff-include" style="padding: 5px;" text="Due: May 2, 2023 at 2 pm">Due: May 2, 2023</d2l-tooltip-help></div>
									</d2l-list-item-content>
									<d2l-list slot="nested" grid>
										<d2l-list-item-nav key="L2-1-1" label="Welcome topic" draggable action-href=" ">
											<d2l-list-item-content>
												<div>Welcome topic</div>
											</d2l-list-item-content>
										</d2l-list-item-nav>
									</d2l-list>
								</d2l-list-item-nav>
							</d2l-list>
						</d2l-list-item-nav>
					</d2l-list>
				`);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('selectable', () => {
		const selectableButtonList = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item-button label="Item 3" selection-disabled selectable key="3">Item 3</d2l-list-item-button>
				<d2l-list-item-button label="Item 4" selection-disabled button-disabled selectable key="4">Item 4</d2l-list-item-button>
			</d2l-list>
		`;
		function createSelectableList(opts) {
			const { selected, addButton, selectionDisabled } = { selected: false, addButton: false, selectionDisabled: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" selectable key="1" ?selected="${selected}" color="${ifDefined(!selected ? '#00ff00' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" ?selection-disabled="${selectionDisabled}" selectable key="2" color="${ifDefined(selected ? '#00ff00' : undefined)}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}
		function createSelectableContentList(opts) {
			const { skeleton, addButton, extendSeparators, href } = { skeleton: false, addButton: false, extendSeparators: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?add-button="${addButton}" ?extend-separators="${extendSeparators}" href="${ifDefined(href ? href : undefined)}">
					<d2l-list-item label="Item 1" selectable key="1" ?skeleton="${skeleton}">
						${simpleListItemContent}
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'not selected', template: createSelectableList() },
			{ name: 'not selected focus', template: createSelectableList(), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'not selected hover', template: createSelectableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'not selected add-button', template: createSelectableList({ addButton: true }) },
			{ name: 'selection-disabled hover', template: createSelectableList({ selectionDisabled: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			{ name: 'button selection-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="3"]')), margin: 24 },
			{ name: 'button selection-disabled button-disabled hover', template: selectableButtonList, action: elem => hoverElem(elem.querySelector('[key="4"]')) },
			{ name: 'selected', template: createSelectableList({ selected: true }), margin: 24 },
			{ name: 'selected focus', template: createSelectableList({ selected: true }), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected hover', template: createSelectableList({ selected: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selected add-button', template: createSelectableList({ selected: true, addButton: true }), margin: 24 },
			{ name: 'selected focus sibling', template: createSelectableList({ selected: true }), action: elem => focusElem(elem.querySelector('[key="2"]')), margin: 24 },
			{ name: 'selected hover sibling', template: createSelectableList({ selected: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')), margin: 24 },
			{ name: 'item-content', template: createSelectableContentList() },
			{ name: 'skeleton', template: createSelectableContentList({ skeleton: true }) },
			{ name: 'skeleton add-button', template: createSelectableContentList({ skeleton: true, addButton: true }) },
			{ name: 'extended separators', template: createSelectableContentList({ extendSeparators: true }) },
			{ name: 'extended separators href', template: createSelectableContentList({ extendSeparators: true, href: 'http://www.d2l.com' }) }
		].forEach(({ name, template, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
			it(`${name} off-color background`, async() => {
				const elem = await fixture(createOffColorBackground(template));
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

	describe('selectable-href', () => {
		const selectableHrefList = html`
			<d2l-list style="width: 400px;">
				<d2l-list-item href="http://www.d2l.com" selectable key="href" label="Introductory Earth Sciences">
					<d2l-list-item-content>Introductory Earth Sciences</d2l-list-item-content>
					<div slot="actions"><d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon></div>
				</d2l-list-item>
			</d2l-list>`;
		[
			{ name: 'hover href', template: selectableHrefList, action: hoverElem, margin: 24 },
			{ name: 'hover selection', template: selectableHrefList, action: elem => hoverElem(elem.shadowRoot.querySelector('[slot="control"]')), margin: 24 },
			{ name: 'hover secondary action', template: selectableHrefList, action: elem => hoverElem(elem.querySelector('d2l-button-icon')) },
		].forEach(({ name, template, action, margin }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem.querySelector('[key="href"]'));
				await expect(elem).to.be.golden({ margin });
			});
			it(`${name} off-color background`, async() => {
				const elem = await fixture(createOffColorBackground(template));
				if (action) await action(elem.querySelector('[key="href"]'));
				await expect(elem).to.be.golden({ margin });
			});
		});
	});

	describe('controls', () => {
		function createListWithControls(opts) {
			const { actions, color2, extendSeparators, selectable, selected, selectAllPages } = {
				actions: false,
				extendSeparators: false,
				selectable: true,
				selected: [false, false],
				selectAllPages: false,
				...opts
			};
			return html`
				<d2l-list item-count="${ifDefined(selectAllPages ? '50' : undefined)}" ?extend-separators="${extendSeparators}" style="width: 400px;">
					<d2l-list-controls slot="controls" ?no-selection="${!selectable}" ?select-all-pages-allowed="${selectAllPages}" no-sticky>
						${actions ? html`
							<d2l-selection-action text="Delete" icon="tier1:delete"></d2l-selection-action>
							<d2l-selection-action text="Edit" icon="tier1:edit"></d2l-selection-action>
						` : nothing}
					</d2l-list-controls>
					<d2l-list-item label="Item 1" key="1" ?selectable="${selectable}" ?selected="${selected[0]}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" key="2" color="${ifDefined(color2)}" ?selection-disabled="${selectable}" ?selectable="${selectable}" ?selected="${selected[1]}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'not selectable actions', template: createListWithControls({ actions: true, selectable: false }) },
			{ name: 'none selected', template: createListWithControls() },
			{ name: 'some selected', template: createListWithControls({ color2: '#00ff00', selected: [true, false] }), margin: 24 },
			{ name: 'all selected', template: createListWithControls({ selected: [true, true] }), margin: 24 },
			{ name: 'all selected pages', template: createListWithControls({ selectAllPages: true, selected: [true, true] }), margin: 24 },
			{ name: 'selectable actions', template: createListWithControls({ actions: true, selectable: true }) },
			{ name: 'selectable actions color', template: createListWithControls({ actions: true, color2: '#00ff00', selectable: true }) },
			{ name: 'selectable no-actions', template: createListWithControls({ selectable: true }) },
			{ name: 'selectable actions extend', template: createListWithControls({ actions: true, extendSeparators: true, selectable: true }) },
			{ name: 'selectable actions extend color', template: createListWithControls({ actions: true, color2: '#00ff00', extendSeparators: true, selectable: true }) },
		].forEach(({ name, template, margin }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden({ margin });
			});
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
				{ name: 'sticky extended separators color', color2: '#00ff00', extendSeparators: true },
				{ name: 'sticky add-button', addButton: true },
				{ name: 'sticky color add-button', color1: '#ff0000', addButton: true },
				{ name: 'sticky extended separators add-button', extendSeparators: true, addButton: true },
				{ name: 'sticky extended separators color add-button', color2: '#00ff00', extendSeparators: true, addButton: true }
			].forEach(({ name, color1, color2, extendSeparators = false, addButton = false }) => {
				it(`${name}-${actionName}`, async() => {
					const elem = await fixture(html`
						<div style="height: 200px; overflow: scroll; width: 400px;">
							<d2l-list style="padding: 0 20px;" ?extend-separators="${extendSeparators}" ?add-button="${addButton}">
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

			it('sticky add-button focus scrolled', async() => {
				const elem = await fixture(html`
					<div style="height: 200px; overflow: scroll; width: 400px;">
						<d2l-list style="padding: 0 20px;" add-button>
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
							<d2l-list-item label="Item 4" selectable key="4">
								<d2l-list-item-content>
									<div>Item 4</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</div>
				`);
				const addButton = elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1];
				await focusElem(addButton);
				await elem.scrollTo(0, 90);
				await expect(elem).to.be.golden();
			});

			it('sticky add-button focus', async() => {
				const elem = await fixture(html`
					<div style="height: 200px; overflow: scroll; width: 400px;">
						<d2l-list style="padding: 0 20px;" add-button>
							<d2l-list-controls slot="controls"></d2l-list-controls>
							<d2l-list-item label="Item 1" selectable key="1">
								<d2l-list-item-content>
									<div>Item 1</div>
									<div slot="supporting-info">Supporting info</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</div>
				`);
				const addButton = elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add');
				await focusElem(addButton);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('draggable', () => {
		function createDraggableList(opts) {
			const { color1, color2, extendSeparators, handleOnly, selectable, addButton } = { extendSeparators: false, handleOnly: false, selectable: false, addButton: false, ...opts };
			return html`
				<d2l-list style="width: 400px;" ?extend-separators="${extendSeparators}" ?add-button="${addButton}">
					<d2l-list-item label="Item 1" color="${ifDefined(color1)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="1" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 1</d2l-list-item>
					<d2l-list-item label="Item 2" color="${ifDefined(color2)}" draggable ?drag-target-handle-only="${handleOnly}" ?selectable="${selectable}" key="2" href="${ifDefined(selectable ? 'http://www.d2l.com' : undefined)}">Item 2</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createDraggableList() },
			{ name: 'add-button', template: createDraggableList({ addButton: true }) },
			{ name: 'add-button focus', template: createDraggableList({ addButton: true }), action: elem => focusElem(elem.querySelector('[key="2"]')), margin: 24 },
			{ name: 'add-button hover', template: createDraggableList({ addButton: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'color hover', template: createDraggableList({ color1: '#ff0000' }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'focus list item', template: createDraggableList(), action: elem => focusElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'hover list item', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'hover outside control', template: createDraggableList(), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')), margin: 24 },
			{ name: 'drag-target-handle-only hover list item', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'drag-target-handle-only hover outside control', template: createDraggableList({ handleOnly: true }), action: elem => hoverElem(elem.querySelector('[key="1"]').shadowRoot.querySelector('[slot="outside-control"]')) },
			{ name: 'selectable', template: createDraggableList({ selectable: true }) },
			{ name: 'selectable off-color background', template: createOffColorBackground(createDraggableList({ selectable: true })) },
			{ name: 'selectable focus', template: createDraggableList({ selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')), margin: 24 },
			{ name: 'selectable focus off-color background', template: createOffColorBackground(createDraggableList({ selectable: true })), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'selectable hover', template: createDraggableList({ selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'selectable hover off-color background', template: createOffColorBackground(createDraggableList({ selectable: true })), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'color selectable focus', template: createDraggableList({ color1: '#ff0000aa', selectable: true }), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')), margin: 24 },
			{ name: 'color selectable focus off-color background', template: createOffColorBackground(createDraggableList({ color1: '#ff0000aa', selectable: true })), action: elem => focusElem(elem.querySelector('[key="1"]').shadowRoot.querySelector(' d2l-selection-input')) },
			{ name: 'color selectable hover', template: createDraggableList({ color1: '#ff0000aa', selectable: true }), action: elem => hoverElem(elem.querySelector('[key="1"]')), margin: 24 },
			{ name: 'color selectable hover off-color background', template: createOffColorBackground(createDraggableList({ color1: '#ff0000aa', selectable: true })), action: elem => hoverElem(elem.querySelector('[key="1"]')) },
			{ name: 'extended separators', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true }) },
			{ name: 'extended separators hover', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
			{ name: 'extended separators add-button', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true, addButton: true }) },
			{ name: 'extended separators add-button hover', template: createDraggableList({ color2: '#00ff00', extendSeparators: true, selectable: true, addButton: true }), action: elem => hoverElem(elem.querySelector('[key="2"]')) },
		].forEach(({ name, template, action, margin = undefined }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
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

	describe('nested', () => {
		function createNestedList(opts) {
			const { color1, color3, selected, addButton, indentation } = { selected: [false, false, false], addButton: false, indentation: false, ...opts };
			return html`
				<d2l-list style="width: 600px;" ?add-button="${addButton}">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable label="L1-1" key="L1-1" indentation="${ifDefined(indentation ? '35' : undefined)}">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<div slot="actions">
							<button>action 1</button>
							<button>action 2</button>
						</div>
						<d2l-list slot="nested" separators="between" ?add-button="${addButton}">
							<d2l-list-item selectable ?selected="${selected[0]}" color="${ifDefined(color1)}" label="L2-1" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable label="L2-2" key="L2-2" indentation="${ifDefined(indentation ? '40' : undefined)}">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
									<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
								</d2l-list-item-content>
								<d2l-list slot="nested" separators="between" ?add-button="${addButton}">
									<d2l-list-item selectable ?selected="${selected[1]}" label="L3-1" key="L3-1">
										<d2l-list-item-content>
											<div>Level 3, Item 1</div>
											<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crow's nest nipperkin grog yardarm hempen halter furl.</div>
										</d2l-list-item-content>
									</d2l-list-item>
									<d2l-list-item selectable ?selected="${selected[2]}" color="${ifDefined(color3)}" label="L3-2" key="L3-2">
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

		[
			{ name: 'none-selected', template: createNestedList({ color1: '#00ff00' }) },
			{ name: 'some-selected', template: createNestedList({ selected: [false, false, true], color3: '#00ff00' }) },
			{ name: 'all-selected', template: createNestedList({ selected: [true, true, true] }) },
			{ name: 'add-button', template: createNestedList({ addButton: true }) },
			{ name: 'add-button some-selected', template: createNestedList({ addButton: true, selected: [false, false, true] }) },
			{ name: 'add-button all-selected', template: createNestedList({ addButton: true, selected: [true, true, true] }) },
			{ name: 'indentation', template: createNestedList({ indentation: true }) },
			{ name: 'indentation color', template: createNestedList({ color1: '#00ff00', indentation: true }) },
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden({ margin: 24 });
			});
		});

		it('add button only on root list', async() => {
			const template = html`
				<d2l-list style="width: 600px;" add-button>
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<d2l-list slot="nested">
							<d2l-list-item selectable label="L2-1" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable label="L2-2" key="L2-2">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
			const elem = await fixture(template);
			await expect(elem).to.be.golden({ margin: 24 });
		});

		it('add button only on nested list', async() => {
			const template = html`
				<d2l-list style="width: 600px;">
					<d2l-list-controls slot="controls" no-sticky></d2l-list-controls>
					<d2l-list-item selectable label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" add-button>
							<d2l-list-item selectable label="L2-1" key="L2-1">
								<d2l-list-item-content>
									<div>Level 2, Item 1</div>
								</d2l-list-item-content>
							</d2l-list-item>
							<d2l-list-item selectable label="L2-2" key="L2-2">
								<d2l-list-item-content>
									<div>Level 2, Item 2</div>
								</d2l-list-item-content>
							</d2l-list-item>
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
			const elem = await fixture(template);
			await expect(elem).to.be.golden({ margin: 24 });
		});
	});

	describe('expand-collapse', () => {
		function createExpandableList(opts) {
			const { color1, color2, color3, draggable, expanded, nested, nestedMultiple, secondTopLevelItem, selectable, skeleton, addButton } = {
				draggable: false,
				expanded: false,
				nested: true,
				nestedMultiple: false,
				selectable: false,
				secondTopLevelItem: false,
				skeleton: false,
				addButton: false,
				...opts };
			return html`
				<d2l-list style="width: 600px;" ?add-button="${addButton}">
					<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" ?skeleton="${skeleton}" color="${ifDefined(color1)}" label="L1-1" key="L1-1">
						<d2l-list-item-content>
							<div>Level 1, Item 1</div>
							<div slot="supporting-info">Supporting text for top level list item</div>
						</d2l-list-item-content>
						${nested ? html`
							<d2l-list slot="nested" ?add-button="${addButton}">
								<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" color="${ifDefined(color2)}" label="L2-1" key="L2-1">
									<d2l-list-item-content>
										<div>Level 2, Item 1</div>
										<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
									</d2l-list-item-content>
								</d2l-list-item>
								<d2l-list-item ?draggable="${draggable}" expandable ?expanded="${expanded}" ?selectable="${selectable}" color="${ifDefined(color3)}" label="L2-2" key="L2-2">
									<d2l-list-item-content>
										<div>Level 2, Item 2</div>
										<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
									</d2l-list-item-content>
									<d2l-list slot="nested" ?add-button="${addButton}">
										<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" label="L3-1" key="L3-1">
											<d2l-list-item-content>
												<div>Level 3, Item 1</div>
											</d2l-list-item-content>
										</d2l-list-item>
										<d2l-list-item ?draggable="${draggable}" ?selectable="${selectable}" label="L3-2" key="L3-2">
											<d2l-list-item-content>
												<div>Level 3, Item 2</div>
											</d2l-list-item-content>
										</d2l-list-item>
									</d2l-list>
								</d2l-list-item>
								${nestedMultiple ? html`
									<d2l-list-item expandable ?expanded="${expanded}" label="L2-3" key="L2-3">
										<d2l-list-item-content>
											<div>Level 2, Item 3</div>
											<div slot="supporting-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim.</div>
										</d2l-list-item-content>
										<d2l-list slot="nested" ?add-button="${addButton}">
											<d2l-list-item label="L3-1b" key="L3-1b">
												<d2l-list-item-content>
													<div>Level 3, Item 1b</div>
												</d2l-list-item-content>
											</d2l-list-item>
											<d2l-list-item label="L3-2b" key="L3-2b">
												<d2l-list-item-content>
													<div>Level 3, Item 2b</div>
												</d2l-list-item-content>
											</d2l-list-item>
										</d2l-list>
									</d2l-list-item>
								` : nothing}
							</d2l-list>
						` : nothing}
					</d2l-list-item>
					${secondTopLevelItem ? html`
						<d2l-list-item ?skeleton="${skeleton}" label="L1-2" key="L1-2">
							<d2l-list-item-content>
								<div>Level 1, Item 2</div>
								<div slot="supporting-info">Supporting text for second list item</div>
							</d2l-list-item-content>
						</d2l-list-item>
					` : nothing}
				</d2l-list>
			`;
		}

		[
			{ name: 'default', template: createExpandableList({ nested: false }) },
			{ name: 'skeleton', template: createExpandableList({ color1: '#ff0000', nested: false, secondTopLevelItem: true, skeleton: true }) },
			{ name: 'default expanded', template: createExpandableList({ expanded: true }) },
			{ name: 'selectable', template: createExpandableList({ expanded: true, selectable: true }) },
			{ name: 'draggable', template: createExpandableList({ color2: '#0000ff', draggable: true, expanded: true }) },
			{ name: 'draggable focus nested', template: createExpandableList({ color2: '#0000ff', draggable: true, expanded: true }), action: elem => focusElem(elem.querySelectorAll('d2l-list-item')[2].shadowRoot.querySelector('d2l-button-icon')), margin: 24 },
			{ name: 'selectable draggable', template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }) },
			{ name: 'selectable draggable rtl', rtl: true, template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }) },
			{ name: 'default expanded multiple nested lists', template: createExpandableList({ color3: '#ff0000', expanded: true, nestedMultiple: true }) },
			{ name: 'button focus', template: createExpandableList({ nested: false }), action: elem => focusElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-icon')) },
			{ name: 'remove color', template: createExpandableList({ color3: '#129044', draggable: true, expanded: true, selectable: true }), action: async(elem) => {
				elem.querySelector('[key="L2-2"]').color = undefined;
				await nextFrame();
			} },
			{ name: 'add color', template: createExpandableList({ draggable: true, expanded: true, selectable: true }), action: async(elem) => {
				elem.querySelector('[key="L3-1"]').color = '#ff0000';
				await nextFrame();
			} }
		].forEach(({ name, template, action, rtl, margin = undefined }) => {
			it(name, async() => {
				const elem = await fixture(template, { rtl });
				if (action) await action(elem);
				await expect(elem).to.be.golden({ margin });
			});
		});

		it('hover first add button', async() => {
			const elem = await fixture(createExpandableList({ addButton: true }));
			await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelector('d2l-button-add'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('hover second add button, not expanded', async() => {
			const elem = await fixture(createExpandableList({ addButton: true }));
			await hoverElem(elem.querySelector('d2l-list-item').shadowRoot.querySelectorAll('d2l-button-add')[1]);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('hover second add button, expanded', async() => {
			const elem = await fixture(createExpandableList({ addButton: true, expanded: true }));
			await hoverElem(elem.querySelectorAll('d2l-list-item')[1].shadowRoot.querySelector('d2l-button-add'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('hover add button at bottom of nested list', async() => {
			const elem = await fixture(createExpandableList({ addButton: true, expanded: true, nestedMultiple: true }));
			await hoverElem(elem.querySelector('d2l-list-item[key="L3-2b"]').shadowRoot.querySelector('d2l-button-add'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});

	describe('color', () => {
		function createColorList(opts) {
			const { controls, draggable, nestedMultiple, selectable } = {
				controls: true,
				draggable: false,
				nestedMultiple: false,
				selectable: false,
				...opts };
			return html`
				<d2l-list extend-separators style="width: 600px;">
					${controls ? html`
						<d2l-list-controls slot="controls">
							<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
							<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
						</d2l-list-controls>
					` : nothing}
					<d2l-list-item ?selectable="${selectable}" key="L1-1" label="Label for L1-1" ?draggable="${draggable}">
						<d2l-list-item-content>
							<div>Biology (L1)</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item ?selectable="${selectable}" key="L1-2" label="Label for L1-2" expandable expanded color="#00ff00ab" ?draggable="${draggable}">
						<d2l-list-item-content>
							<div>Earth Sciences (L1)</div>
							<div slot="supporting-info">Earth science or geoscience includes all fields of natural science related to planet Earth. This is a branch of science dealing with the physical and chemical constitution of Earth and its atmosphere. Earth science can be considered to be a branch of planetary science, but with a much older history.</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid separators="all" extend-separators>
							<d2l-list-item ?selectable="${selectable}" key="L2-1" label="Label for L2-1" color="#ffba59" ?expandable="${nestedMultiple}" ?draggable="${draggable}">
								<d2l-list-item-content>
									<div>Introductory Earth Sciences (L2)</div>
									<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain building, glaciation and weathering. Students will gain an appreciation of how these processes have controlled the evolution of our planet and the role of geology in meeting society's current and future demand for sustainable energy and mineral resources.</div>
								</d2l-list-item-content>
								${nestedMultiple ? html`
									<d2l-list slot="nested" grid separators="all">
										<d2l-list-item ?selectable="${selectable}" key="L3-1" label="Label for L3-1" color="#ffba59" ?draggable="${draggable}">
											<d2l-list-item-content>
												<div>Glaciation (L3)</div>
												<div slot="supporting-info">Supporting Info</div>
											</d2l-list-item-content>
										</d2l-list-item>
									</d2l-list>
								` : nothing}
							</d2l-list-item>
							${nestedMultiple ? html`
								<d2l-list-item ?selectable="${selectable}" key="L2-2" label="Label for L2-2" color="#ffba59" ?draggable="${draggable}">
									<d2l-list-item-content>
										<div>GlaciationB (L2)</div>
										<div slot="supporting-info">Supporting Info</div>
									</d2l-list-item-content>
								</d2l-list-item>
							` : nothing}
						</d2l-list>
					</d2l-list-item>
				</d2l-list>
			`;
		}

		[
			{ name: 'extend separators nested', template: createColorList({ controls: false }) },
			{ name: 'extend separators nested selectable', template: createColorList({ selectable: true }) },
			{ name: 'extend separators nested selectable hover', template: createColorList({ selectable: true }), action: elem => hoverElem(elem.querySelector('[key="L1-2"]')) },
			{ name: 'extend separators selectable draggable', template: createColorList({ draggable: true, selectable: true, nestedMultiple: true }) },
			{ name: 'extend separators selectable draggable hover', template: createColorList({ draggable: true, selectable: true, nestedMultiple: true }), action: elem => hoverElem(elem.querySelector('[key="L1-2"]')) }
		].forEach(({ name, template, action }) => {
			it(name, async() => {
				const elem = await fixture(template);
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});
		});
	});
});

describe('list-nested', () => {
	[true, false].forEach(rtl => {
		[
			{ name: 'all-iterations-non-draggable', draggable: false, media: 'screen' },
			{ name: 'all-iterations-draggable', draggable: true, media: 'screen' },
			{ name: 'all-iterations-separators-none', draggable: false, media: 'screen', separators: 'none' },
			{ name: 'all-iterations-separators-between', draggable: false, media: 'screen', separators: 'between' },
			{ name: 'all-iterations-draggable-force-show', draggable: true, media: 'print' }
		].forEach(({ name, draggable, media, separators }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(html`<d2l-demo-list-nested-iterations-helper separators=${ifDefined(separators)} ?is-draggable="${draggable}"></d2l-demo-list-nested-iterations-helper>`,
					{ media, rtl, viewport: { width: 1300, height: 7000 } }
				);
				await nextFrame();
				await expect(elem).to.be.golden();
			}).timeout(30000);
		});
	});
});

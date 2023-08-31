import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import { hide, show } from '../../tooltip/test/tooltip-helper.js';
import { open, reset } from '../../dropdown/test/dropdown-helper.js';
import puppeteer from 'puppeteer';

describe('d2l-list', () => {

	const visualDiff = new VisualDiff('list', import.meta.url);

	let browser, page;

	const closeDropdown = (selector) => {
		return reset(page, selector);
	};

	const focusInput = (selector) => {
		return focusWithKeyboard(page, [selector, 'd2l-selection-input']);
	};

	const focusLink = (selector) => {
		return focusWithKeyboard(page, [selector, 'a']);
	};

	const focusButton = (selector) => {
		return focusWithKeyboard(page, [selector, 'button']);
	};

	const focusExpandCollapseButton = (selector) => {
		return focusWithKeyboard(page, [selector, 'd2l-button-icon']);
	};

	const hideTooltip = (selector) => {
		return hide(page, selector);
	};

	const hover = (selector) => {
		return page.hover(selector);
	};

	const openDropdown = (selector) => {
		return open(page, selector);
	};

	const showTooltip = (selector) => {
		return show(page, selector);
	};

	const scrollTo = (selector, y) => {
		return page.$eval(selector, async(element, y) => {
			element.scrollIntoView();
			element.scrollTo(0, y);
			await new Promise(resolve => requestAnimationFrame(resolve));
		}, y);
	};

	const updateColor = (selector, childSelector, color) => {
		return page.$eval(selector, async(element, childSelector, color) => {
			const childElem = element.querySelector(`d2l-list-item[${childSelector}]`);
			childElem.color = color;
			await new Promise(resolve => requestAnimationFrame(resolve));
		}, childSelector, color);
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 8500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
		await page.mouse.move(-1, -1);
	});

	after(async() => await browser.close());

	[
		{ category: 'general', tests: [
			{ name: 'simple', selector: '#simple' },
			{ name: 'no padding', selector: '#noPadding' }
		] },
		{ category: 'illustration', tests: [
			{ name: 'default', selector: '#illustration' }
		] },
		{ category: 'separators', tests: [
			{ name: 'default', selector: '#simple' },
			{ name: 'none', selector: '#separatorsNone' },
			{ name: 'all', selector: '#separatorsAll' },
			{ name: 'between', selector: '#separatorsBetween' },
			{ name: 'extended', selector: '#separatorsExtended' }
		] },
		{ category: 'actions', tests: [
			{ name: 'default', selector: '#actions' },
			{ name: 'extended separators', selector: '#actionsSeparatorsExtended' },
			{ name: 'rtl', selector: '#actionsRtl' }
		] },
		{ category: 'pager', tests: [
			{ name: 'default', selector: '#pager' },
			{ name: 'extended separators', selector: '#pagerSeparatorsExtended' }
		] },
		{ category: 'item-content', tests: [
			{ name: 'all', selector: '#itemContent' },
			{ name: 'no padding', selector: '#itemContentNoPadding' },
			{ name: 'long wrapping', selector: '#itemContentLongWrap' },
			{ name: 'long single line ellipsis', selector: '#itemContentLongSingleLineEllipsis' },
			{ name: 'long unbreakable single line ellipsis', selector: '#itemContentLongUnbreakableSingleLineEllipsis' },
			{ name: 'long single line ellipsis nested', selector: '#itemContentLongSingleLineEllipsisNested' },
			{ name: 'short single line ellipsis', selector: '#itemContentShortSingleLineEllipsis' },
			{ name: 'long multi line ellipsis', selector: '#itemContentLongMultiLineEllipsis' }
		] },
		{ category: 'href', tests: [
			{ name: 'default', selector: '#href' },
			{ name: 'focus', selector: '#href', action: () => focusLink('#href d2l-list-item') },
			{ name: 'hover', selector: '#href', action: () => hover('#href d2l-list-item') }
		] },
		{ category: 'button', tests: [
			{ name: 'default', selector: '#button' },
			{ name: 'focus', selector: '#button', action: () => focusButton('#button d2l-list-item-button') },
			{ name: 'hover', selector: '#button', action: () => hover('#button d2l-list-item-button') }
		] },
		{ category: 'button-disabled', tests: [
			{ name: 'default', selector: '#buttonDisabled' },
			{ name: 'focus', selector: '#buttonDisabled', action: () => focusButton('#buttonDisabled d2l-list-item-button') },
			{ name: 'hover', selector: '#buttonDisabled', action: () => hover('#buttonDisabled d2l-list-item-button') }
		] },
		{ category: 'selectable', tests: [
			{ name: 'not selected', selector: '#selectable' },
			{ name: 'not selected focus', selector: '#selectable', action: () => focusInput('#selectable [selectable]') },
			{ name: 'not selected hover', selector: '#selectable', action: () => hover('#selectable [selectable]') },
			{ name: 'selection-disabled hover', selector: '#selectable', action: () => hover('#selectable [selectable][selection-disabled]') },
			{ name: 'button selection-disabled hover', selector: '#selectableButton', action: () => hover('#selectableButton [selectable][selection-disabled]') },
			{ name: 'button selection-disabled button-disabled hover', selector: '#selectableButton', action: () => hover('#selectableButton [selectable][selection-disabled][button-disabled]') },
			{ name: 'selected', selector: '#selectableSelected' },
			{ name: 'selected focus', selector: '#selectableSelected', action: () => focusInput('#selectableSelected [selectable]') },
			{ name: 'selected hover', selector: '#selectableSelected', action: () => hover('#selectableSelected [selectable]') },
			{ name: 'item-content', selector: '#selectableItemContent' },
			{ name: 'skeleton', selector: '#selectableSkeleton' },
			{ name: 'extended separators', selector: '#selectableSeparatorsExtended' }
		] },
		{ category: 'selectableHref', tests: [
			{ name: 'hover href', selector: '#selectableHref', action: () => hover('#selectableHref [selectable]') },
			{ name: 'hover selection', selector: '#selectableHref', action: async() => {
				const item = await page.$('#selectableHref [selectable]');
				const control = await page.evaluateHandle(item => item.shadowRoot.querySelector('[slot="control"]'), item);
				return control.hover();
			} },
			{ name: 'hover secondary action', selector: '#selectableHref', action: () => hover('#selectableHref [selectable] d2l-button-icon') },
		] },
		{ category: 'controls', tests: [
			{ name: 'not selectable', selector: '#noSelectableControls' },
			{ name: 'none selected', selector: '#selectableControls' },
			{ name: 'some selected', selector: '#selectableSomeSelectedControls' },
			{ name: 'all selected', selector: '#selectableAllSelectedControls' },
			{ name: 'all selected pages', selector: '#selectableAllSelectedControlsPages' },
			{ name: 'sticky top', selector: '#stickyControls', action: async() => {
				await scrollTo('#stickyControls > div', 45);
				await scrollTo('#stickyControls > div', 0);
			}, screenshotOptions: { captureBeyondViewport: false } },
			{ name: 'sticky scrolled', selector: '#stickyControls', action: async() => {
				await scrollTo('#stickyControls > div', 0);
				await scrollTo('#stickyControls > div', 45);
			}, screenshotOptions: { captureBeyondViewport: false } },
			{ name: 'sticky scrolled hover', selector: '#stickyControls', action: async() => {
				await scrollTo('#stickyControls > div', 0);
				await scrollTo('#stickyControls > div', 45);
				await hover('#stickyControls [key="1"] [slot="supporting-info"]');
			}, screenshotOptions: { captureBeyondViewport: false } },
			{ name: 'sticky top extended separators', selector: '#stickyControlsSeparatorsExtended', action: async() => {
				await scrollTo('#stickyControlsSeparatorsExtended > div', 45);
				await scrollTo('#stickyControlsSeparatorsExtended > div', 0);
			}, screenshotOptions: { captureBeyondViewport: false } },
			{ name: 'sticky scrolled extended separators', selector: '#stickyControlsSeparatorsExtended', action: async() => {
				await scrollTo('#stickyControlsSeparatorsExtended > div', 0);
				await scrollTo('#stickyControlsSeparatorsExtended > div', 45);
			}, screenshotOptions: { captureBeyondViewport: false } },
			{ name: 'sticky scrolled hover extended separators', selector: '#stickyControlsSeparatorsExtended', action: async() => {
				await scrollTo('#stickyControlsSeparatorsExtended > div', 0);
				await scrollTo('#stickyControlsSeparatorsExtended > div', 45);
				await hover('#stickyControlsSeparatorsExtended [key="1"] [slot="supporting-info"]');
			}, screenshotOptions: { captureBeyondViewport: false } }
		] },
		{ category: 'draggable', tests: [
			{ name: 'default', selector: '#draggable' },
			{ name: 'focus', selector: '#draggable', action: () => focusWithKeyboard(page, '#draggable [key="1"]') },
			{ name: 'hover', selector: '#draggable', action: () => hover('#draggable [key="1"]') },
			{ name: 'color hover', selector: '#draggableColorIndicator', action: () => hover('#draggableColorIndicator [key="1"]') },
			{ name: 'selectable', selector: '#draggableSelectable' },
			{ name: 'selectable focus', selector: '#draggableSelectable', action: () => focusInput('#draggableSelectable [key="1"]') },
			{ name: 'selectable hover', selector: '#draggableSelectable', action: () => hover('#draggableSelectable [key="1"]') },
			{ name: 'color selectable focus', selector: '#draggableSelectableColorIndicator', action: () => focusInput('#draggableSelectableColorIndicator [key="1"]') },
			{ name: 'color selectable hover', selector: '#draggableSelectableColorIndicator', action: () => hover('#draggableSelectableColorIndicator [key="1"]') },
			{ name: 'extended separators', selector: '#draggableSeparatorsExtended' }
		] },
		{ category: 'focus method', tests: [
			{ name: 'href', selector: '#href', action: () => focusWithKeyboard(page, '#href d2l-list-item') },
			{ name: 'button', selector: '#button', action: () => focusWithKeyboard(page, '#button d2l-list-item-button') },
			{ name: 'selectable', selector: '#selectable', action: () => focusWithKeyboard(page, '#selectable [selectable]') },
			{ name: 'expandable', selector: '#expand-collapse-default', action: () => focusWithKeyboard(page, '#expand-collapse-default d2l-list-item') }
		] },
		{ category: 'breakpoints', tests: [
			{ name: '842', selector: '#breakpoint-842' },
			{ name: '636', selector: '#breakpoint-636' },
			{ name: '580', selector: '#breakpoint-580' },
			{ name: '0', selector: '#breakpoint-0' }
		] },
		{ category: 'dropdown', tests: [
			{ name: 'open down', selector: '#dropdown-tooltips', action: () => openDropdown('#open-down'), after: () => closeDropdown('#open-down') }
		] },
		{ category: 'tooltip', tests: [
			{ name: 'open down', selector: '#dropdown-tooltips', action: () => showTooltip('#open-down'), after: () => hideTooltip('#open-down') }
		] },
		{ category: 'nested', tests: [
			{ name: 'none-selected', selector: '#nested-none-selected' },
			{ name: 'some-selected', selector: '#nested-some-selected' },
			{ name: 'all-selected', selector: '#nested-all-selected', action: async() => await page.waitForFunction(() => {
				const listControls = document.querySelector('#nested-all-selected d2l-list-controls');
				const selectionSummary = listControls.shadowRoot.querySelector('d2l-selection-summary');
				return selectionSummary._summary === '5 selected';
			}) }
		] },
		{ category: 'expand-collapse', tests: [
			{ name: 'default', selector: '#expand-collapse-default' },
			{ name: 'skeleton', selector: '#expand-collapse-skeleton' },
			{ name: 'default expanded', selector: '#expand-collapse-default-expanded' },
			{ name: 'selectable', selector: '#expand-collapse-selectable' },
			{ name: 'draggable', selector: '#expand-collapse-draggable' },
			{ name: 'selectable draggable', selector: '#expand-collapse-selectable-draggable' },
			{ name: 'default expanded multiple nested lists', selector: '#expand-collapse-default-expanded-multiple-nested-lists' },
			{ name: 'button focus', selector: '#expand-collapse-default', action: () => focusExpandCollapseButton('#expand-collapse-default d2l-list-item') },
			{ name: 'remove color', selector: '#expand-collapse-selectable-draggable', action: () => updateColor('#expand-collapse-selectable-draggable', 'color', undefined) },
			{ name: 'add color', selector: '#expand-collapse-selectable-draggable', action: () => updateColor('#expand-collapse-selectable-draggable', 'key="L3-1"', '#ff0000') },
		] }
	].forEach((info) => {

		describe(info.category, () => {

			info.tests.forEach((info) => {
				afterEach(async function() {
					if (this.currentTest.value) {
						await this.currentTest.value();
					}
				});

				it(info.name, async function() {
					if (info.after) {
						this.test.value = info.after;
					}
					if (info.action) {
						await info.action();
					}
					await page.evaluate(() => {
						return new Promise(resolve => setTimeout(resolve, 0));
					});

					const options = info.screenshotOptions || {};
					const rect = await (info.rect ? info.rect() : visualDiff.getRect(page, info.selector, 24));
					options.clip = rect;
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), options);
				});
			});

		});

	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
			await page.reload();
			await visualDiff.resetFocus(page);
		});

		[
			{ name: 'expandable selectable draggable', selector: '#expand-collapse-selectable-draggable' },
		].forEach((info) => {
			it(info.name, async function() {
				if (info.action) {
					await info.action();
				}
				await page.evaluate(() => {
					return new Promise(resolve => setTimeout(resolve, 0));
				});
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});

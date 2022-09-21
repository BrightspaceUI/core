import { hide, show } from '../../tooltip/test/tooltip-helper.js';
import { open, reset } from '../../dropdown/test/dropdown-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe.only('d2l-list', () => {

	const visualDiff = new VisualDiff('list', import.meta.url);

	let browser, page;

	const closeDropdown = (selector) => {
		return reset(page, selector);
	};

	const focusMethod = (selector) => {
		return page.$eval(selector, (item) => {
			item.focus();
		});
	};

	const focusInput = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('d2l-selection-input').focus();
		});
	};

	const focusLink = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('a').focus();
		});
	};

	const focusButton = (selector) => {
		return page.$eval(selector, (item) => {
			item.shadowRoot.querySelector('button').focus();
		});
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
		return page.$eval(selector, (container, y) => {
			return new Promise(resolve => {
				container.scrollTo(0, y);
				setTimeout(resolve, 400);
			});
		}, y);
	};

	const wait = (selector, milliseconds) => {
		return page.$eval(selector, async(elem, milliseconds) => {
			await elem.updateComplete;
			await new Promise(resolve => setTimeout(resolve, milliseconds));
		}, milliseconds);
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 6500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
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
		{ category: 'item-content', tests: [
			{ name: 'all', selector: '#itemContent' },
			{ name: 'no padding', selector: '#itemContentNoPadding' }
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
		{ category: 'selectable', tests: [
			{ name: 'not selected', selector: '#selectable' },
			{ name: 'not selected focus', selector: '#selectable', action: () => focusInput('#selectable [selectable]') },
			{ name: 'not selected hover', selector: '#selectable', action: () => hover('#selectable [selectable]') },
			{ name: 'selected', selector: '#selectableSelected' },
			{ name: 'selected focus', selector: '#selectableSelected', action: () => focusInput('#selectableSelected [selectable]') },
			{ name: 'selected hover', selector: '#selectableSelected', action: () => hover('#selectableSelected [selectable]') },
			{ name: 'item-content', selector: '#selectableItemContent' },
			{ name: 'skeleton', selector: '#selectableSkeleton' },
			{ name: 'extended separators', selector: '#selectableSeparatorsExtended' }
		] },
		{ category: 'header', tests: [
			{ name: 'not selectable', selector: '#noSelectableHeader' },
			{ name: 'none selected', selector: '#selectableHeader' },
			{ name: 'some selected', selector: '#selectableSomeSelectedHeader' },
			{ name: 'all selected', selector: '#selectableAllSelectedHeader' },
			{ name: 'all selected pages', selector: '#selectableAllSelectedHeaderPages' },
			{ name: 'sticky top', selector: '#stickyHeader', action: () => scrollTo('#stickyHeader > div', 0) },
			{ name: 'sticky scrolled', selector: '#stickyHeader', action: () => scrollTo('#stickyHeader > div', 45) }
		] },
		{ category: 'draggable', tests: [
			{ name: 'default', selector: '#draggable' },
			{ name: 'focus', selector: '#draggable', action: () => focusMethod('#draggable [key="1"]') },
			{ name: 'hover', selector: '#draggable', action: () => hover('#draggable [key="1"]') },
			{ name: 'selectable', selector: '#draggableSelectable' },
			{ name: 'selectable focus', selector: '#draggableSelectable', action: () => focusInput('#draggableSelectable [key="1"]') },
			{ name: 'selectable hover', selector: '#draggableSelectable', action: () => hover('#draggableSelectable [key="1"]') },
			{ name: 'extended separators', selector: '#draggableSeparatorsExtended' }
		] },
		{ category: 'focus method', tests: [
			{ name: 'href', selector: '#href', action: () => focusMethod('#href d2l-list-item') },
			{ name: 'button', selector: '#button', action: () => focusMethod('#button d2l-list-item-button') },
			{ name: 'selectable', selector: '#selectable', action: () => focusMethod('#selectable [selectable]') },
			{ name: 'actions', selector: '#actions', action: () => focusMethod('#actions d2l-list-item') }
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
			{ name: 'all-selected', selector: '#nested-all-selected', action: () => wait('#nested-all-selected d2l-list-header', 100) }
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
					const rect = await (info.rect ? info.rect() : visualDiff.getRect(page, info.selector, 24));
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

});

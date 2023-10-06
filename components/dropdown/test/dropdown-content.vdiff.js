import '../../button/button.js';
import '../dropdown.js';
import '../dropdown-content.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { styleMap } from 'lit/directives/style-map.js';

function createDropdown(content, dropdown, opener) {
	const dropdownStyles = { position: 'absolute', ...dropdown };
	const openerStyles = {
		backgroundColor: 'gray',
		border: '2px solid black',
		borderRadius: '50%',
		boxSizing: 'border-box',
		height: '30px',
		width: '30px',
		...opener };
	return html`
		<div style="box-sizing: border-box; height: 400px; padding: 30px; position: relative; overflow: hidden;">
			<d2l-dropdown style="${styleMap(dropdownStyles)}">
				<div class="d2l-dropdown-opener" style="${styleMap(openerStyles)}"></div>
				${content}
			</d2l-dropdown>
		</div>
	`;
}

const basicText = html`<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>`;
const longerText = html`<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>`;
const blockText = html`<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>`;
const repeatedText = html`<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua.</div>`;

const withHeaderFooter = html`
	<div slot="header">Header</div>
	${longerText}
	<div slot="footer">Footer</div>
`;
const withLink = html`
	<a href="http://www.desire2learn.com">D2L</a>
	${basicText}
`;

const scroll = html`
	<div>Top</div>
	${Array.from(Array(12).keys()).map((key) => html`<div>Line ${key + 1}</div>`)}
	<div>Bottom</div>
`;

describe('dropdown-content', () => {
	[
		{ name: 'default-width', content: html`<d2l-dropdown-content opened></d2l-dropdown-content>` },
		{ name: 'min-width', content: html`<d2l-dropdown-content min-width="600" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'max-width', content: html`<d2l-dropdown-content max-width="200" opened>${longerText}</d2l-dropdown-content>` },
		{ name: 'min-height', dropdownStyles: { left: '50%', top: '50%' }, content: html`<d2l-dropdown-content min-height="1000" no-auto-fit opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'max-height', content: html`<d2l-dropdown-content max-height="100" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'max-height-invalid', content: html`<d2l-dropdown-content max-height="30" opened><div slot="header"><h1>Header Larger Than Max</h1></div>${longerText}</d2l-dropdown-content>` },
		{ name: 'wide-opener', dropdownStyles: { left: '30px', right: '30px', top: '75px' }, openerStyles: { borderRadius: '5px', width: '100%' }, content: html`<d2l-dropdown-content boundary="{&quot;right&quot;:50, &quot;above&quot;:20}" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'with-header-footer', content: html`<d2l-dropdown-content opened>${withHeaderFooter}</d2l-dropdown-content>` },
		{ name: 'no-padding-no-pointer', content: html`<d2l-dropdown-content no-padding no-pointer opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'scroll-bottom-shadow', content: html`<d2l-dropdown-content opened>${scroll}</d2l-dropdown-content>` },
		{ name: 'vertical-offset', dropdownStyles: { left: '50%' }, content: html`<d2l-dropdown-content vertical-offset="100" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'vertical-offset-edge', dropdownStyles: { left: '50%' }, content: html`<d2l-dropdown-content vertical-offset="100" opened>${longerText}</d2l-dropdown-content>` },
		{ name: 'vertical-offset-negative', dropdownStyles: { left: '50%' }, content: html`<d2l-dropdown-content vertical-offset="-25" opened>${blockText}</d2l-dropdown-content>` },
		{ name: 'boundary-left-below', dropdownStyles: { left: '50%', top: '50%' }, content: html`<d2l-dropdown-content boundary="{&quot;left&quot;:50, &quot;below&quot;:20}" opened>${longerText}</d2l-dropdown-content>` },
		{ name: 'boundary-right-above', dropdownStyles: { left: '50%', top: '50%' }, content: html`<d2l-dropdown-content boundary="{&quot;right&quot;:50, &quot;above&quot;:20}" opened>${basicText}</d2l-dropdown-content>` }
	].forEach(({ name, content, dropdownStyles = {}, openerStyles = {} }) => {
		it(name, async() => {
			await fixture(createDropdown(content, dropdownStyles, openerStyles), { viewport: { height: 400 }, pagePadding: false });
			await expect(document).to.be.golden();
		});
	});

	[true, false].forEach(rtl => {
		[
			{ name: 'top-left', dropdownStyles: { left: '30px', top: '30px' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'top-middle', dropdownStyles: { left: '50%', top: '30px' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'top-right', dropdownStyles: { right: '30px', top: '30px' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'bottom-left', dropdownStyles: { bottom: '30px', left: '30px' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'bottom-middle', dropdownStyles: { bottom: '30px', left: '50%' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'bottom-right', dropdownStyles: { bottom: '30px', right: '30px' }, content: html`<d2l-dropdown-content opened>${withLink}</d2l-dropdown-content>` },
			{ name: 'align-start', dropdownStyles: { left: '50%', top: '30px' }, content: html`<d2l-dropdown-content align="start" opened>${basicText}</d2l-dropdown-content>` },
			{ name: 'align-end', dropdownStyles: { left: '50%', top: '30px' }, content: html`<d2l-dropdown-content align="end" opened>${basicText}</d2l-dropdown-content>` },
			{ name: 'align-start-edge', dropdownStyles: { insetInlineEnd: '30px', top: '30px' }, content: html`<d2l-dropdown-content align="start" opened>${withHeaderFooter}</d2l-dropdown-content>` }
		].forEach(({ name, content, dropdownStyles = {} }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				await fixture(createDropdown(content, dropdownStyles), { rtl, viewport: { height: 400 }, pagePadding: false });
				await expect(document).to.be.golden();
			});
		});
	});

	[
		{ name: 'mobile-right-tray', content: html`<d2l-dropdown-content mobile-tray="right" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-left-tray', content: html`<d2l-dropdown-content mobile-tray="left" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-bottom-tray', content: html`<d2l-dropdown-content mobile-tray="bottom" opened>${repeatedText}</d2l-dropdown-content>` },
		{ name: 'mobile-no-tray', content: html`<d2l-dropdown-content opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-right-tray-no-close', content: html`<d2l-dropdown-content mobile-tray="right" no-mobile-close-button opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-left-tray-no-close', content: html`<d2l-dropdown-content mobile-tray="left" no-mobile-close-button opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-bottom-tray-no-close', content: html`<d2l-dropdown-content mobile-tray="bottom" no-mobile-close-button opened>${repeatedText}</d2l-dropdown-content>` },
		{ name: 'mobile-right-tray-max-width', content: html`<d2l-dropdown-content mobile-tray="right" max-width="300" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-left-tray-max-width', content: html`<d2l-dropdown-content mobile-tray="left" max-width="300" opened>${basicText}</d2l-dropdown-content>` },
		{ name: 'mobile-bottom-tray-max-height', content: html`<d2l-dropdown-content mobile-tray="bottom" max-height="200" opened>${repeatedText}</d2l-dropdown-content>` }
	].forEach(({ name, content }) => {
		it(name, async() => {
			await fixture(createDropdown(content), { viewport: { width: 600, height: 500 }, pagePadding: false });
			await expect(document).to.be.golden();
		});
	});

	it('scroll-top-shadow', async() => {
		const elem = await fixture(createDropdown(html`<d2l-dropdown-content opened>${scroll}</d2l-dropdown-content>`), { viewport: { height: 400 }, pagePadding: false });
		const content = elem.querySelector('d2l-dropdown-content');
		content.scrollTo(1000);
		await expect(document).to.be.golden();
	});
});

import '../../button/button.js';
import '../dropdown.js';
import '../dropdown-button-subtle.js';
import '../dropdown-button.js';
import '../dropdown-content.js';
import '../dropdown-context-menu.js';
import '../dropdown-more.js';
import { clickElem, defineCE, expect, fixture, html, nextFrame, oneEvent, sendKeys } from '@brightspace-ui/testing';
import { css, LitElement } from 'lit';

const wrappedDropdown = defineCE(
	class extends LitElement {
		static get styles() {
			return css`
				:host { display: inline-block; }
			`;
		}
		render() {
			return html`
				<d2l-dropdown>
					<d2l-button class="d2l-dropdown-opener">Open it!</d2l-button>
					<d2l-dropdown-content class="vdiff-target" max-width="400">
						<div slot="header">
							<h3>Scrolling is Fun</h3>
						</div>
						<a href="https://youtu.be/9ze87zQFSak">Google</a>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
							magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
							commodo consequat.</p>
						<div slot="footer">
							<a href="http://www.desire2learn.com">D2L</a>
						</div>
					</d2l-dropdown-content>
				</d2l-dropdown>
				<d2l-button>See!</d2l-button>
			`;
		}
	}
);

describe('dropdown-openers', () => {
	// test for https://github.com/BrightspaceUI/core/issues/1398
	it('autoclose', async() => {
		const elem = await fixture(`<${wrappedDropdown}></${wrappedDropdown}>`);
		clickElem(elem);
		await oneEvent(elem, 'd2l-dropdown-open');
		await nextFrame();
		await sendKeys('press', 'Tab');
		await sendKeys('press', 'Tab');
		await expect(elem).to.be.golden();
	});

	[
		{ name: 'button-primary', template: html`<d2l-dropdown-button text="Open!" primary><d2l-dropdown-content></d2l-dropdown-content></d2l-dropdown-button>` },
		{ name: 'button-full-width', template: html`<d2l-dropdown-button text="Open!" style="width: 100%;"><d2l-dropdown-content></d2l-dropdown-content></d2l-dropdown-button>` },
		{ name: 'button-rtl', rtl: true, template: html`<d2l-dropdown-button text="Open!"><d2l-dropdown-content></d2l-dropdown-content></d2l-dropdown-button>` }
	].forEach(({ name, template, rtl }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport: { width: 300 }, rtl });
			await expect(elem).to.be.golden();
		});
	});

	[
		{ name: 'button', template: html`<d2l-dropdown-button text="Open!"><d2l-dropdown-content class="vdiff-include"><div>This is button content.</div></d2l-dropdown-content></d2l-dropdown-button>` },
		{ name: 'button-subtle', template: html`<d2l-dropdown-button-subtle text="Open!"><d2l-dropdown-content class="vdiff-include"><div>This is subtle content.</div></d2l-dropdown-content></d2l-dropdown-button-subtle>` },
		{ name: 'context-menu', template: html`<d2l-dropdown-context-menu><d2l-dropdown-content class="vdiff-include"><div>This is context content.</div></d2l-dropdown-content></d2l-dropdown-context-menu>` },
		{ name: 'more', template: html`<d2l-dropdown-more><d2l-dropdown-content class="vdiff-include"><div>This is more content.</div></d2l-dropdown-content></d2l-dropdown-more>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			elem.toggleOpen();
			await oneEvent(elem, 'd2l-dropdown-open');
			await expect(elem).to.be.golden();
		});
	});
});

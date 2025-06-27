import '../link.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';

describe('d2l-link', () => {

	before(loadSass);
	after(unloadSass);

	[
		{ name: 'wc-standard', template: html`<d2l-link href="https://www.d2l.com">Standard Link</d2l-link>` },
		{ name: 'wc-main', template: html`<d2l-link href="https://www.d2l.com" main>Main Link</d2l-link>` },
		{ name: 'wc-small', template: html`<d2l-link href="https://www.d2l.com" small>Small Link</d2l-link>` },
		{ name: 'wc-standard-new-window', template: html`<d2l-link target="_blank" href="https://www.d2l.com">Standard New Window Link</d2l-link>` },
		{ name: 'wc-small-new-window', template: html`<d2l-link target="_blank" small href="https://www.d2l.com">Small New Window Link</d2l-link>` },
		{ name: 'wc-standard-new-window-overflow', template: html`<div style="width: 240px"><d2l-link target="_blank" href="https://www.d2l.com">Standard New Window Link</d2l-link></div>` },
		{ name: 'wc-standard-new-window-truncated', template: html`<div style="width: 240px"><d2l-link lines="2" target="_blank" href="https://www.d2l.com">Standard New Window Link That is Much Longer Than the Container</d2l-link></div>` },
		{ name: 'wc-standard-new-window-truncated-one', template: html`<div style="width: 240px"><d2l-link lines="1" target="_blank" href="https://www.d2l.com">Standard New Window Link</d2l-link></div>` },
		{ name: 'wc-inline', template: html`<span><d2l-link href="#">Hello</d2l-link>, <d2l-link href="#">World</d2l-link>! w<d2l-link href="#">x</d2l-link>y<d2l-link href="#">z</d2l-link>!</span>` },
		{ name: 'wc-inline-paragraph', template: html`<p style="width: 400px;">Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. <d2l-link href="https://www.d2l.com">Standard Link</d2l-link> Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.</p>` },
		{ name: 'wc-block', template: html`<div style="width: 400px;"><d2l-link href="https://www.d2l.com" style="display: block;">A really long link that will wrap in its container to the next line.</d2l-link></div>` },
		{ name: 'wc-clamp-one-line', template: html`<div style="width: 400px"><d2l-link href="https://www.d2l.com" lines="1">A really long link that will overflow its container.</d2l-link></div>` },
		{ name: 'wc-clamp-unbreakable-one-line', template: html`<div style="width: 400px;"><d2l-link href="https://www.d2l.com" lines="1">Areallyreallylongunbreakablelinkthatwilloverflowitscontainer.</d2l-link></div>` },
		{ name: 'wc-clamp-two-lines', template: html`<div style="width: 400px;"><d2l-link href="https://www.d2l.com" lines="2">A really really long link that wraps in its container and then truncates after two lines of text like this.</d2l-link></div>` },
		{ name: 'wc-clamp-unbreakable-two-lines', template: html`<div style="width: 400px;"><d2l-link href="https://www.d2l.com" lines="2">Areallyreallyreallylongunbreakablelinkthatwrapsinitscontainerandthentruncatesaftertwolinesoftextlikethis.</d2l-link></div>` },
		{ name: 'sass-standard', template: html`<a href="https://www.d2l.com" class="d2l-test-link">Standard Link</a>` },
		{ name: 'sass-main', template: html`<a href="https://www.d2l.com" class="d2l-test-link" main>Main Link</a>` },
		{ name: 'sass-small', template: html`<a href="https://www.d2l.com" class="d2l-test-link" small>Small Link</a>` }
	].forEach(({ name, template }) => {

		describe('screen', () => {

			it(`${name}`, async() => {
				const elem = await fixture(template);
				await expect(elem).to.be.golden();
			});

			it(`${name} focused`, async() => {
				const elem = await fixture(template);
				const elemToFocus = elem.tagName === 'D2L-LINK' || elem.tagName === 'A' ? elem : elem.querySelector('d2l-link');
				await focusElem(elemToFocus);
				await expect(elem).to.be.golden();
			});

		});

		describe('print', () => {
			it(`${name}`, async() => {
				const elem = await fixture(template, { media: 'print' });
				await expect(elem).to.be.golden();
			});
		});

	});

});

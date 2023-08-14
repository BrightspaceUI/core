import '../dialog-fullscreen.js';
import { expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { footer, general, long, tabs } from './dialog-shared-contents.js';
import { ifDefined } from 'lit/directives/if-defined.js';

function dialog(opts) {
	const defaults = { content: html`${general}${footer}`, noPadding: false };
	const { content, noPadding, width } =  { ...defaults, ...opts };
	return html`
		<d2l-dialog-fullscreen title-text="Dialog Title" ?no-padding="${noPadding}" width="${ifDefined(width)}" opened>
			${content}
		</d2l-dialog-fullscreen>
	`;
}

function dispatchFullscreenWithinEvent(elem, state) {
	elem.dispatchEvent(new CustomEvent(
		'd2l-fullscreen-within', { bubbles: true, composed: true, detail: { state: state } }
	));
}

describe('dialog-fullscreen', () => {

	['native', 'custom'].forEach((type) => {

		describe(type, () => {
			before(async() => {
				window.D2L.DialogMixin.preferNative = type === 'native';
			});

			[
				{ screen: 'wider', viewport: { width: 1400, height: 700 } },
				{ screen: 'wide', viewport: { width: 800, height: 500 } },
				{ screen: 'narrow', viewport: { width: 600, height: 500 } },
				{ screen: 'landscape', viewport: { width: 600, height: 320 } }
			].forEach(({ screen, viewport }) => {
				describe(screen, () => {
					[
						{ name: 'opened', f: dialog() },
						{ name: 'openedSetWidth', f: dialog({ content: html`${tabs}${general}`, width: 1200 }) },
						{ name: 'openedSetWidthBelowMin', f: dialog({ content: html`${tabs}${general}`, width: 200 }) },
						{ name: 'openedSetWidthAboveMax', f: dialog({ content: html`${tabs}${general}`, width: 4000 }) },
						{ name: 'rtl', rtl: true, f: dialog() },
					].forEach(({ name, f, rtl }) => {
						it(name, async() => {
							await fixture(f, { viewport, rtl });
							await expect(document.body).to.be.golden();
						});
					});
				});
			});

			describe('internal', () => {

				[
					{ name: 'no-footer-content', f: dialog({ content: long }) },
					{ name: 'no-padding', f: dialog({ content: html`<div style="background-color: var(--d2l-color-citrine); height: 100%; width: 100%;">No padding!</div>${footer}`, noPadding: true }) },
					{ name: 'horizontal-overflow', f: dialog({ content: html`${tabs}${general}` }) },
					{ name: 'scroll-bottom-shadow', f: dialog({ content: html`${long}${footer}` }) },
					{ name: 'scroll-top-shadow', f: dialog({ content: html`${long}${footer}` }), action: elem => elem.querySelector('#bottom').scrollIntoView() },
					{ name: 'fullscreen-within-on', f: dialog(), action: elem => dispatchFullscreenWithinEvent(elem.querySelector('#top'), true) },
					{ name: 'fullscreen-within-off', f: dialog(), action:
						async(elem) => {
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), true);
							await nextFrame();
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), false);
						}
					}
				].forEach(({ name, f, action }) => {
					it(name, async() => {
						const elem = await fixture(f, { viewport: { width: 800, height: 500 } });
						if (action) await action(elem);
						await expect(document.body).to.be.golden();
					});
				});
			});
		});
	});
});

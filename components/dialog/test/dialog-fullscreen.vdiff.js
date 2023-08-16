import '../dialog-fullscreen.js';
import { expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { footer, general, long, tabs } from './dialog-shared-contents.js';
import { ifDefined } from 'lit/directives/if-defined.js';

function createDialog(opts) {
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
						{ name: 'opened', template: createDialog() },
						{ name: 'opened-set-width', template: createDialog({ content: html`${tabs}${general}`, width: 1200 }) },
						{ name: 'opened-set-width-below-min', template: createDialog({ content: html`${tabs}${general}`, width: 200 }) },
						{ name: 'opened-set-width-above-max', template: createDialog({ content: html`${tabs}${general}`, width: 4000 }) },
						{ name: 'rtl', rtl: true, template: createDialog() },
					].forEach(({ name, template, rtl }) => {
						it(name, async() => {
							await fixture(template, { viewport, rtl });
							await expect(document).to.be.golden();
						});
					});
				});
			});

			describe('internal', () => {

				[
					{ name: 'no-footer-content', template: createDialog({ content: long }) },
					{ name: 'no-padding', template: createDialog({ content: html`<div style="background-color: var(--d2l-color-citrine); height: 100%; width: 100%;">No padding!</div>${footer}`, noPadding: true }) },
					{ name: 'horizontal-overflow', template: createDialog({ content: html`${tabs}${general}` }) },
					{ name: 'scroll-bottom-shadow', template: createDialog({ content: html`${long}${footer}` }) },
					{ name: 'scroll-top-shadow', template: createDialog({ content: html`${long}${footer}` }), action: elem => elem.querySelector('#bottom').scrollIntoView() },
					{ name: 'fullscreen-within-on', template: createDialog(), action: elem => dispatchFullscreenWithinEvent(elem.querySelector('#top'), true) },
					{ name: 'fullscreen-within-off', template: createDialog(), action:
						async(elem) => {
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), true);
							await nextFrame();
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), false);
						}
					}
				].forEach(({ name, template, action }) => {
					it(name, async() => {
						const elem = await fixture(template, { viewport: { width: 800, height: 500 } });
						if (action) await action(elem);
						await expect(document).to.be.golden();
					});
				});
			});
		});
	});
});

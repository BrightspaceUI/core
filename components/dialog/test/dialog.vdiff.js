import '../dialog.js';
import { expect, fixture, html, nextFrame } from '@brightspace-ui/testing';
import { footer, general, long } from './dialog-shared-contents.js';

function dialog(opts) {
	const defaults = { content: html`${general}${footer}`, fullHeight: false, width: 400 };
	const { content, fullHeight, width } =  { ...defaults, ...opts };
	return html`
		<d2l-dialog title-text="Dialog Title" ?full-height="${fullHeight}" width="${width}" opened>
			${content}
		</d2l-dialog>
	`;
}

function dispatchFullscreenWithinEvent(elem, state) {
	elem.dispatchEvent(new CustomEvent(
		'd2l-fullscreen-within', { bubbles: true, composed: true, detail: { state: state } }
	));
}

describe('dialog', () => {

	['native', 'custom'].forEach((type) => {

		describe(type, () => {
			before(async() => {
				window.D2L.DialogMixin.preferNative = type === 'native';
			});

			[
				{ screen: 'tall-wide', viewport: { width: 800, height: 500 } },
				{ screen: 'tall-narrow', viewport: { width: 600, height: 500 } },
				{ screen: 'short-wide', viewport: { width: 910, height: 400 } },
				{ screen: 'short-narrow', viewport: { width: 890, height: 400 } }
			].forEach(({ screen, viewport }) => {
				describe(screen, () => {
					[
						{ name: 'opened', f: dialog() },
						{ name: 'opened-wide', f: html`<div style="width: 1500px;">${dialog()}</div>` },
						{ name: 'rtl', rtl: true, f: dialog() },
						{ name: 'resize', f: dialog({ content: html`<div style="background-color: orange;">Line 1</div>${footer}` }), action:
							async(elem) => {
								elem.querySelector('div').style.height = '60px';
								elem.width = 500;
								elem.resize();
							}
						}
					].forEach(({ name, f, rtl, action }) => {
						it(name, async() => {
							const elem = await fixture(f, { viewport, rtl });
							if (action) await action(elem);
							await expect(document).to.be.golden();
						});
					});
				});
			});

			describe('internal', () => {

				[
					{ name: 'no-footer-content', f: dialog({ content: long }) },
					{ name: 'scroll-bottom-shadow', f: dialog({ content: html`${long}${footer}` }) },
					{ name: 'scroll-top-shadow', f: dialog({ content: html`${long}${footer}` }), action: elem => elem.querySelector('#bottom').scrollIntoView() },
					{ name: 'fullscreen-within-on', f: dialog(), action: elem => dispatchFullscreenWithinEvent(elem.querySelector('#top'), true) },
					{ name: 'fullscreen-within-off', f: dialog(), action:
						async(elem) => {
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), true);
							await nextFrame();
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), false);
						}
					},
					{ name: 'full-height', f: dialog({ fullHeight: true }) },
					{ name: 'full-height-narrow', f: dialog({ content: html`<div>Top</div><div>Line 1</div><div>Bottom</div>`, fullHeight: true, width: 150 }) },
				].forEach(({ name, f, action }) => {
					it(name, async() => {
						const elem = await fixture(f, { viewport: { width: 800, height: 500 } });
						if (action) await action(elem);
						await expect(document).to.be.golden();
					});
				});
			});
		});
	});
});

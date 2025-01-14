import '../dialog.js';
import { defineCE, expect, fixture, html, nextFrame, oneEvent, sendKeys, waitUntil } from '@brightspace-ui/testing';
import { footer, general, long, wrapping } from './dialog-shared-contents.js';
import { interferingStyleWrapper } from '../../typography/test/typography-shared-contents.js';
import { LitElement } from 'lit';
import { LoadingCompleteMixin } from '../../../mixins/loading-complete/loading-complete-mixin.js';

function createDialog(opts) {
	const defaults = { content: html`${general}${footer}`, fullHeight: false, width: 400, critical: false };
	const { content, fullHeight, width, critical } = { ...defaults, ...opts };
	return html`
		<d2l-dialog title-text="Dialog Title" ?full-height="${fullHeight}" width="${width}" opened ?critical="${critical}">
			${content}
		</d2l-dialog>
	`;
}

function dispatchFullscreenWithinEvent(elem, state) {
	elem.dispatchEvent(new CustomEvent(
		'd2l-fullscreen-within', { bubbles: true, composed: true, detail: { state: state } }
	));
}

const delayedTag = defineCE(
	class extends LoadingCompleteMixin(LitElement) {
		static get properties() {
			return {
				loaded: { type: Boolean }
			};
		}
		constructor() {
			super();
			this.loaded = false;
		}
		render() {
			return this.loaded ?
				html`<div style="border: 2px solid green; margin: 200px;">Loaded</div>` :
				html`<div style="border: 2px solid red; margin: 10px;">Loading...</div>`;
		}
		finishLoading() {
			this.loaded = true;
			this.resolveLoadingComplete();
		}
	}
);

describe('dialog', () => {

	[/*'native',*/ 'custom'].forEach((type) => {

		describe(type, () => {
			before(() => window.D2L.DialogMixin.preferNative = type === 'native');

			[
				{ screen: 'tall-wide', viewport: { width: 800, height: 500 } },
				{ screen: 'tall-narrow', viewport: { width: 600, height: 500 } },
				{ screen: 'short-wide', viewport: { width: 910, height: 370 } },
				{ screen: 'short-narrow', viewport: { width: 890, height: 400 } }
			].forEach(({ screen, viewport }) => {
				describe(screen, () => {
					[
						{ name: 'opened', template: createDialog() },
						{ name: 'opened-wide', template: html`<div style="width: 1500px;">${createDialog()}</div>` },
						{ name: 'rtl', rtl: true, template: createDialog() },
						{ name: 'resize', template: createDialog({ content: html`<div style="background-color: orange;">Line 1</div>${footer}` }), action:
							async(elem) => {
								elem.querySelector('div').style.height = '60px';
								elem.width = 500;
								elem.resize();
							}
						},
						{ name: 'focus on content when overflowing content', template: createDialog({ content: html`<div style="height: 5000px;">Line 1</div>` }), action: async() => await sendKeys('press', 'Tab') },
						{ name: 'focus on content when overflowing content and footer', template: createDialog({ content: html`<div style="height: 5000px;">Line 1</div>${footer}` }), action:
							async() => {
								await sendKeys('press', 'Tab');
								await sendKeys('press', 'Tab');
								await sendKeys('press', 'Tab');
							}
						},
						{ name: 'focus on content when short content', template: createDialog({ content: html`<div style="height: 200px;">Line 1</div>` }), action: async() => await sendKeys('press', 'Tab') },
						{ name: 'focus on focusable elem when overflowing content', template: createDialog({ content: html`<div style="height: 5000px;"><button>My button</button></div>` }), action:
							async() => {
								await sendKeys('press', 'Tab');
								await sendKeys('press', 'Tab');
							}
						}
					].forEach(({ name, template, rtl, action }) => {
						it(name, async() => {
							const elem = await fixture(template, { viewport, rtl });
							if (action) await action(elem);
							await expect(document).to.be.golden();
						});
					});
				});
			});

			describe('internal', () => {

				[
					{ name: 'no-footer-content', template: createDialog({ content: long }) },
					{ name: 'critical', template: createDialog({ content: long, critical: true }) },
					{ name: 'scroll-bottom-shadow', template: createDialog({ content: html`${long}${footer}` }) },
					{ name: 'scroll-top-shadow', template: createDialog({ content: html`${long}${footer}` }), action: elem => elem.querySelector('#bottom').scrollIntoView() },
					{ name: 'fullscreen-within-on', template: createDialog(), action: elem => dispatchFullscreenWithinEvent(elem.querySelector('#top'), true) },
					{ name: 'fullscreen-within-off', template: createDialog(), action:
						async(elem) => {
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), true);
							await nextFrame();
							dispatchFullscreenWithinEvent(elem.querySelector('#top'), false);
						}
					},
					{ name: 'full-height', template: createDialog({ content: html`<div style="background-color: orange; border: 1px solid black; box-sizing: border-box; height: 100%;"></div>${footer}`, fullHeight: true }) },
					{ name: 'full-height-narrow', template: createDialog({ content: html`<div>Top</div><div>Line 1</div><div>Bottom</div>`, fullHeight: true, width: 150 }) },
				].forEach(({ name, template, action }) => {
					it(name, async() => {
						const elem = await fixture(template, { viewport: { width: 800, height: 500 } });
						if (action) await action(elem);
						await expect(document).to.be.golden();
					});
				});
			});

			it('reset-styles', async() => {
				await fixture(interferingStyleWrapper(createDialog({ content: html`${wrapping}${footer}` })));
				await expect(document).to.be.golden();
			});

			it('delayed-content', async() => {
				const el = await fixture(
					`<d2l-dialog title-text="Delayed Dialog"><${delayedTag}></${delayedTag}></d2l-dialog>`,
					{
						awaitLoadingComplete: false
					}
				);
				setTimeout(async() => {
					await waitUntil(() => el.querySelector(delayedTag) !== null);
					setTimeout(() => el.querySelector(delayedTag).finishLoading(), 100);
				});
				el.opened = true;
				await oneEvent(el, 'd2l-dialog-open');

				await expect(document).to.be.golden();
			});

		});
	});
});

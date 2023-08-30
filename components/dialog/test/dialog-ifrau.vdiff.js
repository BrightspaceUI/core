import { expect, fixture, html } from '@brightspace-ui/testing';
import { Host } from 'ifrau/host.js';

describe('dialog-ifrau', () => {

	[/*'native',*/ 'custom'].forEach((type) => {

		describe(type, () => {
			let iframeSrc;

			before(() => {
				const preferNative = (type === 'native' ? '' : '?preferNative=false');
				iframeSrc = `${window.location.origin}/components/dialog/test/dialog-ifrau-contents.vdiff.html${preferNative}`;

				const iframeOrigin = new URL(iframeSrc).origin;
				const verifyPostMessage = (evt, expectedData) => {
					return evt && evt.data === expectedData && iframeOrigin === evt.origin;
				};
				const handleIsFramedRequest = evt => {
					if (!verifyPostMessage(evt, 'isFramedRequest')) return;
					evt.source.postMessage({ isFramed: true }, iframeSrc);
				};
				window.addEventListener('message', handleIsFramedRequest, false);
			});

			[
				{ name: 'ifrau top height lt dialog top margin', ifrau: { availableHeight: 500, top: 50 } },
				{ name: 'ifrau top height gt dialog top margin', ifrau: { availableHeight: 500, top: 120 } },
				{ name: 'ifrau available height lt host height', ifrau: { availableHeight: 300, top: 50 } },
				{ name: 'host scrolled down', ifrau: { availableHeight: 400, top: -50 } }
			].forEach(({ name, ifrau }) => {
				it(name, async() => {
					const elem = await fixture(html`<div id="ifrau-dialog-container" style="width: 650px; line-height: 0;"></div>`, { viewport: { width: 726, height: 300 } });
					const ifrauHost = new Host(
						() => elem,
						iframeSrc,
						{ height: '450px' }
					);

					await ifrauHost.registerService('dialogWC', '0.1', {
						showBackdrop: () => {
							return {
								availableHeight: ifrau.availableHeight,
								top: ifrau.top
							};
						},
						hideBackdrop: async() => {}
					});
					await ifrauHost.connect();

					await expect(document).to.be.golden();
				}).timeout(5000); // ifrau connecting can be very slow
			});
		});
	});
});

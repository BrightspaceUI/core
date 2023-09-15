import '../../colors/colors.js';
import '../icon-custom.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const tier3 = html`
<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" mirror-in-rtl="true">
	<path fill="#494c4e" d="M21.5,18H8.5a.5.5,0,0,1,0-1h13a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M21.5,15H8.5a.5.5,0,0,1,0-1h13a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M15.5,12h-7a.5.5,0,0,1,0-1h7a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M13.5,9h-5a.5.5,0,0,1,0-1h5a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M13.5,6h-5a.5.5,0,0,1,0-1h5a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M25.87,8a.833.833,0,0,0-.16-.21L18.21.29A.833.833,0,0,0,18,.13.983.983,0,0,0,17.5,0H8A4.012,4.012,0,0,0,4,4V22a4.012,4.012,0,0,0,4,4H22a4.012,4.012,0,0,0,4-4V8.5A.982.982,0,0,0,25.87,8ZM18,2.92,23.08,8H20a2.006,2.006,0,0,1-2-2ZM24,22a2.006,2.006,0,0,1-2,2H8a2.006,2.006,0,0,1-2-2V4A2.006,2.006,0,0,1,8,2h8V6a4.012,4.012,0,0,0,4,4h4Z"/>
	<path fill="#494c4e" d="M21.5,21H8.5a.5.5,0,0,1,0-1h13a.5.5,0,0,1,0,1Z"/>
	<path fill="#494c4e" d="M30,20v4a6.018,6.018,0,0,1-6,6H6a6.018,6.018,0,0,1-6-6V20a1,1,0,0,1,2,0v4a4,4,0,0,0,4,4H24a4,4,0,0,0,4-4V20a1,1,0,0,1,2,0Z"/>
</svg>
`;

describe('d2l-icon-custom', () => {

	[
		{
			name: 'tier1',
			svg: html`
				<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" mirror-in-rtl="true">
					<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
					<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
				</svg>
			`
		},
		{
			name: 'tier2',
			svg: html`
				<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" mirror-in-rtl="true">
					<path fill="#494c4e" d="M19.71 4.29l-4-4C15.52.1 15.26 0 15 0H6C4.9 0 4 .9 4 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-.26-.1-.52-.29-.71zM15 2.42L17.58 5H15.5c-.28 0-.5-.22-.5-.5V2.42zm3 15.08c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h6c.28 0 .5.22.5.5V5c0 1.1.9 2 2 2h2.5c.28 0 .5.22.5.5v10z"/>
					<path fill="#494c4e" d="M24 16v4.99c0 1.65-1.35 3.01-3 3.01H3c-1.65 0-2.99-1.35-3-3v-5c0-.02 0-.04.01-.06.02-.52.46-.94.99-.94s.97.42.99.94c.01.02.01.04.01.06v4c.01 1.1.91 1.99 2 1.99h16c1.09 0 1.99-.89 2-1.99v-4c0-.02 0-.04.01-.06.02-.52.46-.94.99-.94s.97.42.99.94c.01.02.01.04.01.06z"/>
					<path fill="#494c4e" d="M15 16H9c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zM15 12H9c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zM11 8H9c-.553 0-1-.447-1-1s.447-1 1-1h2c.553 0 1 .447 1 1s-.447 1-1 1z"/>
				</svg>
			`
		},
		{ name: 'tier3', svg: tier3 }
	].forEach(({ name, svg }) => {
		const template = html`<d2l-icon-custom size="${name}">${svg}</d2l-icon>`;
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
		it(`rtl-${name}`, async() => {
			const elem = await fixture(template, { rtl: true });
			await expect(elem).to.be.golden();
		});
	});

	[
		{
			name: 'fill-none',
			template: html`
				<d2l-icon-custom size="tier2">
					<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path fill="none" d="M12,2H4A2.006,2.006,0,0,0,2,4V16a2.006,2.006,0,0,0,2,2V8A4,4,0,0,1,8,4h6A2,2,0,0,0,12,2Z"/>
						<path fill="#494c4e" d="M23.953,13.942a1.314,1.314,0,0,0-.664-.84,1.37,1.37,0,0,0-.393-1,1.333,1.333,0,0,0-1-.392,1.343,1.343,0,0,0-1.9-.5,1.343,1.343,0,0,0-1.9.5,1.337,1.337,0,0,0-1,.392,1.373,1.373,0,0,0-.392,1,1.343,1.343,0,0,0-.5,1.9,1.343,1.343,0,0,0,.5,1.9,1.37,1.37,0,0,0,.392,1,1.3,1.3,0,0,0,1,.393,1.112,1.112,0,0,0,.3.368v5.119a.213.213,0,0,0,.056.152A.174.174,0,0,0,18.6,24a.188.188,0,0,0,.136-.056l.008-.008L20,22.8l1.264,1.145A.189.189,0,0,0,21.4,24a.174.174,0,0,0,.144-.072.213.213,0,0,0,.056-.152V18.657a1.112,1.112,0,0,0,.3-.368,1.3,1.3,0,0,0,1-.393,1.367,1.367,0,0,0,.393-1,1.343,1.343,0,0,0,.5-1.9A1.313,1.313,0,0,0,23.953,13.942ZM20,16.6A1.6,1.6,0,1,1,21.6,15,1.6,1.6,0,0,1,20,16.6Z"/>
						<path fill="#494c4e" d="M15.556,9H8.443a.5.5,0,0,0,0,1h7.114a.5.5,0,0,0,0-1Z"/>
						<path fill="#494c4e" d="M13.557,15H8.443a.5.5,0,0,0,0,1h5.114a.5.5,0,0,0,0-1Z"/>
						<path fill="#494c4e" d="M13.557,12H8.443a.5.5,0,0,0,0,1h5.114a.5.5,0,0,0,0-1Z"/>
						<path fill="#494c4e" d="M15.557,18H8.531a.5.5,0,1,0,0,1h7.026a.5.5,0,0,0,0-1Z"/>
						<path fill="#494c4e" d="M16,4a4,4,0,0,0-4-4H4A4,4,0,0,0,0,4V16a4,4,0,0,0,4,4,4,4,0,0,0,4,4h7a1,1,0,0,0,0-2,.127.127,0,0,0-.06.01V22H8a2.006,2.006,0,0,1-2-2V8A2.006,2.006,0,0,1,8,6h8a2.015,2.015,0,0,1,2,2,1,1,0,0,0,2,0A4,4,0,0,0,16,4ZM8,4A4,4,0,0,0,4,8V18a2.006,2.006,0,0,1-2-2V4A2.006,2.006,0,0,1,4,2h8a2.006,2.006,0,0,1,2,2Z"/>
					</svg>
				</d2l-icon-custom>
			`
		},
		{
			name: 'fill-circle',
			template: html`
				<d2l-icon-custom size="tier2">
					<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<circle fill="#494c4e" cx="12.5" cy="1.5" r="1.5"/>
						<circle fill="#494c4e" cx="12.5" cy="6.5" r="1.5"/>
						<circle fill="#494c4e" cx="12.5" cy="11.5" r="1.5"/>
						<circle fill="#494c4e" cx="12.5" cy="16.5" r="1.5"/>
						<circle fill="#494c4e" cx="12.5" cy="21.5" r="1.5"/>
					</svg>
				</d2l-icon-custom>
			`
		},
		{
			name: 'fill-mixed',
			template: html`
				<d2l-icon-custom size="tier2" style="color: var(--d2l-color-celestine-minus-1)">
					<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<rect fill="#f9fbff" stroke-width="1" stroke="#6e7477" x="0.5" y="0.5" width="23" height="23" rx="5.5"/>
						<path fill="#494c4e" d="M19.707,7.293a1,1,0,0,0-1.414,0L10,15.586,6.707,12.293a1,1,0,0,0-1.414,1.414l4,4a1,1,0,0,0,1.414,0l9-9A1,1,0,0,0,19.707,7.293Z"/>
					</svg>
				</d2l-icon-custom>
			`
		},
		{
			name: 'color-override',
			template: html`<d2l-icon-custom size="tier3" style="color: var(--d2l-color-celestine-minus-1)">${tier3}</d2l-icon-custom>`
		},
		{
			name: 'size-override',
			template: html`<d2l-icon-custom size="tier3" style="height: 100px; width: 100px;">${tier3}</d2l-icon-custom>`
		}
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

});

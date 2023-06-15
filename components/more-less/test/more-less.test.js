import '../more-less.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

function waitForHeight(elem) {
	return new Promise((resolve) => {
		function check() {
			const content = elem.shadowRoot.querySelector('.d2l-more-less-content');
			if (content.style.maxHeight === '') {
				setTimeout(() => check(), 10);
			} else {
				// Need the second timeout here to give the transition a chance to finish
				setTimeout(() => resolve(), 400);
			}
		}
		check();
	});
}

describe('d2l-more-less', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-more-less');
		});

	});

	describe('expanded', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-more-less expanded>
					<p id="clone-target">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum venenatis arcu sit amet varius. Maecenas posuere magna arcu, quis maximus odio fringilla ac. Integer ligula lorem, faucibus sit amet cursus vel, pellentesque a justo. Aliquam urna metus, molestie at tempor eget, vestibulum a purus. Donec aliquet rutrum mi. Duis ornare congue tempor. Nullam sed massa fermentum, tincidunt leo eu, vestibulum orci. Sed ultrices est in lacus venenatis, posuere suscipit arcu scelerisque. In aliquam ipsum rhoncus, lobortis ligula ut, molestie orci. Proin scelerisque tempor posuere. Phasellus consequat, lorem quis hendrerit tempor, sem lectus sagittis nunc, in tristique dui arcu non arcu. Nunc aliquam nisi et sapien commodo lacinia. <a href="javascript:void(0);">Quisque</a> iaculis orci vel odio varius porta. Fusce tincidunt dolor enim, vitae sollicitudin purus suscipit eu.</p>
				</d2l-more-less>
			`);
			await waitForHeight(elem);
		});

		it('should expand when more content is dynamically added', async() => {

			const content = elem.shadowRoot.querySelector('.d2l-more-less-content');
			const previousContentHeight = content.scrollHeight;
			expect(elem.offsetHeight).to.be.above(content.scrollHeight);

			const p = document.getElementById('clone-target');
			content.appendChild(p.cloneNode(true));

			await waitForHeight(elem);

			expect(content.scrollHeight).to.be.above(previousContentHeight);
			expect(elem.offsetHeight).to.be.above(content.scrollHeight);

		});

	});

});

import '../more-less.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { waitForHeight } from './more-less.test.js';

describe('d2l-more-less', () => {

	[true, false].forEach((expanded) => {
		it(`expanded: ${expanded}`, async() => {
			const elem = await fixture(html`
				<d2l-more-less ?expanded="${expanded}">
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum venenatis arcu sit amet varius. Maecenas posuere magna arcu, quis maximus odio fringilla ac. Integer ligula lorem, faucibus sit amet cursus vel, pellentesque a justo. Aliquam urna metus, molestie at tempor eget, vestibulum a purus. Donec aliquet rutrum mi. Duis ornare congue tempor. Nullam sed massa fermentum, tincidunt leo eu, vestibulum orci. Sed ultrices est in lacus venenatis, posuere suscipit arcu scelerisque. In aliquam ipsum rhoncus, lobortis ligula ut, molestie orci. Proin scelerisque tempor posuere. Phasellus consequat, lorem quis hendrerit tempor, sem lectus sagittis nunc, in tristique dui arcu non arcu. Nunc aliquam nisi et sapien commodo lacinia. Quisque iaculis orci vel odio varius porta. Fusce tincidunt dolor enim, vitae sollicitudin purus suscipit eu.</p>
					<p>Aliquam accumsan at augue ac auctor. Nullam suscipit consectetur maximus. Suspendisse luctus ac est non placerat. Nam lobortis nisl nec augue vehicula, eget finibus mi sagittis. In congue lacus a arcu sollicitudin, at lacinia purus suscipit. Phasellus finibus placerat ex, sit amet finibus felis. Proin non iaculis ipsum. Morbi sed feugiat lacus. Sed eget ante accumsan, hendrerit ex in, volutpat mi. Mauris tempus id nulla at blandit. Maecenas nunc neque, cursus vitae dapibus a, sagittis in justo. <a href="javascript:void(0);">Vestibulum</a> sed felis eget ipsum aliquet tincidunt.</p>
					<p>Donec sed tristique sapien, id interdum sem. Phasellus sit amet ante leo. Phasellus arcu arcu, viverra ut lacus non, semper posuere est. Vivamus eu efficitur ante, ac feugiat eros. Cras id ex eget massa ornare maximus sit amet nec nisi. Quisque maximus vehicula ligula ac venenatis. Curabitur tortor tellus, consequat nec porttitor ut, lobortis a lorem. Donec tincidunt rutrum pretium. Mauris at enim dolor. Integer a tincidunt augue, nec condimentum lectus.</p>
					<p>In lobortis, tortor eget gravida tincidunt, odio urna euismod mauris, a scelerisque libero elit in ex. Phasellus a mattis ante, a convallis magna. Proin enim purus, pulvinar quis iaculis quis, finibus et nibh. Integer eu tellus urna. Suspendisse ornare augue eget nisl congue imperdiet. Pellentesque mauris magna, scelerisque eget eros at, vulputate semper neque. Integer tincidunt tellus a felis accumsan tincidunt. Fusce nec malesuada mi, non tristique lacus. Sed nec tellus vitae massa placerat pellentesque. Aenean purus libero, lobortis id nisl quis, convallis posuere neque. Duis enim magna, venenatis id ornare rhoncus, commodo id libero. Curabitur feugiat leo dui, vel viverra massa posuere non. Praesent at tortor et lorem efficitur dictum. Maecenas at euismod ex. Nam in semper ipsum. <a href="javascript:void(0);">Nulla facilisi.</a></p>
					<p>Mauris in libero cursus, iaculis sapien quis, semper felis. Maecenas convallis gravida libero euismod vehicula. Morbi quis lectus dui. Praesent non congue purus, at vehicula metus. Quisque vitae tempus elit. Aenean a aliquet nunc, nec blandit metus. Duis mattis odio vel erat eleifend volutpat. Cras eget augue et ligula vehicula ultrices. Ut vitae hendrerit nibh, id interdum nisl. Ut vestibulum tellus sed nulla bibendum aliquam. Maecenas quis sapien enim.</p>
				</d2l-more-less>
			`);
			await waitForHeight(elem);
			await expect(elem).to.be.accessible();
		});
	});

});

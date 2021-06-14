import '../../button/button.js';
import '../dropdown.js';
import '../dropdown-content.js';
import { html, LitElement } from 'lit-element/lit-element.js';

class BrokenAutoClose extends LitElement {

	render() {
		return html`
			<d2l-dropdown>
				<d2l-button class="d2l-dropdown-opener">Open it!</d2l-button>
				<d2l-dropdown-content max-width="400">
					<div slot="header">
						<h3>Scrolling is Fun</h3>
					</div>
					<a href="https://youtu.be/9ze87zQFSak">Google</a>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
						nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.Vestibulum vel sem non orci pretium fringilla sed eget augue. Vestibulum malesuada tortor
						vitae odio elementum eleifend. Quisque ligula quam, ornare id malesuada ut, malesuada eleifend sem. Nulla porta
						in arcu quis gravida. Duis ac sagittis felis, in condimentum libero. In dolor risus, semper vel iaculis vitae,
						pellentesque efficitur lorem. Nunc a lacus malesuada, rhoncus risus aliquam, sodales nulla. Sed in varius elit.
						Duis sagittis, turpis ut vehicula elementum, velit mi tincidunt turpis, sit amet sagittis quam urna ut justo.
						Nunc interdum urna augue, ac pretium dui pulvinar eu. Proin vehicula placerat est, sed venenatis purus viverra
						eget. Suspendisse imperdiet nulla eget velit sodales, sit amet tempus metus dignissim. Sed ac luctus leo, a
						ornare nisl. Proin non sapien eu orci gravida aliquam. Praesent placerat auctor lacus sit amet faucibus.
						Suspendisse sit amet dui sed turpis vestibulum dignissim.</p>
					<div slot="footer">
						<a href="http://www.desire2learn.com">D2L</a>
					</div>
				</d2l-dropdown-content>
			</d2l-dropdown>
			<d2l-button>See!</d2l-button>
			<d2l-button>It's</d2l-button>
			<d2l-button>Not</d2l-button>
			<d2l-button>Closing!</d2l-button>
		`;
	}

}

customElements.define('broken-auto-close', BrokenAutoClose);

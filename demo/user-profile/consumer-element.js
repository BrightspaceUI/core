import { css, html, LitElement } from 'lit-element/lit-element.js';
import { styleMap} from 'lit-html/directives/style-map.js';
import { UserProfileMixin } from '../../components/user-profile/user-profile-mixin.js';

export class D2LConsumer extends UserProfileMixin(LitElement) {

	static get properties() {
		return {
			type: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				height: 60px;
				width: 100px;
			}`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'type') {
				this.fetchUser();
			}
		});
	}

	render() {
		const colorStyles = {
			backgroundColor: `${this._backgroundColor}`
		};
		const urlStyles = {
			background: `url(${this._backgroundUrl})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center'
		};
		const styles = this._backgroundColor ? colorStyles : urlStyles;
		return html`
			<div style=${styleMap(styles)}>
				${this._name}
			</div>
		`;
	}

	fetchUser() {
		const url = `./data/${this.type}/user.json`;
		this.generateUserRequest(url, 'foo', { background: true });
	}

}

customElements.define('consumer-element', D2LConsumer);

import '../../../components/colors/colors.js';
import '../../../components/icons/icon.js';
import { bodySmallStyles, heading2Styles, heading3Styles, heading4Styles, labelStyles } from '../../../components/typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

class ProfileImageBase extends LitElement {
	static get properties() {
		return {
			/**
			 * Value that gets used to select a color for the profile image
			 * @type {number}
			 */
			colorId: { type: Number, attribute: 'color-id' },
			/**
			 * First name of the user (used to display initials on the profile image)
			 * @type {string}
			 */
			firstName: { type: String, attribute: 'first-name' },
			/**
			 * Last name of the user (used to display initials on the profile image)
			 * @type {string}
			 */
			lastName: { type: String, attribute: 'last-name' },
			/**
			 * href of a profile image
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * token used to authenticate the image retrieval
			 * @type {string}
			 */
			token: { type: String },
			/**
			* The size of the profile picture. If not set, the component will not be visible.
			* @type {'x-small'|'small'|'medium'|'large'|'x-large'}
			*/
			size: { type: String, reflect: true },
			/**
			* If the profile image is loading or not
			* @type {boolean}
			*/
			loading: { type: Boolean, reflect: true },
			_backgroundColors: { attribute: false, type: Array },
			_imageLoading: { attribute: false, type: Boolean },
			_imageUrl: { attribute: false, type: String },
			_failedToLoadImage: { attribute: false, type: Boolean },
		};
	}

	static get styles() {
		return [
			bodySmallStyles,
			heading2Styles,
			heading3Styles,
			heading4Styles,
			labelStyles,
			css`
				:host {
					--d2l-icon-height: 100%;
					--d2l-icon-width: 100%;
					display: inline-block;
				}

				:host([loading]) {
					opacity: 0.5;
				}

				:host(:not([size="x-small"]):not([size="small"]):not([size="medium"]):not([size="large"]):not([size="x-large"])) {
					display: none;
				}

				:host([size="x-small"]) .round-corners,
				:host([size="small"]) .round-corners {
					border-radius: 4px;
				}
				:host([size="medium"]) .round-corners {
					border-radius: 6px;
				}
				:host([size="large"]) .round-corners,
				:host([size="x-large"]) .round-corners {
					border-radius: 8px;
				}

				:host([size="x-small"]) {
					height: 1.2rem;
					margin: 0;
					min-width: 1.2rem;
					width: 1.2rem;
				}

				:host([size="small"]) {
					height: 1.5rem;
					margin: 0;
					min-width: 1.5rem;
					width: 1.5rem;
				}

				:host([size="medium"]) {
					height: calc(2rem + 2px);
					margin: 0;
					min-width: calc(2rem + 2px);
					width: calc(2rem + 2px);
				}

				:host([size="large"]) {
					height: 3rem;
					margin: 0;
					min-width: 3rem;
					width: 3rem;
				}

				:host([size="x-large"]) {
					height: 4.2rem;
					margin: 0;
					min-width: 4.2rem;
					width: 4.2rem;
				}

				.d2l-profile-image-container {
					height: 100%;
					width: 100%;
				}

				.d2l-profile-image-container.shady-person {
					--d2l-icon-fill-color: var(--d2l-color-ferrite);
				}

				.d2l-profile-image-container.initials {
					align-items: center;
					background-color: var(--d2l-initials-background-color);
					color: #ffffff;
					display: flex;
					justify-content: center;
					margin: 0;
					text-align: center;
				}
		`];
	}

	constructor() {
		super();
		this.colorId = -1;
		this._failedToLoadImage = false;
		this._imageLoading = true;

		// WARNING
		// Changing the order, as well as adding or removing a colour
		// May result in background colours to change for a given colourId
		// Only update if you have the correct approval
		this._backgroundColors = [
			'#8B271F',
			'#CF3A2F',
			'#C74F05',
			'#527F1F',
			'#346633',
			'#165F5B',
			'#1F826B',
			'#0C7683',
			'#3155BF',
			'#4476C1',
			'#383773',
			'#6F6BB8',
			'#50305F',
			'#9860AF',
			'#804167',
			'#AB578A',
			'#8C2855',
			'#D13B7F',
			'#47565E',
			'#5F727D',
			'#3B4148',
			'#59616C'
		];
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this._imageUrl && this.href) {
			this._resetImageState();
		}
		this._handleColorId();
	}

	render() {
		if (this._imageLoading && this.href) {
			return nothing;
		} else if (this.href && !this._failedToLoadImage) {
			return this._renderAvatar();
		} else if (typeof this.colorId !== 'undefined' && this.colorId !== null && this.colorId > 0 && this.firstName) {
			return this._renderInitials();
		} else {
			return this._renderShadyPerson();
		}
	}

	updated(changedProperties) {
		if (changedProperties.has('href')) {
			this._resetImageState();
		}

		if (changedProperties.has('colorId')) {
			this._handleColorId();
		}
	}

	_getFullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	_getInitialedBackgroundColor(colorId) {
		return this._backgroundColors[colorId % this._backgroundColors.length];
	}

	_getInitials(firstName, lastName) {
		if (firstName && lastName) {
			return firstName[0].toUpperCase() + lastName[0].toUpperCase();
		} else if (firstName) {
			return firstName[0].toUpperCase();
		}
		return '';
	}

	_handleColorId() {
		const backgroundColor = this._getInitialedBackgroundColor(this.colorId);
		if (backgroundColor) {
			this.style.setProperty('--d2l-initials-background-color', backgroundColor);
		}
	}

	_onImageLoadError() {
		this._failedToLoadImage = true;
	}

	_renderAvatar() {
		return html`
			<img
				class="d2l-profile-image-container avatar round-corners"
				draggable="false"
				src="${this._imageUrl}"
				@error="${this._onImageLoadError}"
				alt="${this._getFullName()} avatar"
			>
		`;
	}

	_renderInitials() {
		const classes = {
			'd2l-profile-image-container': true,
			'initials': true,
			'round-corners': true,
			'd2l-heading-2': this.size === 'x-large',
			'd2l-heading-3': this.size === 'large',
			'd2l-heading-4': this.size === 'medium',
			'd2l-label-text': this.size === 'small',
			'd2l-body-small': this.size === 'x-small'
		};
		return html`
			<div class="${classMap(classes)}">
				${this._getInitials(this.firstName, this.lastName)}
			</div>
		`;
	}

	_renderShadyPerson() {
		return html`
			<div class="d2l-profile-image-container shady-person round-corners">
				<d2l-icon icon="tier3:profile-pic"></d2l-icon>
			</div>
		`;
	}

	async _resetImageState() {
		if (!this.href) {
			return;
		}

		this._imageLoading = true;
		this._failedToLoadImage = false;

		try {
			const tokenPromise = await (typeof (this.token) === 'function')
				? this.token()
				: Promise.resolve(this.token);

			const tokenString = await tokenPromise;

			const headers = new Headers();
			if (tokenString) {
				headers.append('Authorization', `Bearer ${tokenString}`);
			}

			const response = await window.d2lfetch
				.removeTemp('simple-cache')
				.removeTemp('dedupe')
				.fetch(this.href, { method: 'GET', headers });

			const blob = await response.blob();
			this._imageUrl = URL.createObjectURL(blob);
		} catch {
			this._imageUrl = this.href;
		}

		this._imageLoading = false;
	}
}

customElements.define('d2l-profile-image-base', ProfileImageBase);

import 'd2l-fetch/d2l-fetch.js';
import { Classes, Rels } from 'd2l-hypermedia-constants';
import { getBestImageLinks } from '../helpers-hm/organization.js';
import SirenParse from 'siren-parser';

export const UserProfileMixin = superclass => class extends superclass {

	static get properties() {
		return {
			token: { type: String },
			userUrl: { type: String },
			options: { type: Object },
			_backgroundColor: { type: String },
			_backgroundUrl: { type: String },
			_name: { type: String }
		};
	}

	connectedCallback() {
		super.connectedCallback();
	}

	constructor() {
		super();

		this.options = {};
		this._backgroundColor = '';
		this._backgroundUrl = '';
		this._name = '';

		this._doneRequests = false;
		this._rootUrl = '';
		this._enrollmentsUrl = '';
		this._folioUrl = '';
		this._iconUrl = '';
		this._previousUserCall = null;
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === '_backgroundColor' || propName === '_backgroundUrl' || propName === '_name') {
				this._checkDoneRequests();
			}
		});
	}

	generateUserRequest(userUrl, token, options) {
		this._previousUserCall = this._previousUserCall || {};
		this._doneRequests = false;

		if (
			userUrl &&
			token &&
			userUrl !== this._previousUserCall.userUrl &&
			token !== this._previousUserCall.token
		) {
			this._rootUrl = '';
			this._enrollmentsUrl = '';
			this._folioUrl = '';
			this._iconUrl = '';
			this._backgroundColor = '';
			this._backgroundUrl = '';
			this._name = '';
			this.userUrl = userUrl || this.userUrl;
			this.token = token || this.token;
			this.options = options || this.options;
			this._previousUserCall = { userUrl: this.userUrl, token: this.token };

			return this._fetchUser()
				.then(this._fetchFolio.bind(this))
				.catch(() => {
					// Folio image fetch failed, falling back to organization image
					return this._fetchEnrollments()
						.then(this._fetchOrganization.bind(this))
						.then(this._fetchOrganizationImage.bind(this))
						.catch(() => {
							// Organization image fetch failed, falling back to theme colour
							return this._fetchRoot()
								.then(this._fetchInstitution.bind(this))
								.then(this._fetchTheme.bind(this))
								.catch(() => {
									// If all else fails!
									this._backgroundColor = 'initial';
								});
						});
				});
		}

		return Promise.resolve();
	}

	_checkDoneRequests() {
		const backgroundExists = !!(this._backgroundUrl || this._backgroundColor);
		const backgroundNeeded = (this.options || {}).background;
		const doneRequests = (!backgroundNeeded || backgroundExists) && !!this._name;

		if (doneRequests) {
			if (this._backgroundUrl) {
				// preload the image a bit so after the fade-in it's hopefully loaded
				const self = this;
				const setLoaded = () => {
					self._doneRequests = true;
				};
				const imagePreloader = document.createElement('img');
				imagePreloader.addEventListener('load', setLoaded);
				imagePreloader.addEventListener('error', setLoaded);
				imagePreloader.setAttribute('src', self._backgroundUrl);
			}

			this._doneRequests = true;
		}
	}

	_fetchSirenEntity(url) {
		const request = new Request(url, {
			headers: new Headers({
				accept: 'application/vnd.siren+json',
				authorization: `Bearer ${this.token}`
			})
		});

		return window.d2lfetch
			.fetch(request)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(new Error(response.status));
			})
			.then(SirenParse);
	}

	_fetchUser() {
		return this._fetchSirenEntity(this.userUrl).then((userEntity) => {
			this._rootUrl = (userEntity.getLinkByRel(Rels.root) || {}).href;
			this._enrollmentsUrl = (userEntity.getLinkByRel(Rels.myEnrollments) || {}).href;
			this._folioUrl = (userEntity.getLinkByRel(Rels.Folio.folio) || {}).href;

			const displayNameEntity = userEntity.getSubEntityByRel(Rels.displayName);
			if (displayNameEntity) {
				this._name = displayNameEntity.properties && displayNameEntity.properties.name;
			}

			const profileEntity = userEntity.getSubEntityByRel(Rels.userProfile);
			if (profileEntity) {
				const image = profileEntity.getSubEntityByRel(Rels.profileImage);

				if (image.class && image.class.indexOf('default-image') !== -1) {
					this._iconUrl = null;
				} else {
					this._iconUrl = (image.getLinkByRel(Rels.thumbnailRegular) || {}).href;
				}
			}
		});
	}

	_fetchFolio() {
		if (!this.options.background) {
			return Promise.resolve();
		}

		if (!this._folioUrl) {
			return Promise.reject(new Error('Folio URL not set'));
		}

		return this._fetchSirenEntity(this._folioUrl).then((folioEntity) => {
			const tiles = (folioEntity.getSubEntitiesByRel(Rels.Folio.evidence));
			for (let i = 0; i < tiles.length; i++) {
				const content = tiles[i].getSubEntityByRel(Rels.Folio.contentItem);
				const type = content.properties.type;
				switch (type) {
					case 'Png':
					case 'Jpg':
					case 'Gif':
						this._backgroundUrl = content.properties.url;
						return;
				}
			}
			return Promise.reject(new Error('Did not find adequate Folio evidence'));
		});
	}

	_fetchEnrollments() {
		if (!this._enrollmentsUrl) {
			return Promise.reject(new Error('Enrollments URL not set'));
		}

		this._enrollmentsUrl += '?pageSize=2&orgUnitTypeId=3&embedDepth=1';
		return this._fetchSirenEntity(this._enrollmentsUrl).then((enrollmentsEntity) => {
			const enrollmentEntities = enrollmentsEntity.getSubEntitiesByRel(Rels.userEnrollment);

			if (enrollmentEntities.length === 1) {
				const organizationUrl = enrollmentEntities[0].getLinkByRel(Rels.organization).href;
				return Promise.resolve(organizationUrl);
			} else {
				return Promise.reject(new Error(`User does not have exactly one enrollment: ${enrollmentEntities.length}`));
			}
		});
	}

	_fetchOrganization(organizationUrl) {
		return this._fetchSirenEntity(organizationUrl).then((organizationEntity) => {
			const imageLink = organizationEntity.getSubEntityByClass(Classes.courseImage.courseImage);

			if (!imageLink) {
				return Promise.reject(new Error('Organization image link not found'));
			}

			const organizationImageUrl = imageLink.href;
			return Promise.resolve(organizationImageUrl);
		});
	}

	_fetchOrganizationImage(organizationImageUrl) {
		return this._fetchSirenEntity(organizationImageUrl).then((organizationImageEntity) => {
			const backgroundImages = getBestImageLinks(organizationImageEntity, Classes.courseImage.wide);
			this._backgroundUrl = backgroundImages.highMin || backgroundImages.lowMax;
		});
	}

	_fetchRoot() {
		if (!this._rootUrl) {
			return Promise.reject(new Error('Root URL not set'));
		}

		return this._fetchSirenEntity(this._rootUrl).then((rootEntity) => {
			const institutionUrl = (rootEntity.getLinkByRel(Rels.organization) || {}).href;
			return Promise.resolve(institutionUrl);
		});
	}

	_fetchInstitution(institutionUrl) {
		return this._fetchSirenEntity(institutionUrl).then((institutionEntity) => {
			const themeUrl = (institutionEntity.getLinkByRel(Rels.Themes.theme) || {}).href;
			return Promise.resolve(themeUrl);
		});
	}

	_fetchTheme(themeUrl) {
		return this._fetchSirenEntity(themeUrl).then((themeEntity) => {
			if (themeEntity.properties) {
				this._backgroundColor = themeEntity.properties.BackgroundColor;
			} else {
				return Promise.reject(new Error('Theme colour not available'));
			}
		});
	}
};

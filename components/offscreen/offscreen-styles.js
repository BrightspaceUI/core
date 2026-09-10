import { css } from 'lit';

const HAS_DOCUMENT = globalThis.document !== undefined;

/**
 * A private helper declarations that should not be used by general consumers
 */
export const _offscreenStyleDeclarations = css`
	direction: var(--d2l-document-direction, ${ !HAS_DOCUMENT ? css`unset` : (document.dir === 'rtl' ? css`rtl` : css`ltr`)}); /* stylelint-disable-line @stylistic/string-quotes */
	height: 0;
	inset-inline-start: -10000px;
	overflow: hidden;
	position: absolute !important;
	white-space: nowrap;
	width: 0;
`;

export const offscreenStyles = css`
	.d2l-offscreen {
		${_offscreenStyleDeclarations}
	}
`;

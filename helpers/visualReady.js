[...document.fonts].forEach(font => font.load());

export const visualReady = Promise.all([document.fonts.ready]);

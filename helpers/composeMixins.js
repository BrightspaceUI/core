export const composeMixins = (base, ...mixins) =>
	mixins.reduce((subclass, superclass) => superclass(subclass), base);

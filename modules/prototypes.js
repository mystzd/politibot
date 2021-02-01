Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

String.prototype.title = function() {
	let up = this[0].toUpperCase();
	return up + this.slice(1);
};

String.prototype.toProperCase = function() {
	return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

Array.prototype.last = function() {
	return this[this.length - 1];
};

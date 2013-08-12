var path = require('path'),
	folio = require('folio'),
	jade = require('jade');

/*
 * GET home page.
 */
exports.index = function(req, res) {
	res.render('index', { title: 'bPi Automated Home Brewery'});
};

/*
 * Vendor Javascript Package
 *
 * backbone
 * underscore
 * backbone.iosync
 * backbone.iobind
 *
 */
var vendorJs = new folio.Glossary([
	require.resolve('underscore/underscore.js'),
	require.resolve('backbone/backbone.js'),
	path.join(__dirname, '..', 'public', 'js', 'backbone.iobind.js'),
	path.join(__dirname, '..', 'public', 'js', 'backbone.iosync.js'),
	path.join(__dirname, '..', 'public', 'js', 'backbone.marionette', 'backbone.marionette.min.js'),
	path.join(__dirname, '..', 'public', 'js', 'backbone.marionette', 'backbone.babysitter.js'),
	path.join(__dirname, '..', 'public', 'js', 'backbone.marionette', 'backbone.wreqr.js'),	
	path.join(__dirname, '..', 'public', 'js', 'backbone.marionette', 'json2.js'),	
	path.join(__dirname, '..', 'public', 'js', 'bootstrap.min.js'),
	path.join(__dirname, '..', 'public', 'js', 'tween-min.js'),
	path.join(__dirname, '..', 'public', 'js', 'steelseries-min.js'),
	path.join(__dirname, '..', 'public', 'js', 'messenger.min.js'),
	path.join(__dirname, '..', 'public', 'js', 'bpi-base.js')
]);

exports.vendorjs = folio.serve(vendorJs);

/*
 * Template Javascript Package
 *
 * Precompiled jade templates used on the client side
 *
 */
var templateJs = new folio.Glossary([
	require.resolve('jade/runtime.js'),
	path.join(__dirname, '..', 'views/templates/js/header.js'),
	// Home Screen Templates
	path.join(__dirname, '..', 'views/templates/home.jade'),	
	path.join(__dirname, '..', 'views/templates/homestatus.jade'),
	path.join(__dirname, '..', 'views/templates/homevessel.jade'),
	// Manual Screen Templates
	path.join(__dirname, '..', 'views/templates/manual.jade'),
	// Process Screen Templates
	path.join(__dirname, '..', 'views/templates/process.jade'),
	// Config Screen Templates
	path.join(__dirname, '..', 'views/templates/config.jade')
], {
	compilers: {
		jade: function (name, source) {
			return 'template[\'' + name + '\'] = ' +
				jade.compile(source, {
					client: true,
					compileDebug: false
				}) + ';';
		}
	}
});

exports.templatejs = folio.serve(templateJs);
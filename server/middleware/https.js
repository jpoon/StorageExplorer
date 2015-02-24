module.exports = function(req, res, next) {
	console.log(req.secure);
    if (!req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
    }

    next();
}
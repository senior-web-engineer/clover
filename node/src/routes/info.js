const pkg = require('../../package.json');

module.exports = (req, res, next) => {
    res.status(200).json({
        version: pkg.version,
        build: 1,
    });
};

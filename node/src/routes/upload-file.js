const File = require('../models/File');
const mkdirp = require('mkdirp');
const fs = require('fs');
const store = require('../store');
const randomstring = require("randomstring");

module.exports = (req, res, next) => {
    const file = req.files.file;
    const path = file.path;

    if (!file) {
        return res.status(500).json({status: 500, error: 'FILE_REQUIRED'});
    }

    const shield = randomstring.generate({ length: 120, charset: 'alphanumeric', capitalization: 'lowercase'});

    File({
        name: file.name,
        author: req.user.id,
        size: file.size,
        file: file.type,
        shield
    }).save().then(file => {
        const folder = `${store.config.dataFolder}/${req.user.id}`;

        mkdirp(folder, async err => {
            if (err) return res.status(500).json({status: 500, error: 'WRITE_ERROR'});

            const shieldedID = shield + file._id;

            const location = `${folder}/${shieldedID}.jpg`;

            const stream = fs.createWriteStream(location);
            const reader = fs.createReadStream(path);
            reader.pipe(stream);

            File.findOneAndUpdate({_id: file._id}, {location, shieldedID}, {new: true})
                .then(file => {
                    res.status(200).json({status: 200, file});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({status: 500, error: 'DATABASE_ERROR'});
                });
        });
    });
};

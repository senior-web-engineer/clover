const Image = require('../models/Image');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const store = require('../store');
const randomstring = require("randomstring");

module.exports = (req, res, next) => {
    const image = req.files.image;
    const { crop } = req.fields;
    const path = image.path;

    if (!image) {
        return res.status(500).json({status: 500, error: 'FILE_REQUIRED'});
    }

    const shield = randomstring.generate({ length: 120, charset: 'alphanumeric', capitalization: 'lowercase'});

    Image({
        name: image.name,
        author: req.user.id,
        size: image.size,
        shield
    }).save().then(image => {
        const folder = `${store.config.dataFolder}/${req.user.id}`;

        mkdirp(folder, async err => {
            if (err) return res.status(500).json({status: 500, error: 'WRITE_ERROR'});

            const shieldedID = shield + image._id;

            const location = `${folder}/${shieldedID}.jpg`;

            await sharp(path)
                .rotate()
                .toFile(location);

            for (let i = 0; i < store.config.sizes.length; i++) {
                const location = `${folder}/${shieldedID}-${store.config.sizes[i]}.jpg`;

                let size = {};

                if (crop === 'square') size = {width: store.config.sizes[i], height: store.config.sizes[i]};
                else size = {width: store.config.sizes[i]};

                await sharp(path)
                    .rotate()
                    .resize(size)
                    .toFile(location);
            }

            Image.findOneAndUpdate({_id: image._id}, {location, shieldedID}, {new: true})
                .then(image => {
                    res.status(200).json({status: 200, image});
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({status: 500, error: 'DATABASE_ERROR'});
                });
        });
    });
};

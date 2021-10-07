const Message = require('../models/Message');

module.exports = (req, res, next) => {
    let { roomID, firstMessageID } = req.fields;

    Message.find({room: roomID, _id: {$lt: firstMessageID}}).sort({_id: -1}).limit(20).populate({
        path: 'author',
        select: '-email -password -friends -__v',
        populate: {
            path: 'picture',
        },
    }).then(messages => {
        messages.reverse();
        res.status(200).json({messages});
    });
};

const router = require('express').Router();
const passport = require('passport');
const jwt = require('express-jwt');
const Config = {...require('../defaults'), ...require('../../config')};

router.get('/images/:id', require('./images'));
router.get('/files/:id', require('./files'));
router.get('/images/:id/:size', require('./images'));
router.post('/login', require('./login'));
router.post('/typing', passport.authenticate('jwt', {session: false}, null), require('./typing'));
router.post('/check-user', require('./checkUser'));
router.post('/upload', passport.authenticate('jwt', {session: false}, null), require('./upload'));
router.post('/upload/file', passport.authenticate('jwt', {session: false}, null), require('./upload-file'));
router.post('/register', require('./register'));
router.post('/user/delete', jwt({secret: Config.secret}), require('./user-delete'));
router.post('/user/edit', jwt({secret: Config.secret}), require('./user-edit'));
router.post('/user/list', jwt({secret: Config.secret}), require('./user-list'));
router.post('/picture/change', jwt({secret: Config.secret}), require('./change-picture'));
router.post('/picture/remove', jwt({secret: Config.secret}), require('./change-picture'));

router.post('/favorite/toggle', jwt({secret: Config.secret}), require('./toggle-favorite'));
router.post('/favorites/list', jwt({secret: Config.secret}), require('./list-favorites'));
router.post('/rooms/list', jwt({secret: Config.secret}), require('./list-rooms'));
router.post('/room/get', jwt({secret: Config.secret}), require('./get-room'));
router.post('/room/create', jwt({secret: Config.secret}), require('./create-room'));
router.post('/room/join', jwt({secret: Config.secret}), require('./join-room'));
router.post('/room/remove', jwt({secret: Config.secret}), require('./remove-room'));
router.post('/search', jwt({secret: Config.secret}), require('./search'));
router.post('/message', jwt({secret: Config.secret}), require('./message'));
router.post('/messages/more', jwt({secret: Config.secret}), require('./more-messages'));
router.post('/group/create', jwt({secret: Config.secret}), require('./create-group'));

router.post('/rtc/create', jwt({secret: Config.secret}), require('./rtc/create'));
router.post('/rtc/join', jwt({secret: Config.secret}), require('./rtc/join'));
router.post('/rtc/peers', require('./rtc/peers'));

router.post('/meeting/get', require('./meeting/get'));
router.post('/meeting/call', jwt({secret: Config.secret}), require('./meeting/call'));
router.post('/meeting/add', jwt({secret: Config.secret}), require('./meeting/add'));
router.post('/meeting/answer', jwt({secret: Config.secret}), require('./meeting/answer'));
router.post('/meeting/close', jwt({secret: Config.secret}), require('./meeting/close'));
router.post('/meeting/list', jwt({secret: Config.secret}), require('./meeting/list'));
router.use('/info', require('./info'));

module.exports = router;

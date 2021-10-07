module.exports = {
    port: 4000,
    secret: 'jwt-default-secret',
    db: 'mongodb://localhost:27017/clover',
    dataFolder: './data',
    admin: {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        firstName: 'Admin',
        lastName: 'User',
    },
};

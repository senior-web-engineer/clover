module.exports = {
    port: 80,
    retryAfter: 10000,
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
    sizes: [256, 512, 1024, 2048],
    mediasoup: {
        // Mediasoup worker settings
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 65535,
            logLevel: 'warn',
            logTags: [
                'info',
                'ice',
                'dtls',
                'rtp',
                'srtp',
                'rtcp',
                // 'rtx',
                // 'bwe',
                // 'score',
                // 'simulcast',
                // 'svc'
            ],
        },
        // Mediasoup router settings
        router: {
            mediaCodecs:
                [
                    {
                        kind: 'audio',
                        mimeType: 'audio/opus',
                        clockRate: 48000,
                        channels: 2
                    },
                    {
                        kind: 'video',
                        mimeType: 'video/VP8',
                        clockRate: 90000,
                        parameters:
                            {
                                'x-google-start-bitrate': 1000
                            }
                    },
                ]
        },
        // Mediasoup WebRtcTransport settings
        webRtcTransport: {
            listenIps: [
                {
                    ip: '51.178.80.15',
                    announcedIp: null,
                }
            ],
            maxIncomingBitrate: 1500000,
            initialAvailableOutgoingBitrate: 1000000,
        },
    },
};

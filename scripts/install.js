require('colors');
const prompts = require('prompts');
const pkg = require('./package.json');
const { isFQDN, isEmail, isIP } = require('validator');
const isEmpty = require('./utils/isEmpty');
const randomstring = require('randomstring');
const exec = require('child_process').execSync;

(async () => {
    console.log("");
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("♥♥♥".green + " ♥♥♥".white + " ♥♥♥".red);
    console.log("");
    console.log("Honeyside".yellow);
    console.log(`Clover v${pkg.version} Installer`.yellow);
    console.log("");

    let domain, email, ip, username, password, firstName, lastName, secret;

    console.log('Clover requires a domain, such as clover.example.com.');
    console.log('Make sure your DNS configuration properly propagated before moving forward.');
    console.log('You can use https://dnschecker.org/');

    let response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Your Domain',
        validate: (e) => isFQDN(e) || `Must be a valid domain`,
    });

    domain = response.value;

    console.log('Your email will be used to generate a Let\'s Encrypt SSL certificate for the domain.');
    console.log('It will also be the email related to the admin user account.');

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Your Email',
        validate: (e) => isEmail(e) || `Must be a valid email`,
    });

    email = response.value;

    console.log('A public ip address for your server is required in order to properly run meetings.');

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Your IP Address',
        validate: (e) => isIP(e) || `Must be a valid ip`,
    });

    ip = response.value;

    console.log('You will need an admin user account in order to manage other users.');
    console.log('You can now enter username, password, first name and last name for such account.');
    console.log('If you leave them blank, defaults in square parenthesis [] will be used.');

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Username [admin]',
    });

    username = response.value;

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Password [admin]',
    });

    password = response.value;

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'First name [Admin]',
    });

    firstName = response.value;

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Last name [User]',
    });

    lastName = response.value;

    console.log('We need a secret string to encrypt user tokens.');
    console.log('You can input your own (random) set of characters or you can leave blank to generate a random secret.');

    response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Secret [secret]',
    });

    secret = response.value;

    if (isEmpty(username)) username = 'admin';
    if (isEmpty(password)) password = 'admin';
    if (isEmpty(firstName)) firstName = 'Admin';
    if (isEmpty(lastName)) lastName = 'User';
    if (isEmpty(secret)) secret = randomstring.generate({ length: 32, charset: 'alphabetic' });

    console.log('');
    console.log('Configuration complete!'.green);
    console.log('Will now begin installation'.yellow);
    console.log('');

    response = exec('grep \'^NAME\' /etc/os-release');

    const os = response.toString();

    response = exec('lsb_release -r');

    const version = response.toString();

    if (!os.includes('Ubuntu')) {
        console.log('Current OS is not Ubuntu. Aborting.'.red);
        console.log('If you are running this on Ubuntu, please contact Honeyside Support.');
        return process.exit(0);
    }

    if (!version.includes('20.04') && !version.includes('18.04')) {
        console.log('This is not a supported Ubuntu version.'.red);
        console.log('The only supported versions are 20.04 LTS and 18.04 LTS');
        console.log('If you are running this on a correct version, please contact Honeyside Support.');
        return process.exit(0);
    }

    console.log('Installing MongoDB...'.yellow);

    console.log('installing gnupg...');
    exec('sudo apt-get install gnupg -y');
    console.log('adding apt-key for MongoDB...')
    exec('wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -');

    console.log('adding repository for MongoDB...');
    if (version.includes('20.04')) {
        exec('echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list');
    } else {
        exec('echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list');
    }

    console.log('apt-get update...');
    exec('sudo apt-get update')
    console.log('apt-get install...');
    exec('sudo apt-get install -y mongodb-org')

    console.log('Starting MongoDB...'.yellow);

    console.log('daemon-reload...');
    exec('sudo systemctl daemon-reload');
    console.log('start mongod...');
    exec('sudo systemctl start mongod');
    console.log('enable mongod...');
    exec('sudo systemctl enable mongod');

    console.log('MongoDB ok'.green);

    console.log('');

    console.log('Installing Acacia (reverse proxy)...'.yellow);
    console.log('installing git...');
    exec('sudo apt install git -y');
    console.log('cloning acacia...');
    try {
        exec('cd .. && sudo git clone https://github.com/Honeyside/Acacia.git acacia', {stdio : 'pipe'});
    } catch (e) {
        try {
            exec('cd ../acacia && sudo git pull');
        } catch (e) {}
    }
    console.log('installing dependencies for acacia...');
    console.log('this might take a while');
    exec('cd ../acacia && yarn');
    console.log('configuring acacia...');
    exec('sudo rm -f ../acacia/config.js');
    exec(`echo "module.exports = {aliases: {\\"www.${domain}\\": \\"${domain}\\"}, certs: {default: {type: \\"path\\", cert: \\"certs/127.0.0.1.cert\\", key: \\"certs/127.0.0.1.key\\"}, \\"${domain}\\": {type: \\"letsencrypt\\", email: \\"${email}\\"}}, standard: [80], ssl: [443], servers: {\\"80\\": {\\"${domain}\\": [{forceSSL: true}]}, \\"443\\": {\\"${domain}\\": [{proxy: \\"http://localhost:4000\\", changeOrigin: true, secure: false, ws: true}]}}};" >> ../acacia/config.js`);
    console.log('starting pm2 process...');
    try {
        exec('pm2 delete Acacia', {stdio : 'pipe'});
    } catch (e) {}
    exec('cd ../acacia && pm2 start index.js --name "Acacia"');
    console.log('Acacia ok'.green);

    console.log('');

    console.log('Configuring iptables...'.yellow);
    exec('iptables -F');
    exec('iptables -X');
    exec('iptables -t nat -F');
    exec('iptables -t nat -X');
    exec('iptables -t mangle -F');
    exec('iptables -t mangle -X');
    exec('iptables -P INPUT ACCEPT');
    exec('iptables -P FORWARD ACCEPT');
    exec('iptables -P OUTPUT ACCEPT');
    exec('iptables -I INPUT -j ACCEPT');
    exec('sudo /sbin/iptables-save');
    console.log('iptables ok'.green);

    console.log('');

    console.log('Installing Clover backend...'.yellow);
    console.log('update backend configuration...');
    exec('sudo rm -f ../node/config.js');
    exec(`echo "module.exports = {port: 4000, ip: \\"${ip}\\", secret: \\"${secret}\\", admin: {username: \\"${username}\\",email: \\"${email}\\",password: \\"${password}\\",firstName: \\"${firstName}\\",lastName: \\"${lastName}\\"}};" >> "../node/config.js"`);
    console.log('installing backend node modules...');
    console.log('this might take a while, depending on your machine cpu and ram');
    console.log('it could take between 30 seconds and 30 minutes');
    exec('cd ../node && yarn');
    console.log('starting backend...');
    try {
        exec('pm2 delete Clover', {stdio : 'pipe'});
    } catch (e) {}
    exec('cd ../node && pm2 start index.js --name "Clover"');
    console.log('Clover backend ok'.green);

    console.log('');

    console.log('Installing Clover frontend...'.yellow);
    console.log('update frontend configuration...');
    exec('sudo rm -f ../react/src/config.js');
    exec(`echo "export default {demo: false};" >> "../react/src/config.js"`);
    console.log('installing frontend node modules...');
    console.log('this might take a while');
    exec('cd ../react && yarn');
    console.log('building frontend...');
    console.log('installing frontend node modules...');

    response = exec('echo $(($(getconf _PHYS_PAGES) * $(getconf PAGE_SIZE) / (1024 * 1024)))');
    const ramSize = parseInt(response.toString());
    if (ramSize < 1025) {
        console.log('This machine RAM is less than the recommended requirement of 2GB'.red);
        console.log('You can still use Clover, but you will have to build the frontend on your computer and upload it via SFTP. Or, increase your RAM size to 2GB and run the installer again.');
        console.log('Instructions to build the frontend on your computer: install Node.js 14, install Yarn, cd into the react folder, run "yarn" and wait for it to complete. Then, run "yarn build". Upload the build folder to this server.')
        return process.exit(0);
    }

    console.log('this might take a while');
    exec('cd ../react && yarn build');
    console.log('Clover frontend ok'.green);

    console.log("");
    console.log(`Clover v${pkg.version} installation complete!`.green);
    console.log(`You should now be able to access Clover at https://${domain}`);
    console.log("");

})();

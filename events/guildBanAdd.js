const { Event } = require('../index');
const ModLog = require('../utils/createModlog.js');

module.exports = class extends Event {

    async run(guild, user) {
        if (this.client.ready !== true || guild.available !== true) return null;
        let settings = guild.settings;
        if (settings instanceof Promise) settings = await settings;

        if (guild.settings.events.banAdd !== true) return null;
        return new ModLog(guild)
            .setAnonymous(true)
            .setUser(user)
            .setType('ban')
            .send()
            .catch(err => this.client.emit('log', err, 'error'));
    }

};

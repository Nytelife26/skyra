const { Command } = require('../../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			cooldown: 10,
			description: (msg) => msg.language.get('COMMAND_SETMEMBERLOGS_DESCRIPTION'),
			extendedHelp: (msg) => msg.language.get('COMMAND_SETMEMBERLOGS_EXTENDED'),
			permissionLevel: 6,
			runIn: ['text'],
			usage: '<here|channel:channel>'
		});
	}

	async run(msg, [channel]) {
		if (channel === 'here') ({ channel } = msg);
		else if (channel.type !== 'text') throw msg.language.get('CONFIGURATION_TEXTCHANNEL_REQUIRED');
		if (msg.guild.configs.channels.log === channel.id) throw msg.language.get('CONFIGURATION_EQUALS');
		await msg.guild.configs.update('channels.log', channel);
		return msg.sendLocale('COMMAND_SETMEMBERLOGS_SET', [channel]);
	}

};

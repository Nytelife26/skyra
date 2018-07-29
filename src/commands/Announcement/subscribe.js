const { Command, util: { announcementCheck } } = require('../../index');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['MANAGE_ROLES'],
			cooldown: 15,
			description: msg => msg.language.get('COMMAND_SUBSCRIBE_DESCRIPTION'),
			extendedHelp: msg => msg.language.get('COMMAND_SUBSCRIBE_EXTENDED'),
			runIn: ['text']
		});
	}

	async run(msg) {
		const role = announcementCheck(msg);
		await msg.member.roles.add(role);
		return msg.sendLocale('COMMAND_SUBSCRIBE_SUCCESS', [role.name]);
	}

};

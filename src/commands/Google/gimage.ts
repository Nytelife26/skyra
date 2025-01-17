import { LanguageKeys } from '#lib/i18n/languageKeys';
import { PaginatedMessageCommand, SkyraPaginatedMessage } from '#lib/structures';
import { CustomSearchType, GoogleCSEImageData, GoogleResponseCodes, handleNotOK, queryGoogleCustomSearchAPI } from '#utils/APIs/Google';
import { getImageUrl, sendLoadingMessage } from '#utils/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<PaginatedMessageCommand.Options>({
	aliases: ['googleimage', 'img'],
	nsfw: true, // Google will return explicit results when searching for explicit terms, even when safe-search is on
	description: LanguageKeys.Commands.Google.GimageDescription,
	detailedDescription: LanguageKeys.Commands.Google.GimageExtended
})
export class UserPaginatedMessageCommand extends PaginatedMessageCommand {
	public async messageRun(message: Message, args: PaginatedMessageCommand.Args) {
		const query = (await args.rest('string')).replace(/(who|what|when|where) ?(was|is|were|are) ?/gi, '').replace(/ /g, '+');
		const [response, { items }] = await Promise.all([
			sendLoadingMessage(message, args.t),
			queryGoogleCustomSearchAPI<CustomSearchType.Image>(message, CustomSearchType.Image, query)
		]);

		if (!items || !items.length) this.error(handleNotOK(GoogleResponseCodes.ZeroResults));

		const display = await this.buildDisplay(message, items);

		await display.run(response, message.author);
		return response;
	}

	private async buildDisplay(message: Message, items: GoogleCSEImageData[]) {
		const display = new SkyraPaginatedMessage({ template: new MessageEmbed().setColor(await this.container.db.fetchColor(message)) });

		for (const item of items) {
			display.addPageEmbed((embed) => {
				embed.setTitle(item.title).setURL(item.image.contextLink);

				const imageUrl = getImageUrl(item.link);
				if (imageUrl) {
					embed.setImage(imageUrl);
				}

				return embed;
			});
		}

		return display;
	}
}

let {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
let data = require('../../items.json');
let items = data.items;
let Fuse = require('fuse.js');
let options = {
    'keys': [
        'name'
    ],
    'includeScore': true,
    'threshold': 0.3
};
let fuse = new Fuse(items, options);
module.exports = {
    'data': new SlashCommandBuilder()
        .setName('automations')
        .setDescription('Find an automation from CPR, GPS, and MISC.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the item.')
                .setRequired(true)),
        async execute(interaction) {
            let itemName = interaction.options.getString('name');
            let items = fuse.search(itemName, {'limit': 10});
            if (!items.length) {
                await interaction.reply('No items found!');
                return;
            }
            let message = '';
            for (let i of items) {
                if (i.item.source.includes('cpr-')) {
                    message += '\nChris\'s Premades: ' + i.item.name;
                    if (i.item.version) message += ' (' + i.item.version + ')';
                } else if (i.item.source.includes('gps-')) {
                    message += '\nGambit\'s Premades: ' + i.item.name;
                } else if (i.item.source.includes('misc-')) {
                    message += '\nMidi Item Showcase: ' + i.item.name;
                } else {
                    message += '\nUnknown: ' + i.item.name;
                }
            }
            let embed = new EmbedBuilder()
                .setColor('DarkGreen')
                .setTitle('Found Items (' + itemName + '):')
                .setDescription(message)
            await interaction.reply({'embeds': [embed]});
        }
}
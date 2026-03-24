const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const FLIGHT_CHANNEL_ID = '1412849826642657370';
const SM_ROLE_ID = '1412923443422429254';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flightsetup')
    .setDescription('Create a new flight')
    .addStringOption(o => o.setName('flightnumber').setDescription('Flight number').setRequired(true))
    .addStringOption(o => o.setName('departuretime').setDescription('Departure time').setRequired(true))
    .addStringOption(o => o.setName('serveropentime').setDescription('Server open time').setRequired(true))
    .addStringOption(o => o.setName('departure').setDescription('Departure').setRequired(true))
    .addStringOption(o => o.setName('arrival').setDescription('Arrival').setRequired(true))
    .addStringOption(o => o.setName('aircraft').setDescription('Aircraft').setRequired(true))
    .addStringOption(o => o.setName('notes').setDescription('Additional notes').setRequired(false)),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(SM_ROLE_ID)) {
      return interaction.reply({
        content: 'You need Senior Management to use this.',
        ephemeral: true
      });
    }

    const flightNumber = interaction.options.getString('flightnumber');
    const departureTime = interaction.options.getString('departuretime');
    const serverOpen = interaction.options.getString('serveropentime');
    const departure = interaction.options.getString('departure');
    const arrival = interaction.options.getString('arrival');
    const aircraft = interaction.options.getString('aircraft');
    const notes = interaction.options.getString('notes') || 'None';

    const embed = new EmbedBuilder()
      .setColor('#feb300')
      .setThumbnail('https://cdn.discordapp.com/attachments/1411477449765687511/1411824243762794526/Untitled_design__29_-removebg-preview.png')
      .setDescription(
        `<:SundairLogoWhite:1411823881655681064> **New Flight**\n` +
        `A new flight has been scheduled by ${interaction.user}, you can see more information below and we hope to see you there.`
      )
      .addFields(
        { name: 'Flight Number', value: flightNumber, inline: true },
        { name: 'Departure Time', value: departureTime, inline: true },
        { name: 'Server Open Time', value: serverOpen, inline: true },
        { name: 'Departure', value: departure, inline: true },
        { name: 'Arrival', value: arrival, inline: true },
        { name: 'Aircraft', value: aircraft, inline: true },
        { name: 'Additional Notes', value: notes, inline: false }
      );

    const channel = await interaction.client.channels.fetch(FLIGHT_CHANNEL_ID);

    await channel.send({
      content: '@everyone',
      embeds: [embed]
    });

    await interaction.reply({
      content: 'Flight posted.',
      ephemeral: true
    });
  }
};

module.exports = {
  data: {
    name: "Acknowledge Dashboard Interaction",
  },

  info: {
    source: "https://github.com/botpanel/bmd/",
    creator: "The Bot Panel Team",
  },

  category: "Dashboard",

  UI: [
    {
      element: "var",
      storeAs: "interaction",
      name: "Source Interaction",
    },
    "_",
    {
      element: "dropdown",
      storeAs: "success",
      name: "Success",
      choices: [
        { name: "True" },
        { name: "False" }
      ]
    },
    "_",
    {
      element: "input",
      storeAs: "message",
      name: "Message",
    },
    "-"
  ],

  subtitle: (values, constants) => {
    return `Acknowledge interaction as ${values.success}`
  },

  async run(values, message, client, bridge) {
    let interaction = bridge.get(values.interaction)?.d;
    let success = bridge.transf(values.success) === "True";
    let customMessage = bridge.transf(values.message);
    
    const ws = client.dashboard.ws;

    if (!interaction || !ws) return;

    await new Promise((resolve) => {
      ws.send(JSON.stringify({
        op: client.dashboard.OP_CODES.ACKNOWLEDGE_INTERACTION,
        d: {
          interactionId: interaction.interactionId,
          success: success,
          message: customMessage,
          key: interaction.varname,
          value: interaction.data
        }
      }), resolve);
    });
  }
}
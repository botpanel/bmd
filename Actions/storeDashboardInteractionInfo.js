module.exports = {
    data: {
        name: "Store Dashboard Interaction Info"
    },
    UI: [
        {
            element: "var",
            storeAs: "interaction",
            name: "Source Interaction",
        },
        "_",
        {
            element: "dropdown",
            storeAs: "info",
            name: "Interaction Info",
            choices: [
                { name: "Interaction ID"},
                { name: "Variable Name"},
                { name: "Guild ID"},
                { name: "New Value"}
            ]
        },
        "-",
        {
            element: "store",
            storeAs: "interactionValue",
            name: "Store Interaction Value"
        }
    ],

    subtitle: (values, constants) => {
        return `Store ${values.info} as ${constants.variable(values.interactionValue)}`
    },

    async run(values, message, client, bridge) {
        let interaction = bridge.get(values.interaction);
        let info = bridge.transf(values.info);

        if (!interaction) return;

        const infoMap = {
            "Interaction ID": "interactionId",
            "Variable Name": "varname",
            "Guild ID": "guildId",
            "New Value": "data"
        };

        let result = interaction[infoMap[info]];

        bridge.store(values.interactionValue, result);
    }
}
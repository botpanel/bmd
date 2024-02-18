module.exports = {
    data: {
        name: "Initialize Dashboard Connection",
    },
    UI: [
        {
            element: "text",
            text: "This action is for setting up the connection with dashboard <code>https://botpanel.xyz</code>."
        },
        "_",
        {
            element: "text",
            text: "Make sure to place it under <code>Bot ready</code> event."
        },
        "-",
        {
            element: "input",
            storeAs: "appID",
            name: "Application ID",
        },
        "-",
        {
            element: "input",
            storeAs: "appSecret",
            name: "Application Secret",
        },
        "-",
        {
            element: "toggle",
            storeAs: "debug",
            name: "Debug Mode",
        }
    ],

    compatibility: ["Any"],

    script: (data) => {
        setTimeout(() => {
            data.document.getElementById("appSecret").setAttribute("type", "password");
        }, 100);
    },

    async run(values, msg, client, bridge) {
        const WebSocket = require("ws");
        console.log("[Dashboard] Initializing...");
        if (!client.dashboard) {
            client.dashboard = {};
            client.dashboard.events = {};
        }

        const connect = () => {
            const ws = new WebSocket("wss://botpanel.xyz/api/ws");

            ws.on('open', () => {
                console.log("[Dashboard] Initialized.");
            });

            ws.on('close', () => {
                console.log("[Dashboard] Connection closed, retrying...");
                setTimeout(connect, 5000);
            });

            ws.on("message", (message) => handleMessage(message, appID, appSecret));

            client.dashboard.ws = ws;
        }

        connect();

        const appID = bridge.transf(values.appID);
        const appSecret = bridge.transf(values.appSecret);
        const debug = values.debug;

        const OP_CODES = {
            AUTHENTICATE: 0,
            AUTH_SUCCESS: 1,
            ERROR: 2,
            GUILD_INTERACTION: 4,
            REQUEST_GUILD_DATA: 5,
            MODIFY_GUILD_DATA: 6,
        };

        const operationHandlers = {
            [OP_CODES.AUTHENTICATE]: ({ appID, appSecret }) => {
                console.log("[Dashboard] Attempting to authenticate...");
                client.dashboard.ws.send(JSON.stringify({
                    op: OP_CODES.AUTHENTICATE,
                    d: {
                        connectAs: "application",
                        applicationId: appID,
                        applicationSecret: appSecret
                    }
                }));
            },
            [OP_CODES.AUTH_SUCCESS]: ({ data, appID }) => {
                console.log(`[Dashboard] Successfully authenticated with application "${data.d.name}" (${appID})!`);
                setInterval(() => {
                    client.dashboard.ws.send(JSON.stringify({
                        op: 8
                    }));
                }, data.d.heartbeatInterval);
            },
            [OP_CODES.ERROR]: ({ data }) => {
                console.log(`[Dashboard] Error: ${data.d.error}`);
            },
            [OP_CODES.GUILD_INTERACTION]: async ({ data }) => {
                const { guildId, interactionId } = data.d;
                const guild = await client.rest.guilds.get(guildId);
                let serverData;
                try {
                    serverData = await bridge.data.IO.get().guilds[guildId];
                } catch (e) {
                    console.log(`[Dashboard] Error fetching guild data: ${e}\nReturning empty object.`);
                }

                try {
                    client.dashboard.ws.send(JSON.stringify({
                        op: OP_CODES.REQUEST_GUILD_DATA,
                        d: {
                            interactionId,
                            data: serverData || {},
                            inGuild: !!guild
                        }
                    }));
                } catch (e) {
                    console.log(`[Dashboard] Error sending message: ${e}`);
                }
            },
            [OP_CODES.MODIFY_GUILD_DATA]: async ({ data }) => {
                client.dashboard.events.dashboardDataUpdate(data);
            },
        };

        const handleMessage = async (message, appID, appSecret) => {
            let data;
            try {
                data = JSON.parse(message);
            } catch (e) {
                console.log(`[Dashboard] Error parsing message: ${e}`);
                return;
            }

            if (debug)
                console.log(`[Dashboard] Received message: ${JSON.stringify(data)}`);

            const handler = operationHandlers[data.op];
            if (handler) {
                try {
                    await handler({ data, appID, appSecret });
                } catch (e) {
                    console.log(`[Dashboard] Error handling message: ${e}`);
                }
            }
        };
    }
}
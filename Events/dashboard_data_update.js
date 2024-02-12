module.exports = {
    name: "Dashboard Data Update",
    nameSchemes: ["Store Interaction As"],
    initialize(client, data, run) {

        if (!client.dashboard) {
            client.dashboard = {};
            client.dashboard.events = {};
        }
        
        client.dashboard.events.dashboardDataUpdate = (data) => {
            run([
                data
            ], data)
        };
    }
};
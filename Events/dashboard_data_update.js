module.exports = {
    name: "Dashboard Data Update",
    nameSchemes: ["Store Data As"],
    initialize(client, data, run) {
        client.dashboard.events.dashboardDataUpdate = (data) => {
            run([
                data
            ], data)
        };
    }
};
# Bot Panel w/ Bot Maker for Discord Integration Guide
This is the setup guide for using [Bot Panel](https://botpanel.xyz) with [Bot Maker for Discord](https://store.steampowered.com/app/2592170/Bot_Maker_For_Discord/).

# Installation

1. Have BMD installed and a bot project open.
2. Visit the [Bot Panel Developer Dashboard](https://dev.botpanel.xyz).
3. Log in to the developer dashboard.
4. Navigate to the `Manage Applications` page and click `Add Application`.
   <br><br>
   ![Image](https://github.com/dbm-dashboard/bmd/blob/904c48f406149e5fbf4172109011a5212adba61b/.github/botpanel_bmd_step1.png?raw=true)
6. Complete all fields.
7. Download the files from the [Actions](https://github.com/dbm-dashboard/bmd/tree/main/actions) directory and place them in your Bot Maker for Discord's `Actions` directory (usually located at C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData\Actions).
8. Download the files from the [Events](https://github.com/dbm-dashboard/bmd/tree/main/events) directory and place them in your Bot Maker for Discord's `Events` directory (usually located at C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData\Events).
9. Make sure you have restarted BMD after downloading and installing these mods.
10. From the developer dashboard, take note of your application id and application secret. Do not share your secret with others.
11. In your BMD project, navigate to the events section and add the `Initialize Dashboard Connection` action to the `Bot ready` event.
12. Copy and paste your application id and secret into the field, and hit `Save`.
13. From this point to see if everything is configured properly, restart your bot and open your console. You should see the message `[Dashboard] Successfully authenticated with application "APPLICATION_NAME" (APPLICATION_ID)!`
14. Set up data receive event (Read below)

# Receiving Data

When a user modifies data on their dashboard, an interaction is sent from our server to your bot, much alike how discord interactions work. This interaction stores data such as the variable name, data, etc. **You must acknowledge every request for it to be marked as successful on your user's dashboard.** To do this create an event on your bot using the `Dashboard Data Update` event. This event has one temporary variable input, which is the `Interaction Object`, and is fired every time a user submits a data change request from their dashboard. When you receive this request, you can use the `Store Dashboard Interaction Info` action to store all necessary data and make changes to your bot's backend storage. Once all data changes have been made, make sure to acknowledge the interaction using the `Acknowledge Dashboard Interaction` action.

An example of raw data, which accomplishes all of the above using BMD's built-in server data database, can be found below.

# Raw Data Examples

1. Connection to database:
```json
{
  "name": "Connection to Dashboard",
  "type": "event",
  "trigger": "event",
  "actions": [
    {
      "name": "Initialize Dashboard Connection",
      "file": "initializeDashboardConnection.js",
      "data": {
        "name": "Initialize Dashboard Connection",
        "appID": "APPLICATION_ID",
        "appSecret": "APPLICATION_SECRET",
        "debug": false
      },
      "id": 1707638981563
    }
  ],
  "customId": 1707638234764,
  "eventFile": "bot_ready.js",
  "eventData": [
    "",
    ""
  ],
  "description": "This event connects the bot to dashboard (https://botpanel.xyz)"
}
```

2. Receiving Data and Updating the Server Data Database

```json
{
  "name": "Dashboard Data Changed",
  "type": "event",
  "trigger": "event",
  "actions": [
    {
      "name": "Store Dashboard Interaction Info",
      "file": "storeDashboardInteractionInfo.js",
      "data": {
        "name": "Store Dashboard Interaction Info",
        "interaction": {
          "type": "tempVar",
          "value": "interaction"
        },
        "info": "Variable Name",
        "interactionValue": {
          "type": "temporary",
          "value": "varname"
        }
      },
      "id": 1707718560136
    },
    {
      "name": "Store Dashboard Interaction Info",
      "file": "storeDashboardInteractionInfo.js",
      "data": {
        "name": "Store Dashboard Interaction Info",
        "interaction": {
          "type": "tempVar",
          "value": "interaction"
        },
        "info": "New Value",
        "interactionValue": {
          "type": "temporary",
          "value": "newval"
        }
      },
      "id": 1707718605262
    },
    {
      "name": "Store Dashboard Interaction Info",
      "file": "storeDashboardInteractionInfo.js",
      "data": {
        "name": "Store Dashboard Interaction Info",
        "interaction": {
          "type": "tempVar",
          "value": "interaction"
        },
        "info": "Guild ID",
        "interactionValue": {
          "type": "temporary",
          "value": "guildid"
        }
      },
      "id": 1707724861253
    },
    {
      "name": "Store Guild Data",
      "file": "storeGuildData.js",
      "data": {
        "name": "Store Guild Data",
        "source": {
          "type": "tempVar",
          "value": "newval"
        },
        "guild": {
          "type": "id",
          "value": "${tempVars('guildid')}"
        },
        "dataName": "${tempVars('varname')}"
      },
      "id": 1707723423090
    },
    {
      "name": "Acknowledge Dashboard Interaction",
      "file": "acknowledgeDashboardInteraction.js",
      "data": {
        "name": "Acknowledge Dashboard Interaction",
        "interaction": {
          "type": "tempVar",
          "value": "interaction"
        },
        "success": "True"
      },
      "id": 1707718668923
    }
  ],
  "customId": 1707717017242,
  "eventFile": "dashboard_data_update.js",
  "eventData": [
    "interaction",
    ""
  ],
  "description": "This event is fired whenever the user saves any data in your bot panel"
}
```

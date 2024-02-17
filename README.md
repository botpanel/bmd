# Bot Panel w/ Bot Maker for Discord Integration Guide
This is the setup guide for using [Bot Panel](https://botpanel.xyz) with [Bot Maker for Discord](https://store.steampowered.com/app/2592170/Bot_Maker_For_Discord/).

# Installation

1. Have BMD installed and a bot project open.
2. Visit the [Bot Panel Developer Dashboard](https://dev.botpanel.xyz).
3. Log in to the developer dashboard.
4. Navigate to the `Manage Applications` page and click `Add Application`.
   <br><br>
   ![Image](https://github.com/botpanel/bmd/blob/904c48f406149e5fbf4172109011a5212adba61b/.github/botpanel_bmd_step1.png?raw=true)
6. Complete all fields.
7. Download the files from the [Actions](https://github.com/botpanel/bmd/tree/main/actions) directory and place them in your Bot Maker for Discord's `Actions` directory (usually located at C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData\Actions).
8. Download the files from the [Events](https://github.com/botpanel/bmd/tree/main/events) directory and place them in your Bot Maker for Discord's `Events` directory (usually located at C:\Program Files (x86)\Steam\steamapps\common\Bot Maker For Discord\AppData\Events).
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

# Editing Your User Dashboard

Your user dashboard is what your bot users will see when they access their client dashboard. To manage your user dashboard, in your dev panel, select your application, and on the left navbar, select `Edit User Dashboard`. The user dashboard is built of components, which can be thought of as building blocks for your user dashboard. There are two types of components: a `Header Component` and an `Input Component`. The header component is meant for splitting the dashboard into different sections, and the input component is for retrieving data from the user. For input components, there is data validation. We try our best to validate data on both our frontend and backend before sending the updated data to your bot; however, it is still best practice to verify it yourself before updating it on your side.

When you're done editing your components, such as adding or rearranging them by dragging and dropping, make sure to save them by clicking the `Save` button that appears after changes are made. There are two options for saving components: `Publish Changes` and `Save Changes`. When you click `Save Changes`, the changes will be saved the next time you visit your dashboard editor, but not displayed to users. You, as the application owner, can view these changes on the client dashboard by clicking the `Switch to Developer View` button. This is useful if you want to test dashboard features before deploying them to all of your users. The other button, `Publish Changes`, will publish whatever saved version you have of your dashboard to all of your users.

# Application Verification

Verifiying your application is a vital step in completing your dashboard, made to establish user trust. Read more on this in the `Verification Status` tab on your application's navbar.

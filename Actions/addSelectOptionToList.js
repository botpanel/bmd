module.exports = {
  data: {
    name: "Add Select Option to List",
  },

  info: {
    source: "https://github.com/botpanel/bmd/",
    creator: "The Bot Panel Team",
  },

  category: "Bot Panel",

  UI: [
    {
      element: "var",
      storeAs: "sourceList",
      name: "Source List",
    },
    "_",
    {
      element: "dropdown",
      storeAs: "addType",
      name: "Add Type",
      choices: [
        { name: "Add to End" },
        { name: "Add to Front" },
        { name: "Add to Specific Position" },
      ],
    },
    "-",
    {
      element: "input",
      name: "Position",
      storeAs: "position",
    },
    "-",
    {
      element: "text",
      text: "<a href='https://react-icons.github.io/react-icons/icons/fa6/' target='_blank'>Predefined Icons</a>",
    },
    {
      element: "input",
      name: "Icon",
      storeAs: "icon",
      placeholder: "Icon name (e.g. 'FaStar') or Image URL",
    },
    "-",
    {
      element: "input",
      name: "Name",
      storeAs: "name",
    },
    "-",
    {
      element: "input",
      name: "Value",
      storeAs: "value",
    },
  ],

  subtitle: (values, constants) => {
    return `Add option ${values.name} to ${constants.variable(values.sourceList)}`;
  },

  script: (data) => {
    function refreshElements() {
      if (data.data.addType == "Add to Specific Position") {
        data.UI[3] = "-";
        data.UI[4].element = "input";
      } else {
        data.UI[3] = " ";
        data.UI[4].element = " ";
      }

      setTimeout(() => {
        data.updateUI();
      }, data.commonAnimation * 100);
    }
    refreshElements();
    data.events.on("change", () => {
      refreshElements();
    });
  },

  async run(values, message, client, bridge) {
    const list = bridge.get(values.sourceList);
    const addType = bridge.transf(values.addType);

    let val = {
      icon: bridge.transf(values.icon).replace("fa6 ", ""),
      name: bridge.transf(values.name),
      value: bridge.transf(values.value),
    };

    switch (addType) {
      case "Add to End": {
        list.push(val);
        break;
      }
      case "Add to Front": {
        list.unshift(val);
        break;
      }
      case "Add to Specific Position": {
        const position = parseInt(bridge.transf(values.position), 10);
        if (position < 0 || position > list.length) {
          throw new Error("Position is out of bounds.");
        }
        list.splice(position, 0, val);
        break;
      }
    }

    bridge.store(values.sourceList, list);
  },
};

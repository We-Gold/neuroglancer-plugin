# Neuroglancer Ouroboros Plugin

This plugin integrates a Neuroglancer interface into the [Ouroboros](https://github.com/We-Gold/ouroboros) medical imaging software. 

To install it, open Ouroboros, open the Plugin Manager (`Ouroboros > Manage Plugins`), and add a plugin from the GitHub releases url: `https://github.com/We-Gold/neuroglancer-plugin/releases`.

Then restart the app and the plugin should be visible.

### Features

Click the menu on the right side of the Neuroglancer window (three dots) and you'll have the option to load or save the current JSON state.

Neuroglancer can do this natively, but the menu buttons integrate into Ouroboros's file explorer, so when you open a folder in the app, the local JSON files are immediately available.

### Development

Make sure Docker is installed and running.

1. `npm install`
2. `npm run dev`

To test in Ouroboros, run Ouroboros in development mode as well, and use the `Test Plugin` page to view the plugin.
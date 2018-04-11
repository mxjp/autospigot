# AutoSpigot
SpigotMC server supervisor for development and production.

## Status
This is an early development version. Configuration and usage may change at any time!<br/>
If you are reading this on github, keep in mind that cli and api documentation below may differ from the latest version that is published on npm!

<br/>



# CLI
## Prequisites
+ Get your spigot server build as described [here](https://www.spigotmc.org/wiki/buildtools/)
+ Install [nodejs](https://nodejs.org/en/)

## Install using npm
```bash
npm i -g autospigot
```

## Configuration
Create an empty configuration file: `autospigot.json`
```bash
autospigot init [--server|-s <directory>]
```
+ `--server | -s` - Specify the server directory.

```js
{
	// The path to the server's data directory:
	"data": "data",

	// The path to the spigot executable:
	"executable": "spigot.jar",

	// An array of plugin filenames to install and watch for changes:
	"plugins": [],

	// An array of additional java arguments:
	"javaArgs": [],

	// An array of additional server arguments:
	"serverArgs": []
}
```

## Running a server
```bash
autospigot start [--server|-s <directory>] [--keep-alive|-r] [--watch|-w]
```
+ `--server | -s` - Specify the server directory.
+ `--keep-alive | -r` - Keep the server alive until the stop command is issued through autospigot input or autospigot is interrupted.
+ `--watch | -w` - Watch plugins for changes.

## Version check
```bash
autospigot version
# Outputs something like 'autospigot v1.2.3'
```

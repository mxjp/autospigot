# AutoSpigot
Spigot server for rapid plugin development!<br/>

## Status
This is an early development version. Configuration and usage may change at any time!



# Installation
### Prequisites
+ Get your spigot server build as described [here](https://www.spigotmc.org/wiki/buildtools/)
+ Install [nodejs](https://nodejs.org/en/)

### Install using npm
```bash
npm i -g autospigot
```

<br/>



# Usage
AutoSpigot uses so called *server environments*. A server environment consists of an autospigot config and the serverdata. To create a new environment with a default configuration type:
```bash
# In the current directory:
autospigot init

# In a specific directory:
autospigot init path/to/environment
```

### Configuration
The following is the default configuration stored in **autospigot.json** in your environment directory:
```json
{
	"executable": "spigot.jar",
	"workingDirectory": "server",
	"pluginSources": [
	]
}
```
+ `executable` - Specifies the path to the spigot executable relative to the environment directory.
+ `workingDirectory` - Specifies the working directory for the server relative to the environent directory.
+ `pluginSources` - An array of plugin (.jar) paths to install and watch for changes.

### Running the server
To run a server environment type:
```bash
# In the current directory:
autospigot run

# In a specific directory:
autospigot run path/to/environment
```

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
	],
	"javaArgs": [
	],
	"serverArgs": [
	]
}
```
+ `executable` - Specifies the path to the spigot executable relative to the environment directory.
+ `workingDirectory` - Specifies the working directory for the server relative to the environent directory.
+ `pluginSources` - An array of plugin (.jar) paths to install and watch for changes.
+ `javaArgs` - An array of additional arguments for the jvm.
+ `serverArgs` - An array of additional arguments for the spigot server.

> Note that fields that are not set in the configuration will fallback their defaults.<br/>
> It is recommended to specify all fields explicitly to ensure consistency between different autospigot versions (even if the value is the default).

### Running the server
To run a server environment type:
```bash
# In the current directory:
autospigot run

# In a specific directory:
autospigot run path/to/environment
```

### Minecraft EULA
By running a server using autospigot you are indicating your agreement to Mojang's [Minecraft EULA](https://account.mojang.com/documents/minecraft_eula).<br>
*AutoSpigot will automatically accept mojang's minecraft EULA when starting a server enrivonment the first time.*

<br/>

## Version check
To get the autospigot version that is currently installed type:
```bash
autosigot version
```
To output something like:
```
autospigot v1.2.3 (MIT Licensed)
```

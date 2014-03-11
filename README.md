bPi
===

Automated beer making bot, controlled via a Raspberry Pi, I2C devices, and a Node.js web server

Very much a work in progress still at this point.

Installation
---
1. git clone this repo
2. npm install . 
3. node app
4. (optional) install forever and run node via forever


Release Plans
---

1. Node.js server to expose the status of various devices
2. Pi4J server code accessing I2C devices for controlling relays [heating elements, automated ball valves], as well as 1-wire temperature sensors
3. Redis pub/sub communication between Pi4J and Node.js to present data via the web interface and to allow for manual override of control
4. 

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

/*
 *	Message Handling 
 */

// Set Messenger default options
Messenger.options = {
  extraClasses: 'messenger-fixed messenger-on-top',
  theme: 'block'
}

window.showMessage = function(data) {
	Messenger().post({
		message: data.message,
		type: data.type,
		showCloseButton: true
	});
};


/*
 * Socket.IO Passing
 */

// Socket Handling
window.socket = io.connect('127.0.0.1:8080');
log(window.socket);

// on connection to server, get back connection status
window.socket.on('connect', function(){
	// call the server to get the brewery status
	socket.emit('login', "Jason");
});

window.socket.on('loggedin', function(username) {
	alert(username);
});

window.socket.on('showmessage', function(data) {
	showMessage(data);
});

/*
 * Display the Homepage Clock
 */
var updateClock = function()
{
  var currentTime = new Date ();

  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Choose either "AM" or "PM" as appropriate
  var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

  // Update the time display
  $("#clock").text(currentTimeString);
}
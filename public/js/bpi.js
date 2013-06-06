var BPi = {};

//http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

/*
 * App Router
 *
 * Global Backbone Client-Side Router 
 *
 */
 BPi.App = Backbone.Router.extend({
  routes: {
    '': 'index',
    '/': 'index',
    'manual': 'manual'
  },
  index: function() {
    log('loading index', this);

    var homeView = new BPi.HomeView();
    $('#viewWrapper').append(homeView.el);

    var status = new BPi.Status();
    var hlt = new BPi.Vessel({id: 'hlt', heatOn: true, pumpOn: false});
    var mlt = new BPi.Vessel({id: 'mlt', heatOn: true, pumpOn: true});
    var bk = new BPi.Vessel({id: 'bk', heatOn: false, pumpOn: true});

    var header = new BPi.StatusView(status);
    $('#statusWrapper').append(header.el);

    var hltView = new BPi.VesselView(hlt);
    $('#hltWrapper').append(hltView.el);

    var mltView = new BPi.VesselView(mlt);
    $('#mltWrapper').append(mltView.el);

    var bkView = new BPi.VesselView(bk);
    $('#bkWrapper').append(bkView.el);

    status.fetch();
  },
  manual: function() {
    log('loading manual page', this);

    var manualView = new BPi.ManualView();
    $('#viewWrapper').append(manualView.el);

  }
});

/*
 * Status Model
 *
 * Default Status Model
 * 
 */
 BPi.Status = Backbone.Model.extend({
  urlRoot: 'status',
  noIoBind: false,
  socket: window.socket,
  initialize: function() {
    _.bindAll(this, 'serverCreate', 'serverChange', 'modelCleanup');

    /*!
    */
    if (!this.noIoBind) {
      this.ioBind('update', this.serverChange, this);
    }
  },
  serverCreate: function(data) {
    console.log("create");
    data.fromServer = true;
    this.set(data);
  },
  serverChange: function(data){ 
    console.log("change");
    data.fromServer = true;
    this.set(data);
  },
  modelCleanup: function() {
    this.ioUnbindAll();
    return this;
  }
});

 BPi.Vessel = Backbone.Model.extend({
  urlRoot: 'vessel',
  noIoBind: false,
  socket: window.socket,
  initialize: function() {
    _.bindAll(this, 'serverCreate', 'serverChange', 'modelCleanup');

    if (!this.noIoBind) {
      this.ioBind('update', this.serverChange, this);
    }
  },
  serverCreate: function(data) {
   console.log("create");
   data.fromServer = true;
   this.set(data);
 },
 serverChange: function(data){ 
  console.log("change");
  data.fromServer = true;
  this.set(data);
},
modelCleanup: function() {
  this.ioUnbindAll();
  return this;
}
});

/*
 * Home View
 *
 */
BPi.HomeView = Backbone.View.extend({
  id: 'HomeView',
  initialize: function() {
    this.render();
  },
  render: function() {
    $(this.el).html(template.home());
    return this;
  }
});

/*
 * Manual View
 *
 */
 BPi.ManualView = Backbone.View.extend({
  id: 'ManualView',
  initialize: function() {
    this.render();
  },
  render: function() {
    $(this.el).html(template.manual());
    return this;
  }
});

/*
 * Status View
 *
 * Status View for Status Models
 *
 */
 BPi.StatusView = Backbone.View.extend({
  id: 'StatusView',
  events: {
    
  },
  initialize: function(status) {
    this.model = status;

    this.model.bind('change', this.render, this);

    this.render();
  },
  render: function() {
    $(this.el).html(template.homestatus(this.model.toJSON()));
    return this;
  }
});

 BPi.VesselView = Backbone.View.extend({
  id: 'VesselView',
  events: {
    'click .vessel-heat-indicator': 'toggleHeat',
    'click .vessel-pump-indicator': 'togglePump'
  },
  initialize: function(vessel) {
    _.bindAll(this, 'toggleHeat', 'togglePump', 'updateValues');
    this.model = vessel;
    
    this.model.bind('change', this.updateValues, this);

    this.render();
  },
  updateValues: function() {
    this.tempGauge.setValueAnimated(120.1);
    this.volumeGauge.setValueAnimated(12.50);
    this.heatLed.setLedOnOff(this.model.get('heatOn'));
    this.pumpLed.setLedOnOff(this.model.get('pumpOn'));
  },
  render: function() {
    log('render vessel view', this);
    var that = this;
    $(this.el).html(template.homevessel({id: this.model.get('id'), name: this.model.get('id')}));
    //$(this.el).attr('id', this.model.id);

    setTimeout(function() {
      that.heatLed = Gauges.createHeatIndicator(that.model.get('id'));
      that.pumpLed = Gauges.createPumpIndicator(that.model.get('id'));
      that.tempGauge = Gauges.createTempGauge(that.model.get('id'), that.model.get('id'));
      that.volumeGauge = Gauges.createVolumeGauge(that.model.get('id'));

      that.heatLed.setLedOnOff(that.model.get('heatOn'));
      that.pumpLed.setLedOnOff(that.model.get('pumpOn'));
      that.tempGauge.setValueAnimated(198.2);
      that.volumeGauge.setValueAnimated(14.25);
    }, 0);
    
    return this;
  },
  toggleHeat: function(evt) {
    window.socket.emit("boil", "jason")
    var onOff = this.model.get('heatOn') ? 'off' : 'on';

    this.model.set('heatOn', !this.model.get('heatOn'));
    showMessage({message: 'Heater ' + this.model.get('id') + ' turned ' + onOff, type: 'success'});
  },
  togglePump: function() {
    var onOff = this.model.get('pumpOn') ? 'off' : 'on';
    this.model.set('pumpOn', !this.model.get('pumpOn'));
    showMessage({message: 'Pump ' + this.model.get('id') + ' turned ' + onOff, type: 'success'});
  }
});

$(document).ready(function () {
  window.app = new BPi.App();
  Backbone.history.start();
});


var Gauges = {};

Gauges.sections = Array(steelseries.Section(0, 100, 'rgba(0, 0, 220, 0.3)'),
  steelseries.Section(100, 150, 'rgba(0, 220, 0, 0.3)'), 
  steelseries.Section(150, 200, 'rgba(220, 220, 0, 0.3)'));


Gauges.areas = Array(steelseries.Section(200, 212, 'rgba(220, 0, 0, 0.3)'));


Gauges.valGrad = new steelseries.gradientWrapper(  0, 212,
  [ 0, 0.17, 0.39, 0.54, 1],
  [ new steelseries.rgbaColor(0, 0, 200, 1),
  new steelseries.rgbaColor(0, 200, 0, 1),
  new steelseries.rgbaColor(200, 200, 0, 1),
  new steelseries.rgbaColor(200, 0, 0, 1),
  new steelseries.rgbaColor(200, 0, 0, 1) ]);

// Create a Temperature Gauge
Gauges.createTempGauge = function(sel, title) {
  return new steelseries.RadialBargraph(
    sel+'Temp', {
      section: Gauges.sections,                      
      gaugeType: steelseries.GaugeType.TYPE4,
      area: Gauges.areas,      
      minValue: 0,
      maxValue: 212,
      valueGradient: Gauges.valGrad,
      useValueGradient: true,                      
      titleString: title,                    
      unitString: 'Farenheit',    
      frameDesign: steelseries.FrameDesign.TILTED_BLACK,
      backgroundColor: steelseries.BackgroundColor.TURNED,                 
      pointerType: steelseries.PointerType.TYPE9,
      pointerColor: steelseries.ColorDef.BLUE2,
      lcdColor: steelseries.LcdColor.SECTIONS,
      ledColor: steelseries.LedColor.RED_LED
    });
};

// Create a Volume Gauge
Gauges.createVolumeGauge = function(sel) {
  return new steelseries.Linear(sel+'Volume', {
    titleString: '',
    unitString: 'Gallons',
    maxValue: 15,
    thresholdVisible: false,
    //frameVisible: false,
    gaugeType: steelseries.GaugeType.TYPE4,
    frameDesign: steelseries.FrameDesign.TILTED_BLACK,
    backgroundColor: steelseries.BackgroundColor.TURNED,      
    valueColor: steelseries.ColorDef.BLUE,
    ledVisible: false,
    ledColor: steelseries.LedColor.BLUE_LED,
    lcdColor: steelseries.LcdColor.SECTIONS,
    lcdVisible: true
  });
};

Gauges.createIndicator = function(sel, color) {
  var indicator = new steelseries.Led(sel, {
    width: 50,
    height: 50,
    blink: false,
    ledColor: color
  });

  return indicator;
};

Gauges.createHeatIndicator = function(sel) {
  return Gauges.createIndicator(sel + 'Heat', steelseries.LedColor.RED_LED);
}

Gauges.createPumpIndicator = function(sel) {
  return Gauges.createIndicator(sel + 'Pump', steelseries.LedColor.BLUE_LED);
}


var showTemp = function(val) {
  console.log(val);
  console.log($("#setTemp .field"));
  $("#setTemp .field").text(val);
  $("#setTemp").show();
}

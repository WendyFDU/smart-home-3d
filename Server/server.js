var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// Device status data
var windowStat = 1.0;
var curtainStat = 1.0;
var lightStat = 0;
var airconStat = 0;
var humidifierStat = 0;

// Inferred device status data
var windowStatInfer = 1.0;
var curtainStatInfer = 1.0;
var lightStatInfer = 0;
var airconStatInfer = 0;
var humidifierStatInfer = 0;
var withMsg;
var msg; // Notification

// Sensor data
var temperature = 10;
var humidity = 40;
var noise = 30;
var light = 2000;
var weather = 3;
var date;

io.on('connection', function (socket) {
  console.log('Connection established');

  // Listen on device status data change
  socket.on('mobile to server', function (data) {
    // Receive modified device status data from mobile device
    console.log(data);
    windowStat = data.windowStat;
    curtainStat = data.curtainStat;
    lightStat = data.lightStat;
    airconStat = data.airconStat;
    humidifierStat = data.humidifierStat;

    //inferDeviceStat();

    // Judge device status
    // if (lightStat != lightStatInfer) {
    //   withMsg = true;
    //   if (lightStatInfer == 1) {
    //     msg = '是否开灯？';
    //   }
    //   else if (lightStatInfer == 0) {
    //     msg = '是否关灯？';
    //   }
    // }
    // else if (airconStat != airconStatInfer) {
    //   withMsg = true;
    //   if (airconStatInfer == 1) {
    //     msg = '是否开空调？';
    //   }
    //   else if (airconStatInfer == 0) {
    //     msg = '是否关空调？';
    //   }
    // }
    // else if (humidifierStat != humidifierStat) {
    //   withMsg = true;
    //   if (humidifierStatInfer == 1) {
    //     msg = '是否开加湿器？';
    //   }
    //   else if (humidifierStatInfer == 0) {
    //     msg = '是否关加湿器？';
    //   }
    // }
    // else {
    //   withMsg = false;
    // }

    // Send mobile modified device status data to PC
    socket.emit('server to mobile', {
      temperature: temperature,
      humidity: humidity,
      noise: noise,
      light: light,
      withMsg: withMsg,
      msg: msg
    });
  });

  // Listen on sensor data change
  socket.on('PC to server', function (data) {
    console.log(data);
    // Receive sensor data from PC
    temperature = data.temperature;
    humidity = data.humidity;
    noise = data.noise;
    light = data.light;

    // Infer device status from sensor data
    //inferDeviceStat();

    // Send sensor data and notification (inferred device status) to mobile device
    socket.emit('server to PC', {
      windowStat: windowStat,
      curtainStat: curtainStat,
      lightStat: lightStat,
      airconStat: airconStat,
      humidifierStat: humidifierStat
    });
  });
});

function inferDeviceStat() {
  date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var day = date.getDay();

  var params = new Array(17);

  // Encode time
  var time = hour + minute / 60.0;
  var t1 = Math.cos(time / 12 * Math.PI);
  var t2 = Math.sin(time / 12 * Math.PI);
  params[0] = t1;
  params[1] = t2;

  // Encode day
  for (var i = 2; i < 9; i++) {
    if (i - 2 == (day + 7) % 8) {
      params[i] = 1;
    }
    else {
      params[i] = 0;
    }
  }

  params[9] = temperature;
  params[10] = humidity;
  params[11] = noise;
  params[12] = light;

  // Encode weather
  for (var i = 13; i < 17; i++) {
    if (i - 13 == weather) {
      params[i] = 1;
    }
    else {
      params[i] = 0;
    }
  }
  //console.log(params);

  var paramStr = JSON.stringify(params);
  // console.log('paramStr: ' + paramStr);

  var exec = require('child_process').exec;
  exec('python3 test_sensor_nn.py ' + paramStr , function(err, stdout, stdin) {
    if (err) {
        console.log('error');
    }
    if (stdout) {
      // Parse the string
      console.log(stdout);
      var str = stdout.split('\r\n');
      var deviceStatInfer = JSON.parse(str);
      windowStatInfer = deviceStatInfer[0];
      curtainStatInfer = deviceStatInfer[1];
      if (deviceStatInfer[2] < 0.5) {
        lightStatInfer = 0;
      }
      else {
        lightStatInfer = 1;
      }
      if (deviceStatInfer[3] < 0.5) {
        airconStatInfer = 0;
      }
      else {
        airconStatInfer = 1;
      }
      if (deviceStatInfer[4] < 0.5) {
        humidifierStatInfer = 0;
      }
      else {
        humidifierStatInfer = 1;
      }
    }
  });
}

// inferDeviceStat();

//setInterval(inferDeviceStat, 5000);
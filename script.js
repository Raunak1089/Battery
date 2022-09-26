let alarm = new Audio('https://raunak1089.github.io/Required-files/alarm-tone.wav');
alarm.loop=true;



function hlab(x){document.querySelector('#h_label').innerHTML=x.value}
function llab(x){document.querySelector('#l_label').innerHTML=x.value}

/*
function notif(t, b, i="https://raunak1089.github.io/Required-files/me-circle.png"){
  Notification.requestPermission().then(perm => {
      if(perm ==='granted'){
          const notification = new Notification(t, {
              body: b,
              data: {hello: "world"},
              icon: i,
              tag: "Welcome message",
      })
          // notification.addEventListener("click", ()=>{alert("Thanks for attending my notification!")})
      }
  })
}
*/

function notif(t, b, i="https://raunak1089.github.io/Required-files/me-circle.png"){
Push.create(t, {
    body: b,
    icon: i,
    timeout: 10000,
    onClick: function () {
        window.focus();
        this.close();
    }
});
}

  function play_audio(){
  //var put = document.createElement('audio');
  //put.id = 'firesound';
  //put.src = 'https://raunak1089.github.io/Required-files/' + link; 
  //document.body.appendChild(put);
  alarm.play();
  //setTimeout(function(){document.getElementById("firesound").remove(); }, 1000);
  }

notif('Battery Status', 'Battery level checker is activated. Keep track on your battery level!');

navigator.getBattery().then((battery) => {
  function updateAllBatteryInfo() {
    updateChargeInfo();
    updateLevelInfo();
    updateChargingInfo();
    updateDischargingInfo();
  }
  updateAllBatteryInfo();

  battery.addEventListener("chargingchange", () => {
    updateChargeInfo();
  });
  function updateChargeInfo() {
    console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
    if(battery.charging){document.querySelector('#batt').style.background="#05ff05";}
    else{document.querySelector('#batt').style.background="#c70039";}
    let hh = (document.querySelector('#highest').value)/100;
    let ll = (document.querySelector('#lowest').value)/100;
    if(battery.level>=hh & battery.charging){play_audio();}else{alarm.pause();}
    if(battery.level<=ll & !battery.charging){play_audio();}else{alarm.pause();}

  }

  battery.addEventListener("levelchange", () => {
    updateLevelInfo();
  });
  function updateLevelInfo() {
    console.log(`Battery level: ${battery.level * 100}%`);
    document.querySelector('#charged').innerHTML = Math.round(battery.level * 100) + '%';

    let hh = (document.querySelector('#highest').value)/100;
    let ll = (document.querySelector('#lowest').value)/100;
    if(battery.level>=hh & battery.charging){play_audio(); notif("Battery Status", `Battery has reached ${Math.round(battery.level * 100)}%. Please disconnect the charger!`)}
    if(battery.level<=ll & !battery.charging){play_audio(); notif("Battery Status", `Battery has reached ${Math.round(battery.level * 100)}%. Please connect the charger!`)}
  }

  battery.addEventListener("chargingtimechange", () => {
    updateChargingInfo();
  });
  function updateChargingInfo() {
    console.log(`Battery charging time: ${battery.chargingTime} seconds`);
    if(battery.charging){
        hr = Math.floor(battery.chargingTime/3600);
        min = Math.floor((battery.chargingTime%3600)/60);
    }
    else{
        hr = Math.floor(battery.dischargingTime/3600);
        min = Math.floor((battery.dischargingTime%3600)/60);
    }
    document.querySelector('#time_left').innerHTML = hr + ' h ' + min + ' m';
  }

  battery.addEventListener("dischargingtimechange", () => {
    updateDischargingInfo();
  });
  function updateDischargingInfo() {
    console.log(`Battery discharging time: ${battery.dischargingTime} seconds`);
  }
});

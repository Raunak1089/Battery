<script>

let X = []; let Y = [];

function hlab(x){document.querySelector('#h_label').innerHTML=x.value}
function llab(x){document.querySelector('#l_label').innerHTML=x.value}


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
    X = []; Y = [];    
    console.log(X); console.log(Y);
  });
  function updateChargeInfo() {
    console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
    document.querySelector('#present-fill').innerHTML=`
      #batt::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 20px 0px 0px 20px;
        width: ${battery.level * 100}%;
        background-color: ${battery.charging ? "lime" : "red"};
      }
    `;
  }

  battery.addEventListener("levelchange", () => {
    updateLevelInfo();
  });
  function updateLevelInfo() {
    console.log(`Battery level: ${battery.level * 100}%`);
    document.querySelector('#charged').innerHTML = Math.round(battery.level * 100) + '%';

    X.push(battery.level * 100); Y.push(Math.round(document.timeline.currentTime/1000));
    
    console.log(X); console.log(Y);

    document.querySelector('#present-fill').innerHTML=`
      #batt::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 20px 0px 0px 20px;
        width: ${battery.level * 100}%;
        background-color: ${battery.charging ? "lime" : "red"};
      }
    `;

    let hh = (document.querySelector('#highest').value)/100;
    let ll = (document.querySelector('#lowest').value)/100;
    if(battery.level>=hh && battery.charging){alert(`Battery has reached ${100*hh}%. Please disconnect the charger!`)}
    if(battery.level<=ll && !battery.charging){alert(`Battery has reached ${100*ll}%. Please connect the charger!`)}
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



// X = [1,2,3,4,5];
// Y = [67,75,86,100,130];

function graduate() {

  n = X.length;

  t = X;

    t_powers = []
    for  (let i=0; i<=2; i++){
        t_powers.push([])
        for (let j=0; j<n; j++){
            t_powers[t_powers.length-1].push(t[j]**(i))
        }
    }


    yt_prod = []
    for (let i=0; i<=1; i++){
        yt_prod.push([])
        for (let j=0; j<n; j++){
            yt_prod[yt_prod.length-1].push(Y[j]*(t[j]**i))
        }
    }


    let eq = '';
    all = [];
    for (let i=0; i<=1; i++){
        eq += `\n\n${sum(yt_prod[i])} = 0 `
        all.push([])
        for (let j=0; j<=1; j++){
                eq += `+ a${j}*${sum(t_powers[i+j])} `;
                all[all.length-1].push(sum(t_powers[i+j]));
        }

        all[all.length-1].push(sum(yt_prod[i]))
    }

//console.log(eq);


let delta, delta_c;

    a = [];
    delta = [];
    for (let i=0; i<=1; i++){
        for (let j=0; j<=1; j++){
            delta.push(all[i][j]);
        }
    }


let v = delta.toString();
    
    for (let i=0; i<=1; i++){
        delta_c = eval(`[${v}]`);
        for (let j=0; j<=1; j++){
            delta_c[i+(1+1)*j] = all[j][all[j].length-1]
        }
        a.push(det(delta_c)/det(delta));
        //console.log(`a${i} = ${det(delta_c)/det(delta)}`)
    }
    
    
        final = `${a[0]} + (${a[1]})*(t)`
     
        //console.log('\n\nGraduated function:\n')
        //console.log(final)


        function funct(num){
           return eval(final.replace(/t/g, num))
        }
        
        return final;

}

	</script>

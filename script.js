
setInterval(()=>{document.querySelector('#timer').innerHTML=Math.round(document.timeline.currentTime/1000)},100)

let X = []; let Y = []; let Est_nxt_Q = []; let Est_nxt_Q3 = []; let Est_nxt_L3 = []; let Est_nxt_L2 = []; let Est_lst_Q = []; let Est_lst_Q3 = [];

document.querySelector('#highest').value=localStorage.getItem('hlab');
document.querySelector('#lowest').value=localStorage.getItem('llab');
document.querySelector('#h_label').innerText=localStorage.getItem('hlab');
document.querySelector('#l_label').innerText=localStorage.getItem('llab');

function hlab(x){document.querySelector('#h_label').innerHTML=x.value; localStorage.setItem('hlab',x.value)}
function llab(x){document.querySelector('#l_label').innerHTML=x.value; localStorage.setItem('llab',x.value)}


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
    X = []; Y = []; Est_nxt_Q = []; Est_nxt_Q3 = []; Est_nxt_L3 = []; Est_nxt_L2 = []; Est_lst_Q = []; Est_lst_Q3 = [];
    console.log(X); console.log(Y);
    tab_html='<tr><th>Percentage</th><th>Time(sec)</th><th>Est. time for next% (Q)</th><th>Est. time for next% (3 point Q)</th><th>Est. time for next% (3 point lin.)</th><th>Est. time for next% (2 point lin.)</th><th>Est. time for 35% (Q)</th><th>Est. time for 35% (3 point Q)</th></tr>';
    document.querySelector('details > table').innerHTML = tab_html;

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

    tab_html='<tr><th>Percentage</th><th>Time(sec)</th><th>Est. time for next% (Q)</th><th>Est. time for next% (3 point Q)</th><th>Est. time for next% (3 point lin.)</th><th>Est. time for next% (2 point lin.)</th><th>Est. time for 35% (Q)</th><th>Est. time for 35% (3 point Q)</th></tr>';

    function func_q(num){
      if(graduate(X, Y, 2) != undefined) return eval(graduate(X, Y, 2).replaceAll('t', num))
    }

    let X2=[]; let Y2=[];
    if(X.length >= 2) {for(i=2;i>0;i--) {X2.push(X[X.length-i]); Y2.push(Y[Y.length-i])}}
    function func_l2(num){
      if(graduate(X2, Y2, 1) != undefined) return eval(graduate(X2, Y2, 1).replaceAll('t', num))
    }

    let X3=[]; let Y3=[];
    if(X.length >= 3) {for(i=3;i>0;i--) {X3.push(X[X.length-i]); Y3.push(Y[Y.length-i])}}
    function func_l3(num){
      if(graduate(X3, Y3, 1) != undefined) return eval(graduate(X3, Y3, 1).replaceAll('t', num))
    }

    function func_q3(num){
      if(graduate(X3, Y3, 2) != undefined) return eval(graduate(X3, Y3, 2).replaceAll('t', num))
    }

    X.push(battery.level * 100); Y.push(Math.round(document.timeline.currentTime/1000));
    Est_nxt_Q.push(func_q(X[X.length-1]+X[X.length-1]-X[X.length-2])); 
    Est_nxt_Q3.push(func_q3(X[X.length-1]+X[X.length-1]-X[X.length-2])); 
    Est_nxt_L3.push(func_l3(X[X.length-1]+X[X.length-1]-X[X.length-2]));
    Est_nxt_L2.push(func_l2(X[X.length-1]+X[X.length-1]-X[X.length-2]));
    Est_lst_Q.push(func_q(35));
    Est_lst_Q3.push(func_q3(35));
    
    console.log(X); console.log(Y);

    for(i=0;i<X.length;i++){
    tab_html += `
    <tr>
      <td>${X[i]}</td><td>${Y[i]}</td>
      <td>${Est_nxt_Q[i]}</td>
      <td>${Est_nxt_Q3[i]}</td>
      <td>${Est_nxt_L3[i]}</td>
      <td>${Est_nxt_L2[i]}</td>
      <td>${Est_lst_Q[i]}</td>
      <td>${Est_lst_Q3[i]}</td>
    </tr>`;
    }
    document.querySelector('details > table').innerHTML = tab_html;


    // BATTERY COLOUR LEVEL CHANGE 

    document.querySelector('#present-fill').innerHTML=`
      #batt::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
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

function graduate(X, Y, degree) {
    n = X.length;
    let effective_X = [];
    for (x in X){
        if (effective_X.includes(X[x]) == false) {
            effective_X.push(X[x])
        }
    }

    let effective_n = effective_X.length;

    if (0 <= degree & degree < effective_n) {

  n = X.length;

t = X;

    t_powers = []
    for  (let i=0; i<=2*degree; i++){
        t_powers.push([])
        for (let j=0; j<n; j++){
            t_powers[t_powers.length-1].push(t[j]**(i))
        }
    }


    yt_prod = []
    for (let i=0; i<=degree; i++){
        yt_prod.push([])
        for (let j=0; j<n; j++){
            yt_prod[yt_prod.length-1].push(Y[j]*(t[j]**i))
        }
    }


    let eq = '';
    all = [];
    for (let i=0; i<=degree; i++){
        eq += `\n\n${sum(yt_prod[i])} = 0 `
        all.push([])
        for (let j=0; j<=degree; j++){
                eq += `+ a${j}*${sum(t_powers[i+j])} `;
                all[all.length-1].push(sum(t_powers[i+j]));
        }

        all[all.length-1].push(sum(yt_prod[i]))
    }

//console.log(eq);


let delta, delta_c;

    a = [];
    delta = [];
    for (let i=0; i<=degree; i++){
        for (let j=0; j<=degree; j++){
            delta.push(all[i][j]);
        }
    }


let v = delta.toString();
    
    for (let i=0; i<=degree; i++){
        delta_c = eval(`[${v}]`);
        for (let j=0; j<=degree; j++){
            delta_c[i+(degree+1)*j] = all[j][all[j].length-1]
        }
        a.push(Matrix.det(delta_c)/Matrix.det(delta));
        //console.log(`a${i} = ${Matrix.det(delta_c)/Matrix.det(delta)}`)
    }
    
    
        final = `${a[0]}`
        for (let i=1; i<=degree; i++){
            final += ` + (${a[i]})*((t)**${i})`
        }
    
     
        //console.log('\n\nGraduated function:\n')
        // console.log(final)
        return final;
        
 }
}


        

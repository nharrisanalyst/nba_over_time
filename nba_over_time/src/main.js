import './style.css'
import viteLogo from '/vite.svg'
import {createChart} from './chart';


document.querySelector('#app').innerHTML = `
  <div>
  <div>
    <div id="chart-1-title"> Offensive Ratings</div>
    <div id="chart_1"></div>
  </div>
  <div>
  <div id="chart-2-title"> Deffensive Ratings</div>
    <div id="chart_2"></div>
  </div>
  </div>
`

createChart(document.querySelector('#chart_1'), document.querySelector('#chart_2'));

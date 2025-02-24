import './style.css'
import viteLogo from '/vite.svg'
import {createChart} from './chart';


document.querySelector('#app').innerHTML = `
  <div>
  <div>
  <div id="title">
    <div id="mainTitle">
      Today's NBA Worst Offenses Are Better Than Yesterdays Best NBA Offenses.
    </div>
    <div id="subTitle">
      The 2022-23 season the team with the worst NBA Offense was better than the best offense from the 1998-99 season. Every single team has improved their offense with the 2023-20224 season ending with and average offense over 10+ PPP100 than the 2011-12 Season.
    </div>
    <div id="authorTitle">
      By: <a id="me" href="https://bsky.app/profile/truesync.bsky.social">Nathan Harris</a>     <a href="https://bsky.app/profile/truesync.bsky.social">@truesync.bsky.social</a> <a href="http://nathanharris.co">nathanharris.co</a> 
    </div>

  </div>
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

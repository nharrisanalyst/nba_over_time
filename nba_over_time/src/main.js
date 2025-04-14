import './style.css'
import viteLogo from '/vite.svg'
import {createChart} from './chart';


document.querySelector('#app').innerHTML = `
  <div id="main-wrapper">
  <div id="sub-main-cont">
  <div id="title">
    <div id="mainTitle">
      In Today's NBA The Worst Offense is Better Than Yesterday's NBA's Best NBA Offenses.
    </div>
    <div id="subTitle">
      Both Defense and Offense in the NBA has moved. The average NBA offense is 7.47 points higher than the best NBA offense in 1998. The Average NBA Defense is 5.91 poits worse than the best defense in 1998.
      <p>Both, NBA Teams offense and defense move in tandem. As NBA teams have copied eachothers offenses, in couting specific players, developing a modern offense and players have come to the league prepared to play modern offenses,  the worst NBA offenses today are better than the best of yesterday.
      As a result, NBA offense and defense can only be effective as comparable to the average NBA defense , in it's year.  </p>
    <div id="authorTitle">
      By: <a id="me" href="https://bsky.app/profile/truesync.bsky.social">Nathan Harris</a>     <a href="https://bsky.app/profile/truesync.bsky.social">@truesync.bsky.social</a> <a href="http://nathanharris.co">nathanharris.co</a> 
    </div>

  </div>
    <div id="chart-1-title" class="a-chart-title"> Offensive Ratings</div>
    <div id="chart_1" ></div>
  </div>
  <div>
  <div class="mid-para">
    The underlying drivers of this explosion in offense is not something that one team has been able to monopolize and has spread to all 30 teams. For example when the Warriors destroyed the record for threes in a season
    we saw other teams ie the Celtics blow past that record and now every team shoots more threes. Both external factors and internal factors have been quickly adopted and propagated across the league. 

    <p>
     Looking at Defensive effeciency numbers highlights how no team has been able to develope a defensive strategy to nullify the underlying drivers of Modern NBA offensive explosion. Every year collectively NBA Defenses now have trended down.
     With the Average NBA Defense 5.91 points worse than the worst NBA Defense in 1998.
    </p>
  </div>
  </div>
  <div>
  <div id="chart-2-title" class="a-chart-title"> Deffensive Ratings</div>
    <div id="chart_2" ></div>
  </div>
  </div>
`

createChart(document.querySelector('#chart_1'), document.querySelector('#chart_2'));

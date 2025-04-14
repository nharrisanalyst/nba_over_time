import * as d3 from 'd3';
import { annotationLabel, annotation, annotationCalloutCircle } from 'd3-svg-annotation';
import { variance } from 'simple-statistics';



const avg_line_color = 'grey';

export async function createChart(element_1, element_2){
   const nba_data = await d3.csv('/data/nba_advanced_year.csv',d=>({
    team_name:d.TEAM_NAME,
    off_rating:Number(d.OFF_RATING),
    def_rating:Number(d.DEF_RATING),
    year:d.year,
    year_date: new Date(d.year.split('-')[0])
   }));
   const years = nba_data.map(d=> d.year);
   const years_distinc  = [...new Set(years)];
   
   const years_groupby_year =[];
   years_distinc.forEach(y=>{
       const single_year_data = nba_data.filter(d=> d.year==y);
       years_groupby_year.push(single_year_data);
   })
 console.log(years_distinc);
 console.log(years_groupby_year);
 console.log('nba_data',nba_data)
 const agg_stats_off = years_groupby_year.map(d_year=>({
      year:d_year[0].year,
      min: d3.min(d_year, d=>d.off_rating),
      max: d3.max(d_year, d=>d.off_rating),
      avg: d3.mean(d_year, d=>d.off_rating),
      variance:variance(d_year.map(d=>d.off_rating)),
      year_date:d_year[0].year_date
 })).filter(d=>d.year !='2024-25')
  console.log(agg_stats_off)
 const agg_stats_def = years_groupby_year.map(d_year=>({
    year:d_year[0].year,
    min: d3.min(d_year, d=>d.def_rating),
    max: d3.max(d_year, d=>d.def_rating),
    avg: d3.mean(d_year, d=>d.def_rating),
    variance:variance(d_year.map(d=>d.def_rating)),
    year_date:d_year[0].year_date
})).filter(d=>d.year !='2024-25')

 console.log(agg_stats_off, agg_stats_def);

//chart 

const margin ={t:60,r:70,b:200,l:45};
const height = 740 - (margin.b + margin.t);
const width = 958- (margin.l + margin.r);
const svg_offense = d3.select(element_1).append('svg').attr('height', height + (margin.b + margin.t)).attr('width', width + (margin.l + margin.r));

const mainG_off = svg_offense.append('g').attr('transform', `translate(${margin.l},${margin.t})`)
//scales
const xScale= d3.scaleTime(d3.extent(agg_stats_off, d=> d.year_date),[0,width])
const yScale= d3.scaleLinear([d3.min(agg_stats_off, d=>d.min), d3.max(agg_stats_def, d=>d.max)], [height, 0]).nice()

const yScaleDeff = d3.scaleLinear([d3.min(agg_stats_def, d=>d.min), d3.max(agg_stats_def, d=>d.max)], [0,height]).nice();

//axis 1
mainG_off.append('g').attr('class', 'y-axis').attr("transform", `translate(0,0)`)
                                            .call(d3.axisLeft(yScale))
                                            .call(g => g.select(".domain").remove())
                                            .call(g => g.selectAll(".tick line").clone()
                                                .attr("x2", width  )
                                                .attr("stroke-opacity", 0.1))
                                            .call(g => g.append("text")
                                                .attr("x",  - margin.l)
                                                .attr("y", 10)
                                                .attr("fill", "currentColor")
                                                .attr("text-anchor", "start"))
//deffining second  chart                                               

const svg_deff = d3.select(element_2).append('svg').attr('height', height + (margin.r + margin.l)).attr('width', width + (margin.l + margin.r));

const mainG_deff = svg_deff.append('g').attr('transform', `translate(${margin.l},${margin.t})`)



mainG_off.append('g').attr('class', 'x-axis')
                     .attr('transform', `translate(0, ${height})`)
                     .call(d3.axisBottom(xScale))

mainG_deff.append('g').attr('class', 'y-axis').attr("transform", `translate(0,0)`)
                     .call(d3.axisLeft(yScaleDeff))
                     .call(g => g.select(".domain").remove())
                     .call(g => g.selectAll(".tick line").clone()
                         .attr("x2", width  )
                         .attr("stroke-opacity", 0.1))
                     .call(g => g.append("text")
                         .attr("x",  - margin.l)
                         .attr("y", 10)
                         .attr("fill", "currentColor")
                         .attr("text-anchor", "start"))
                         

const max_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.max))
const min_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.min))
const mean_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.avg))


  // add three point data line 
  let data_three = agg_stats_off.filter(d=>['1998-99', '2013-14', '2023-24'].includes(d.year));
  const data_for_threes ={
      '1998-99':{total_three:'19k', text:'<- 19k total 3PA', offset:2},
      '2013-14':{total_three:'52k', text:'<- 52k total 3PA', offset:2},
      '2023-24':{total_three:'86k', text:'86k total 3PA ->', offset:-85}
  }
  data_three = data_three.map(d=>({...d, ...data_for_threes[d.year]}) )
  const addThreePointsLines = (selection, data) =>{
      selection.append('g').selectAll().data(data).join('line')
                                      .attr('x1', d=>xScale(d.year_date)).attr('x2', d=>xScale(d.year_date))
                                      .attr('y1',-10).attr('y2',height)
                                      .attr('stroke',avg_line_color)
                                      .attr('opacity', 0.65)
                                      .attr('stroke-dasharray','5 5')

      selection.append('g').selectAll().data(data).join('text')
                                      .attr('x', d=>xScale(d.year_date))
                                      .attr('y2',height)
                                      .attr('fill', avg_line_color)
                                      .attr('font-size', '10px')
                                      .attr('transform', d=>`translate(${d.offset},-2)`)
                                      .text(d=> d.text)
  }

  mainG_off.append('g').call(addThreePointsLines, data_three)
  mainG_deff.append('g').call(addThreePointsLines, data_three)

//visuals 
console.log('agg_stats_off',agg_stats_off)
mainG_off.append('g').append('path').attr('d', max_line(agg_stats_off)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_off.append('g').append('path').attr('d', max_line(agg_stats_off)).attr('stroke', '#1D428A').attr('stroke-width', 1.5).attr('fill', 'none')

mainG_off.append('g').append('path').attr('d', min_line(agg_stats_off)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_off.append('g').append('path').attr('d', min_line(agg_stats_off)).attr('stroke', '#C8102E').attr('stroke-width', 1.5).attr('fill', 'none')

mainG_off.append('g').append('path').attr('d', mean_line(agg_stats_off))
                                     .attr('stroke', 'white').attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')
mainG_off.append('g').append('path').attr('d', mean_line(agg_stats_off))
                                    .attr('stroke', avg_line_color).attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')

//visuals 2 





//axis 2 

//axis 1






mainG_deff.append('g').attr('class', 'x-axis')
                     .attr('transform', `translate(0, ${height})`)
                     .call(d3.axisBottom(xScale))

const max_line_deff = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScaleDeff(d.max))
const min_line_deff = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScaleDeff(d.min))
const mean_line_deff = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScaleDeff(d.avg))
                    
                    
mainG_deff.append('g').append('path').attr('d', max_line_deff(agg_stats_def)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_deff.append('g').append('path').attr('d', max_line_deff(agg_stats_def)).attr('stroke', '#C8102E').attr('stroke-width', 1.5).attr('fill', 'none')
                    
mainG_deff.append('g').append('path').attr('d', min_line_deff(agg_stats_def)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_deff.append('g').append('path').attr('d', min_line_deff(agg_stats_def)).attr('stroke', '#1D428A').attr('stroke-width', 1.5).attr('fill', 'none')
                    
mainG_deff.append('g').append('path').attr('d', mean_line_deff(agg_stats_def))
                                                         .attr('stroke', 'white').attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')
mainG_deff.append('g').append('path').attr('d', mean_line_deff(agg_stats_def))
                                                        .attr('stroke', avg_line_color).attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')

//Leged_1 
//legend type {text:, dashArray:, fill:}

const legend_off_data =[{text:"Best Team Offense", dashArray:"0", fill:'#1D428A' }, 
                        {text:"Avg Team Offense",dashArray:"5 5", fill:'grey'}, 
                        {text:"Worst Team Offense", dashArray:"0", fill:'#C8102E'}];

function legend(selection, data){
    selection.append('g').attr('class','legend').selectAll().data(data).join('g').attr('transform',(d,i)=>`translate(${i * 135},0)`).each(function(p, j){
        d3.select(this).append('g').append('line').attr('stroke', p=>p.fill).attr('stroke-width', '1.5')
                                    .attr('stroke-dasharray', p=>p.dashArray).attr('x1', 0).attr('x2', 25).attr('y1', -2.5).attr('y2', -2.5)
        d3.select(this).append('g').attr('transform', 'translate(30,0)').attr('fill', 'grey').attr('font-size', '10px').append('text').text(p=>p.text)
    })
}

mainG_off.append('g').attr('class','legend').attr('transform', `translate(${-18},${height + 40})`).call(legend,legend_off_data);

const legend_def_data =[{text:"Best Team Defense", dashArray:"0", fill:'#1D428A' }, 
                        {text:"Avg Team Defense",dashArray:"5 5", fill:'lightgrey'}, 
                        {text:"Worst Team Defense", dashArray:"0", fill:'#C8102E'}];

mainG_deff.append('g').attr('class','legend').attr('transform', `translate(${-18},${height + 40})`).call(legend,legend_def_data);

//anotations

const data_2022 = agg_stats_off.filter(d=>d.year==='2022-23')
const anot_22_type = annotationLabel;
const annoOff22 = [
    {
      note: {
        label: "",
        title: "The Hornets posted an Off Rating of 108.4",
        wrap:200
      },
      data:data_2022[0],
      connector: {
        end: "arrow",        // Can be none, or arrow or dot
        type: "line",      // ?? don't know what it does
        lineType : "vertical",    // ?? don't know what it does
        //endScale: 2     // dot size
      },
      color: ["grey"],
      dy: 125,
      dx: -10

    }
 ]

 const makeOff22Anno = annotation().notePadding(0).type(anot_22_type).accessors({
    x: d => xScale(d.year_date)+0.5,
    y: d => yScale(d.min)+3,
  }).annotations(annoOff22);

  mainG_off.append('g').call(makeOff22Anno)

  //annoitation two
  const data_2018 = agg_stats_off.filter(d=>d.year==='2018-19')
  const anot_2_type  =  annotationLabel;
  const anno_2 = [
    {
      note: {
        label: "this off rating the worst rating of the 2022 season. This rating is 1.8 points higher than the league leading 1998 Pacers",
        title: "Avg, Best and Worst Offenses has all gone up.",
        wrap:200
      },
      data:data_2018[0],
      connector: {
        end: "arrow",        // Can be none, or arrow or dot
        type: "line",      // ?? don't know what it does
        lineType : "vertical",    // ?? don't know what it does
        //endScale: 2     // dot size
      },
      color: ["grey"],
      dy: 325,
      dx: -10

    }
 ]

 const makeAnon_2 = annotation().notePadding(0).type(anot_2_type).accessors({
  x: d => xScale(d.year_date),
  y: d => yScale(d.avg) +45,
}).annotations(anno_2);

mainG_off.append('g').call(makeAnon_2)


//annoitation three
const data_2018_deff = agg_stats_def.filter(d=>d.year==='2018-19')
const anot_3_type  =  annotationLabel;
const anno_3 = [
  {
    note: {
      label: "Best Wrose and Avg defense have all gone down with teams only finding solutions relative to eachother.",
      title:"Defense has gone down in Tandem" ,
      wrap:175
    },
    data:data_2018_deff[0],
    connector: {
      end: "arrow",        // Can be none, or arrow or dot
      type: "line",      // ?? don't know what it does
      lineType : "vertical",    // ?? don't know what it does
      //endScale: 2     // dot size
    },
    color: ["grey"],
    dy: -135,
    dx: 10

  }
]

const makeAnon_3 = annotation().notePadding(0).type(anot_3_type).accessors({
x: d => xScale(d.year_date),
y: d => yScaleDeff(d.avg) - 20,
}).annotations(anno_3);

mainG_deff.append('g').call(makeAnon_3)


  //append text 
    mainG_off.append('g').selectAll().data(data_2022).join('text')
                                    .attr('x', d=>xScale(d.year_date)-14).attr('y', d=>yScale(d.min)-2).attr('fill', '#C8102E')
                                    .attr('font-size', '12px')
                                    .text(d=>d.min)

    mainG_off.append('g').selectAll().data(agg_stats_off.filter(d=>d.year==='1998-99')).join('text')
                                    .attr('x', d=>xScale(d.year_date)-14).attr('y', d=>yScale(d.max)+10).attr('fill', '#1D428A')
                                    .attr('font-size', '12px')
                                    .text(d=>d.max)
    
    
  
}



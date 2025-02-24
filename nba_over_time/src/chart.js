import * as d3 from 'd3';

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
      year_date:d_year[0].year_date
 }))

 const agg_stats_def = years_groupby_year.map(d_year=>({
    year:d_year[0].year,
    min: d3.min(d_year, d=>d.def_rating),
    max: d3.max(d_year, d=>d.def_rating),
    avg: d3.mean(d_year, d=>d.def_rating),
    year_date:d_year[0].year_date
}))

 console.log(agg_stats_off, agg_stats_def);

//chart 

const margin ={t:20,r:20,b:20,l:45};
const height = 500 - (margin.r + margin.l);
const width = 928- (margin.t + margin.b);
const svg_offense = d3.select(element_1).append('svg').attr('height', height + (margin.r + margin.l)).attr('width', width + (margin.l + margin.r));

const mainG_off = svg_offense.append('g').attr('transform', `translate(${margin.l},${margin.t})`)
//scales
const xScale= d3.scaleTime(d3.extent(agg_stats_off, d=> d.year_date),[0,width])
const yScale= d3.scaleLinear([d3.min(agg_stats_off, d=>d.min), d3.max(agg_stats_def, d=>d.max)], [height, 0]).nice()

//axis 1
mainG_off.append('g').attr('class', 'y-axis').attr("transform", `translate(${margin.l}},0)`)
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
                                                





mainG_off.append('g').attr('class', 'x-axis')
                     .attr('transform', `translate(0, ${height})`)
                     .call(d3.axisBottom(xScale))
                     

const max_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.max))
const min_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.min))
const mean_line = d3.line()
                    .x(d=>xScale(d.year_date))
                    .y(d=>yScale(d.avg))


//visuals 
console.log('agg_stats_off',agg_stats_off)
mainG_off.append('g').append('path').attr('d', max_line(agg_stats_off)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_off.append('g').append('path').attr('d', max_line(agg_stats_off)).attr('stroke', '#1D428A').attr('stroke-width', 1.5).attr('fill', 'none')

mainG_off.append('g').append('path').attr('d', min_line(agg_stats_off)).attr('stroke', 'white').attr('stroke-width', 2.5).attr('fill', 'none')
mainG_off.append('g').append('path').attr('d', min_line(agg_stats_off)).attr('stroke', '#C8102E').attr('stroke-width', 1.5).attr('fill', 'none')

mainG_off.append('g').append('path').attr('d', mean_line(agg_stats_off))
                                     .attr('stroke', 'white').attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')
mainG_off.append('g').append('path').attr('d', mean_line(agg_stats_off))
                                    .attr('stroke', 'lightgrey').attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')

//visuals 2 

const svg_deff = d3.select(element_2).append('svg').attr('height', height + (margin.r + margin.l)).attr('width', width + (margin.l + margin.r));

const mainG_deff = svg_deff.append('g').attr('transform', `translate(${margin.l},${margin.t})`)

const yScaleDeff = d3.scaleLinear([d3.min(agg_stats_def, d=>d.min), d3.max(agg_stats_def, d=>d.max)], [0,height]).nice();

//axis 2 

//axis 1
mainG_deff.append('g').attr('class', 'y-axis').attr("transform", `translate(${margin.l}},0)`)
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
                                                        .attr('stroke', 'lightgrey').attr('stroke-width', 1.5).attr('fill', 'none').attr('stroke-dasharray', '5 5')

}

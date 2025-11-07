import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), 
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    console.log(data);
    return data;
  }
  
function processCommits(data) {
return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    let ret = {
        id: commit,
        url: 'https://github.com/TiantianZheng/lab1_portfolio/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
    };

    Object.defineProperty(ret, 'lines', {
        value: lines,
        enumerable: false,
        configurable: true,
      });
  

    return ret;
    });
}


  



// function renderCommitInfo(data, commits) {
//     // Create the dl element
//     const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
//     // Add total LOC
//     dl.append('dt').html('TOTAL <abbr title="Lines of code">LOC</abbr>');
//     dl.append('dd').text(data.length);
  
//     // Add total commits
//     dl.append('dt').text('COMMITS');
//     dl.append('dd').text(commits.length);
  
//     // Add more stats as needed...
//     const numFiles = d3.group(data, (d) => d.file).size;
//     dl.append('dt').text('FILES');
//     dl.append('dd').text(numFiles);

//     const fileLengths = d3.rollups(
//         data,
//         (v) => d3.max(v, (d) => d.line),
//         (d) => d.file
//       );
    
//       // Longest file
//       const longestFile = d3.greatest(fileLengths, (d) => d[1]);
//       dl.append('dt').text('LONGEST FILE');
//       dl.append('dd').text(`${longestFile[0]} (${longestFile[1]} lines)`);
    
//       // Average file length
//       const avgFileLength = d3.mean(fileLengths, (d) => d[1]);
//       dl.append('dt').text('AVG FILE LENGTH');
//       dl.append('dd').text(avgFileLength.toFixed(2));
    
//       // Most work done in (morning/afternoon/night)
//       const workByPeriod = d3.rollups(
//         data,
//         (v) => v.length,
//         (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
//       );
//       const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
//       dl.append('dt').text('MOST WORK DONE IN');
//       dl.append('dd').text(maxPeriod ?? 'N/A');
//   }

function renderCommitInfo(data, commits) {
    const container = d3.select('#stats').append('div').attr('class', 'stats');
  
    function addStat(label, value) {
      const card = container.append('div').attr('class', 'stat');
      card.append('dt').text(label);
      card.append('dd').text(value);
    }
  
    addStat('COMMITS', commits.length);
    addStat('FILES', d3.group(data, (d) => d.file).size);
    addStat('TOTAL LOC', data.length);
    addStat('AVG FILE LENGTH', d3.mean(
      d3.rollups(data, (v) => d3.max(v, (d) => d.line), (d) => d.file),
      (d) => d[1]
    ).toFixed(2));
  
    addStat('MAX DEPTH', d3.max(data, (d) => d.depth));
    addStat('LONGEST LINE', d3.max(data, (d) => d.length));
    // addStat('MOST WORK DONE IN', (() => {
    //   const workByPeriod = d3.rollups(
    //     data,
    //     (v) => v.length,
    //     (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    //   );
    //   return d3.greatest(workByPeriod, (d) => d[1])?.[0] ?? 'N/A';
    // })());
  }


let data = await loadData();
let commits = processCommits(data);  
renderCommitInfo(data, commits);

function renderTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const author = document.getElementById('commit-author');
    const lines = document.getElementById('commit-lines');
  
    if (Object.keys(commit).length === 0) return;
  
    link.href = commit.url;
    link.textContent = commit.id.slice(0, 7); 
    date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
    });
    author.textContent = commit.author || 'Unknown';
    lines.textContent = commit.totalLines;
}

renderTooltipContent(commit);


function renderScatterPlot(data, commits) {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 20 }

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
      };
   
      
    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

    const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice()
    ;
    

    const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);

    const gridlines = svg.append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

    gridlines.call(
    d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width)
    );


    const xAxis = d3.axisBottom(xScale);
    // const locale = d3.timeFormatLocale({
    //     dateTime: "%x, %X",
    //     date: "%-m/%-d/%Y",
    //     time: "%-I:%M:%S %p",
    //     periods: ["AM", "PM"],
    //     days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    //     shortDays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    //     months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    //     shortMonths: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    //   });
      
    // const xAxis = d3.axisBottom(xScale)
    // .tickFormat(locale.format("%b %d"));
    const yAxis = d3.axisLeft(yScale)
    .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');

    // Add X axis

    svg.append("g")
    .attr("transform", `translate(0, ${usableArea.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end");
    
    // Add Y axis
    svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

    
    const dots = svg.append('g').attr('class', 'dots');

    dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', 5)
    .attr('fill', 'steelblue');

}
renderScatterPlot(data, commits);


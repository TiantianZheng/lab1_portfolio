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
  
    // addStat('MAX DEPTH', d3.max(data, (d) => d.depth));
    addStat('LONGEST LINE', d3.max(data, (d) => d.length));
    addStat('MOST WORK DONE IN', (() => {
      const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
      );
      return d3.greatest(workByPeriod, (d) => d[1])?.[0] ?? 'N/A';
    })());
  }


let data = await loadData();
let commits = processCommits(data);  
renderCommitInfo(data, commits);


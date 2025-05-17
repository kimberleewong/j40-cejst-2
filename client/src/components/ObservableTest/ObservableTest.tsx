import React, {useState, useEffect} from 'react';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

interface Props {
  url: string;
}
// import {useFlags} from '../../contexts/FlagContext';

// export const featureURLForTilesetName = (
//     tilesetType: string,
//     // tilesetSubtype: string,
//     tilesetName: string,
// ): string => {
//   const flags = useFlags();

//   const pipelineStagingBaseURL =
//     process.env.GATSBY_CDN_TILES_BASE_URL + `/data-pipeline-staging`;
//   const XYZ_SUFFIX = '{z}/{x}/{y}.pbf';

//   if ('stage_hash' in flags) {
//     const regex = /^[0-9]{4}\/[a-f0-9]{40}$/;
//     if (!regex.test(flags['stage_hash'])) {
//       console.error(COMMON_COPY.CONSOLE_ERROR.STAGE_URL);
//     }

//     return `${pipelineStagingBaseURL}/${flags['stage_hash']}/data/score/tiles/${tilesetName}/${XYZ_SUFFIX}`;
//   } else {
//     const featureTileBaseURL = constants.TILE_BASE_URL;
//     const featureTilePath = constants.TILE_PATH;
//     const mapTilesPath = process.env.GATSBY_MAP_TILES_PATH;

//     const pathParts = [
//       featureTileBaseURL,
//       featureTilePath,
//       mapTilesPath,
//       tilesetType,
//       // tilesetSubtype,
//       tilesetName,
//       XYZ_SUFFIX,
//     ]
//         .filter(Boolean)
//         .map((part) => part.replace(/^\/|\/$/g, '')) // trim leading/trailing slashes
//         .join('/');

//     return pathParts.startsWith('http') ? pathParts : `/${pathParts}`;
//   }
// };

const ObservableTest = ({url}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the data
    // const url =
    //   'http://localhost:5001/data/data-pipeline/data_pipeline/data/score/geojson/burd_dem_long.json';
    console.log('Fetching data from:', url);

    fetch(url)
        .then((response) => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((jsonData) => {
          console.log('Fetched data:', jsonData);

          if (!Array.isArray(jsonData)) {
            throw new Error('The fetched data is not an array.');
          }

          setData(jsonData); // Directly set the row-oriented data
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError('Failed to load data. Please check the file path or server.');
        });
  }, []);

  const racialOrder = [
    'White (Non-Hispanic)',
    'Black or African American',
    'Hispanic or Latino',
    'Other Race',
    'Asian',
    'Native Hawaiian and Pacific Islander',
    'American Indian and Alaskan Native',
  ];

  const racialOrderLegend = [
    'American Indian and Alaskan Native',
    'Native Hawaiian and Pacific Islander',
    'Asian',
    'Other Race',
    'Hispanic or Latino',
    'Black or African American',
    'White (Non-Hispanic)',
  ];

  const colorPalette = [
    '#741CD6',
    '#972843',
    '#6d8ef7',
    '#1E6A9C',
    '#DC267F',
    '#9CBF5D',
    '#FE6100',
  ];

  const sortedData = data.sort(
      (a, b) =>
        racialOrder.indexOf(a.racial_group) - racialOrder.indexOf(b.racial_group),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const chart = Plot.plot({
        marks: [
          Plot.barY(sortedData, {
            x: 'total_burdens',
            y: 'percentage',
            fill: 'racial_group',
            tip: {
              format: {
                racial_group: (d) => d.replace(' and ', ' and<br>'),
                y: (d) => `${Math.round(d)}%`,
              },
            },
          }),
        ],
        y: {axis: true, label: 'Percentage'},
        x: {label: 'Burden Thresholds Exceeded'},
        color: {
          range: colorPalette,
          legend: true,
          label: 'Race/Ethnicity',
          domain: racialOrderLegend,
        },
        marginBottom: 45,
        marginTop: 30,
        style: {
          fontFamily: 'Lexend, sans-serif',
          fontSize: '16px',
        },
      });

      const container = document.getElementById('chart-container-1');
      if (container) {
        container.innerHTML = ''; // Clear any previous chart
        container.appendChild(chart);
      }

      // Animation on load
      const svg = d3.select(chart);
      const bars = svg.selectAll('rect');

      // Store original values
      bars.each((_, i, nodes) => {
        const bar = d3.select(nodes[i]);
        bar.attr('data-final-y', bar.attr('y'));
        bar.attr('data-final-height', bar.attr('height'));
      });

      // Start from base (y = chart height, height = 0)
      bars
          .attr('y', svg.node()?.getBoundingClientRect().height || 300) // use fallback
          .attr('height', 0)
          .transition()
          .duration(800)
          .delay((_, i) => i * 10) // optional stagger
          .attr('y', (_, i, nodes) => {
            return d3.select(nodes[i]).attr('data-final-y');
          })
          .attr('height', (_, i, nodes) => {
            return d3.select(nodes[i]).attr('data-final-height');
          });

      // Manually style legend because I couldn't get it to work inside observable
      const legendSpans = container?.querySelectorAll('span');
      legendSpans?.forEach((span) => {
        span.style.fontSize = '14px';
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.marginRight = '1em';
        span.style.gap = '0.4em';
        span.style.fontFamily = 'Lexend, sans-serif';

        const svg = span.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '17');
          svg.setAttribute('height', '17');
        }
      });

      return () => chart.remove();
    }, 0); // Let the browser render layout first

    return () => clearTimeout(timeout);
  }, [sortedData]);

  if (error) {
    return <div style={{color: 'red'}}>{error}</div>;
  }

  if (sortedData.length === 0) {
    return <div>Loading Data...</div>;
  }

  return <div id="chart-container-1" />;
};

export default ObservableTest;

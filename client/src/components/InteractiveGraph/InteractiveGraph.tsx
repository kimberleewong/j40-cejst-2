import React, {useEffect, useRef, useState} from 'react';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

interface Datum {
  state: string;
  county: string;
  burden: string;
  indicator: string;
  value: number;
  percentile?: number;
}

interface Props {
  url: string;
}

const InteractiveGraph = ({url}: Props) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<Datum[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the data from the provided URL
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

          setData(jsonData); // Set the fetched data
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError('Failed to load data. Please check the file path or server.');
        });
  }, [url]);

  // Define states
  const states = Array.from(new Set(data.map((d) => d.state))).sort();
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedBurden, setSelectedBurden] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');

  // Dynamically calculate counties and indicators based on current selections
  const counties = Array.from(
      new Set(data.filter((d) => d.state === selectedState).map((d) => d.county)),
  ).sort();

  const burdenCategories = Array.from(
      new Set(data.map((d) => d.burden)),
  ).sort();

  const indicators = Array.from(
      new Set(
          data
              .filter(
                  (d) =>
                    (!selectedState || d.state === selectedState) &&
            (!selectedCounty || d.county === selectedCounty) &&
            (!selectedBurden || d.burden === selectedBurden),
              )
              .map((d) => d.indicator),
      ),
  ).sort();

  const burdenLabelMap: { [key: string]: string } = {
    climate: 'Climate',
    energy: 'Energy',
    health: 'Health',
    housing: 'Housing',
    pollution: 'Pollution',
    transportation: 'Transportation',
    water: 'Water & Wastewater',
    workforce: 'Workforce Development',
  };

  const indicatorLabelMap: { [key: string]: string } = {
    EALR_PFS: 'Expected agriculture loss rate',
    EBLR_PFS: 'Expected building loss rate',
    EPLR_PFS: 'Expected population loss rate',
    FLD_PFS: 'Projected flood risk',
    WFR_PFS: 'Projected wildfire risk',
    EBF_PFS: 'Energy burden',
    PM25F_PFS: 'PM2.5 pollution',
    DSF_PFS: 'Diesel particulate matter',
    TF_PFS: 'Traffic proximity',
    TD_PFS: 'DOT travel barriers score',
    HBF_PFS: 'Housing burden',
    LPF_PFS: 'Lead paint',
    IS_PFS: 'Lack of greenspace',
    KP_PFS: 'Lack of indoor plumbing',
    HRS_ET: 'Historic redlining',
    TSDF_PFS: 'Proximity to hazardous waste sites',
    NPL_PFS: 'Proximity to NPL sites',
    RMP_PFS: 'Proximity to RMP sites',
    FUDS_ET: 'Former US Defense Site',
    AML_ET: 'Abandoned mine present',
    WF_PFS: 'Wastewater discharge',
    UST_PFS: 'Leaky underground storage tanks',
    AF_PFS: 'Asthma among adults',
    DF_PFS: 'Diabetes among adults',
    HDF_PFS: 'Heart disease among adults',
    LLEF_PFS: 'Low life expectancy',
    LMI_PFS: 'Low median household income',
    LIF_PFS: 'Linguistic isolation',
    UF_PFS: 'Unemployment',
    P100_PFS: '% below federal poverty line',
  };

  // Update selectedCounty and selectedIndicator when dependencies change
  useEffect(() => {
    if (counties.length > 0) {
      setSelectedCounty('');
    }
  }, [selectedState]);

  useEffect(() => {
    if (indicators.length > 0) {
      setSelectedIndicator('');
    }
  }, [selectedBurden]);

  // Filter and aggregate
  const filteredData = selectedState ?
    data.filter(
        (d) =>
          d.state === selectedState &&
          (!selectedCounty || d.county === selectedCounty) &&
          (!selectedBurden || d.burden === selectedBurden) &&
          (!selectedIndicator || d.indicator === selectedIndicator),
    ) :
    [];
  console.log('Filtered Data:', filteredData);

  const scaledData = filteredData.map((d) => ({
    ...d,
    percentile: d.value * 100,
  }));
  console.log('Scaled Data:', scaledData);

  useEffect(() => {
    const chart = Plot.plot({
      y: {
        label: 'Number of Census Tracts',
        tickFormat: d3.format('~s'),
      },
      x: {
        domain: [0, 100],
        label: 'Percentile',
        tickFormat: (d) => `${d}%`,
      },
      color: {scheme: 'PuRd'},
      style: {
        fontFamily: 'Lexend, sans-serif',
        fontSize: '16px',
      },
      marginBottom: 45,
      marginTop: 30,
      marginLeft: 60,
      // marks: [
      //   Plot.rectY(bins, {
      //     x1: (d) => d.x0,
      //     x2: (d) => d.x1,
      //     y: (d) => d.length,
      //     fill: (d) => d.avgPercentile,
      //     tip: true,
      //     title: (d) =>
      //       [
      //         `Range: ${d.x0}–${d.x1}`,
      //         `Count: ${d.length}`,
      //         // `Avg Percentile: ${d.avgPercentile.toFixed(0)}%`,
      //       ].join('\n'),
      //   }),
      //   Plot.ruleY([0]),
      // ],
      marks: [
        // Plot.boxY(filteredData, {
        //   x: 'indicator',
        //   y: 'value',
        // }),
        Plot.rectY(
            scaledData,
            Plot.binX(
                {y: 'count', fill: 'mean'},
                {x: 'percentile', fill: 'percentile'},
            ),
        ),
        Plot.ruleY([0]),
      ],
      width: 750,
      height: 500,
    });

    if (chartRef.current) {
      chartRef.current.innerHTML = '';
      chartRef.current.appendChild(chart);
    }
  }, [scaledData]);

  if (error) {
    return <div style={{color: 'red'}}>{error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <div style={{margin: '1rem'}}>
        <label style={{marginRight: '0.8rem', marginBottom: '0.8rem'}}>
          State:
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">-- Select a State --</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          County:
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
          >
            <option value="">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <br></br>
        <label style={{marginRight: '0.8rem', marginTop: '0.8rem'}}>
          Burden:
          <select
            value={selectedBurden}
            onChange={(e) => setSelectedBurden(e.target.value)}
          >
            <option value="">All Burdens</option>
            {burdenCategories.map((b) => (
              <option key={b} value={b}>
                {burdenLabelMap[b] || b}
              </option>
            ))}
          </select>
        </label>

        <label>
          Indicator:
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
          >
            <option value="">All Indicators</option>
            {indicators.map((i) => (
              <option key={i} value={i}>
                {indicatorLabelMap[i] || i}
              </option>
            ))}
          </select>
        </label>
        <div style={{position: 'relative', width: '750px', height: '500px'}}>
          {!selectedState && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.2rem',
                color: '#555',
                textAlign: 'center',
                fontWeight: 'bold',
                background: 'rgba(255, 255, 255)',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              Please select a state to view the data.
            </div>
          )}
          <div ref={chartRef}></div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGraph;

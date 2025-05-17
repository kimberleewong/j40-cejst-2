import * as React from 'react';
import J40MainGridContainer from '../components/J40MainGridContainer';
import {Grid} from '@trussworks/react-uswds';
import Layout from '../components/layout';

import InteractiveGraph from '../components/InteractiveGraph';
import ObservableTest from '../components/ObservableTest';
import IndicatorDemGraph from '../components/IndicatorDemGraph';

import * as styles from './newStyles.module.scss';

interface IDataPageProps {
  location: Location;
}

export const onRenderBody = ({setHeadComponents}) => {
  setHeadComponents([
    <link
      key="lexend-font"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Lexend&display=swap"
    />,
  ]);
};

const DataPage = ({location}: IDataPageProps) => {
  return (
    <Layout location={location} title={'Observable'}>
      <J40MainGridContainer fullWidth>
        <div style={{maxWidth: '90%', margin: '0 auto', padding: '0 1rem'}}>
          <section className={'page-heading'}>
            <h1>Explore the Data</h1>
          </section>
          <div>
            <p>
              This page houses dynamic and interactive data visualizations of
              the data from the map. With over 73,000 census tracts and 31
              unique indicators, the CEJST+ tool is a hub of data representing
              climate and economic justice.
            </p>
          </div>
          <Grid row gap={6}>
            {/* First column */}
            <Grid desktop={{col: 6}} col={12}>
              <div id="chart-container-1" className={styles.plotWrapper}>
                <ObservableTest
                  url={
                    'http://localhost:5001/data/data-pipeline/data_pipeline/data/score/geojson/burd_dem_long.json'
                  }
                ></ObservableTest>
              </div>
              <div id="chart-container-int">
                <InteractiveGraph url="http://localhost:5001/data/data-pipeline/data_pipeline/data/score/geojson/tract_total.json"></InteractiveGraph>
              </div>
            </Grid>

            {/* Second Column */}
            <Grid desktop={{col: 6}} col={12}>
              <div id="chart-container-2" className={styles.plotWrapper}>
                <IndicatorDemGraph url="http://localhost:5001/data/data-pipeline/data_pipeline/data/score/geojson/ind_dem_long.json"></IndicatorDemGraph>
              </div>
            </Grid>
          </Grid>
        </div>
      </J40MainGridContainer>
    </Layout>
  );
};

export default DataPage;

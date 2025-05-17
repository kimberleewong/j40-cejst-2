import {Grid} from '@trussworks/react-uswds';
import {useIntl} from 'gatsby-plugin-intl';
import * as React from 'react';
import {useWindowSize} from 'react-use';

import Categories from '../components/Categories';
import DatasetContainer from '../components/DatasetContainer';
// import DatasetsButton from '../components/DatasetsButton';
import J40MainGridContainer from '../components/J40MainGridContainer';
import Layout from '../components/layout';
import SubPageNav from '../components/SubPageNav';

// import {DATA_SURVEY_LINKS, PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
import {PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
import * as METHODOLOGY_COPY from '../data/copy/methodology';

interface MethodPageProps {
  location: Location;
}

const IndexPage = ({location}: MethodPageProps) => {
  const intl = useIntl();
  const {width} = useWindowSize();

  return (
    <Layout
      location={location}
      title={intl.formatMessage(METHODOLOGY_COPY.PAGE.TITLE)}
    >
      <J40MainGridContainer>
        {/* <div style={{maxWidth: '90%', margin: 'auto'}}> */}
        <section className={'page-heading'}>
          <h1>{intl.formatMessage(METHODOLOGY_COPY.PAGE.HEADING)}</h1>
          {/* <DatasetsButton href= {intl.locale === 'es' ? DATA_SURVEY_LINKS.ES : DATA_SURVEY_LINKS.EN} /> */}
        </section>

        <Grid row gap className={'j40-mt3'}>
          {/* First column */}
          <Grid col={12} tablet={{col: 8}}>
            <section>
              <h2> Cumulative Layers</h2>
              <p>
                The cumulative analysis takes the total number of burden or
                indicator thresholds exceeded in a census tract to create a
                ranked score of burden. This method pulls from established
                practices for evaluating cumulative impacts in geospatial
                mapping tools.
              </p>
              <p>Each census tract receives:</p>
              <ul>
                <li>
                  <p>A burden score from 0-8</p>
                </li>
                <li>
                  <p>An indicator score from 0-31</p>
                </li>
              </ul>
              <p>
                It is important to note that while there are 31 indicators used
                in the analysis, no census tract exceeds more than 18 total
                indicators.
              </p>

              <h2>Hotspot Layers</h2>
              <p>
                Hotspot analysis was calculated using{' '}
                <a
                  className={'usa-link'}
                  href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-statistics/h-how-hot-spot-analysis-getis-ord-gi-spatial-stati.htm"
                >
                  Getis-Ord Gi*
                </a>
                , a statistic to identify spatial clusters. This method finds
                census tracts where the total burdens or indicators are
                significantly higher (&quot;hot spots&quot;) or lower
                (&quot;cold spots&quot;) than the national average.
              </p>
              <p>Key steps include:</p>
              <ol>
                <li>
                  <p>
                    Calculating local sums of thresholds exceeded for each
                    census tract and its neighbors
                  </p>
                </li>
                <li>
                  <p>
                    Comparing local sums to the global sum minus the local
                    values. This is done by standardizing the sums to a{' '}
                    <a
                      className={'usa-link'}
                      href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-statistics/what-is-a-z-score-what-is-a-p-value.htm"
                    >
                      z-score
                    </a>
                    , also known as the standardized Gi* value.
                  </p>
                </li>
                <li>
                  <p>
                    In addition to the z-score, the calculation generates a{' '}
                    <a
                      className={'usa-link'}
                      href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-statistics/what-is-a-z-score-what-is-a-p-value.htm"
                    >
                      p-value
                    </a>{' '}
                    that is interpreted into hot spots or cold spots. The
                    p-values here are slightly different because they are
                    interpreted with a positive or negative sign. The direction
                    is important to note whether an area is significantly hot,
                    or significantly cold.
                  </p>
                </li>
                <ul>
                  <li>
                    <p>High positives: Hot spots</p>
                  </li>
                  <li>
                    <p>High negatives: Cold spots</p>
                  </li>
                </ul>
              </ol>
              <p>
                Gi* calculations were completed with the program{' '}
                <a className={'usa-link'} href="https://geodacenter.github.io/">
                  GeoDa
                </a>{' '}
              </p>
              <h2>Legacy Layer</h2>
              <p>{intl.formatMessage(METHODOLOGY_COPY.PAGE.PARA1)}</p>

              <div>
                <ul>
                  <li>
                    <p>
                      {intl.formatMessage(METHODOLOGY_COPY.PAGE.PARA1_BULLET1)}
                    </p>
                  </li>
                  <li>
                    <p>
                      {intl.formatMessage(METHODOLOGY_COPY.PAGE.PARA1_BULLET2)}
                    </p>
                  </li>
                  <li>
                    <p>
                      {intl.formatMessage(METHODOLOGY_COPY.PAGE.PARA1_BULLET3)}
                    </p>
                    <ul>
                      <li>
                        <p>
                          {intl.formatMessage(
                              METHODOLOGY_COPY.PAGE.PARA1_BULLET3_2,
                          )}
                        </p>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <p>
                      {intl.formatMessage(METHODOLOGY_COPY.PAGE.PARA1_BULLET4)}
                    </p>
                  </li>
                </ul>
              </div>
            </section>
          </Grid>

          {/* Second column, spacer */}
          <Grid col={12} tablet={{col: 1}}></Grid>

          {/* Third column */}
          {width > USWDS_BREAKPOINTS.DESKTOP ? (
            <Grid col={12} tablet={{col: 3}}>
              <SubPageNav
                activeSubPageIndex={2}
                endPoints={[
                  PAGES_ENDPOINTS.ABOUT,
                  PAGES_ENDPOINTS.DOWNLOADS,
                  PAGES_ENDPOINTS.METHODOLOGY,
                  PAGES_ENDPOINTS.CONTACT,
                ]}
              />
            </Grid>
          ) : (
            ''
          )}
        </Grid>
        {/* </div> */}
      </J40MainGridContainer>
      <Categories />
      <DatasetContainer />
    </Layout>
  );
};

export default IndexPage;

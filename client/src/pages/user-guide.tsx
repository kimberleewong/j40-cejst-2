import {Grid} from '@trussworks/react-uswds';
import * as React from 'react';
import {useWindowSize} from 'react-use';

import J40MainGridContainer from '../components/J40MainGridContainer';
import Layout from '../components/layout';
// import ReleaseUpdate from '../components/ReleaseUpdate';
import SubPageNav from '../components/SubPageNav';

import {PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
// import * as DOWNLOADS_COPY from '../data/copy/downloads';
interface IDownloadsPageProps {
  location: Location;
}

const DownloadsPage = ({location}: IDownloadsPageProps) => {
  // const intl = useIntl();
  const {width} = useWindowSize();

  return (
    <Layout location={location} title="User guide">
      <J40MainGridContainer>
        <section className={'page-heading'}>
          <h1>User Guide: CEJST+</h1>
        </section>

        <Grid row gap className={'j40-mb5-mt3'}>
          <Grid col={12} tablet={{col: 8}}>
            {/* <h2 className={'j40-mt-0 j40-mb-3'}>User Manual: CEJST+</h2> */}
            <h2>1. Introduction</h2>
            <p>
              Welcome to the CEJST+, an extension of the original Climate and
              Economic Justice Screening Tool (CEJST). This web application
              helps users visualize and analyze multiple environmental, climate,
              health, and socioeconomic burdens across U.S. census tracts.
              Unlike the original CEJST&apos;s binary approach, this tool
              provides a comprehensive view of cumulative impacts to better
              inform resource allocation.
            </p>
            <h2>2. Getting Started</h2>
            <h3>Accessing the Application</h3>
            <ul>
              <li>
                <p>Open your web browser and navigate to INSERT WEBLINK.</p>
              </li>
              <li>
                <p>
                  Ensure you have a stable internet connection for optimal
                  performance.
                </p>
              </li>
            </ul>
            <h3>Understanding the Application Layout</h3>
            <ul>
              <li>
                <p>
                  <strong>Explore the Map Panel:</strong> Home page and the
                  central interactive map displaying census tract data.
                </p>
              </li>
              <li>
                <p>
                  <strong>Explore the Data Panel:</strong> Located in the
                  top-right, contains interactive visualizations of data used
                  for the map.
                </p>
              </li>
              <li>
                <p>
                  <strong>About:</strong> Located at the top-right, contains the
                  user-guide, information relating to methodology and data,
                  contact information, and acknowledgements.
                </p>
              </li>
            </ul>
            <h2>3. Explore the Map</h2>
            <h3>Map Controls</h3>
            <ul>
              <li>
                <p>
                  <strong>Zoom:</strong> Use the &quot;+&quot; and &quot;-&quot;
                  buttons in the top-left corner or your mouse scroll wheel.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pan:</strong> Click and drag anywhere on the map.
                </p>
              </li>
              <li>
                <p>
                  <strong>State/Territory Controls:</strong> Click the states or
                  territories abbreviated on the left of the map to be taken to
                  that area. 48 represents the contiguous United States.
                </p>
              </li>
              <li>
                <p>
                  <strong>Current Location:</strong> Click the location pin icon
                  located next to the search bar to center the map on your
                  location (requires location permissions).
                </p>
              </li>
              <li>
                <p>
                  <strong>Select Layer:</strong> Use the drop down menu in the
                  top-right corner to choose a layer to visualize.
                </p>
              </li>
              <li>
                <p>
                  <strong>Income Filter:</strong> Use the slider above the map
                  to filter census tracts by income percentile.
                </p>
              </li>
            </ul>
            <h3>Switching Map Layers</h3>
            <ol>
              <li>
                <p>
                  Click the Select Layer drop-down menu in the top-right corner
                  of the map.
                </p>
              </li>
              <li>
                <p>Select from the following layers:</p>
                <ul>
                  <li>
                    <p>
                      <strong>Burden Thresholds Exceeded (default):</strong>{' '}
                      Displays total burden counts (0-8) that a census tract
                      exceeds.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Indicator Thresholds Exceeded:</strong> Displays
                      total indicator counts (0-31) that a census tract exceeds.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Burden Hotspots:</strong> Highlights geographic
                      clusters of census tracts with unusually high burden
                      thresholds exceeded (red) or low burdens (blue).
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Indicator Hotspots:</strong> Highlights geographic
                      clusters of census tracts with unusually high indicator
                      thresholds exceeded (red) or low burdens (blue).
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong>Legacy Layer:</strong> Displays the original CEJST
                      tool that shows all disadvantaged and non-disadvantaged
                      census tracts.
                    </p>
                  </li>
                </ul>
              </li>
            </ol>
            <h3>Color Legend</h3>
            <ul>
              <li>
                <p>
                  A color legend appears in the bottom-right corner of the map
                </p>
              </li>
              <li>
                <p>
                  For the cumulative layers, darker colors indicate higher
                  burden/indicator counts
                </p>
              </li>
              <li>
                <p>
                  For the hotspot layers, red indicates hot spots (high
                  clustering), blue indicates cold spots (low clustering)
                </p>
              </li>
              <li>
                <p>For the legacy layer, blue represents DACs</p>
              </li>
            </ul>
            <h2>4. Using the Sidebar</h2>
            <h3>Viewing Census Tract Information</h3>
            <ul>
              <li>
                <p>
                  Click on any census tract on the map to load its detailed
                  information in the sidebar
                </p>
              </li>
              <li>
                <p>The sidebar contains multiple tabs:</p>
                <h4>Summary Tab</h4>
                <ul>
                  <li>
                    <p>Census tract ID and location information</p>
                  </li>
                  <li>
                    <p>Population size and demographic information</p>
                  </li>
                  <li>
                    <p>
                      Cumulative burden/indicator thresholds exceeded count
                      (thresholds exceeded layers)
                    </p>
                  </li>
                  <li>
                    <p>Hotspot/coldspot status (hotspot layers)</p>
                  </li>
                  <li>
                    <p>
                      DAC status under original CEJST methodology (legacy tool
                      layer)
                    </p>
                  </li>
                </ul>
                <h4>Burden/Indicators Tab</h4>
                <ul>
                  <li>
                    <p>
                      All burdens listed with exceeded thresholds highlighted
                    </p>
                  </li>
                  <li>
                    <p>For each burden:</p>
                    <ul>
                      <li>
                        <p>
                          Category name (Climate change, Energy, Health, etc.)
                        </p>
                      </li>
                      <li>
                        <p>
                          Specific indicator values with national percentiles
                        </p>
                      </li>
                      <li>
                        <p>
                          Threshold status (exceeded thresholds are highlighted)
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <h2>5. Explore the Data </h2>
            <h3>Available Charts and Graphs</h3>
            <ul>
              <li>
                <p>
                  <strong>
                    Demographic Comparison of Thresholds Exceeded:
                  </strong>{' '}
                  Charts comparing demographic profiles across burden/indicator
                  thresholds exceeded levels.
                </p>
              </li>
              <li>
                <p>
                  <strong>Demographic Comparison of Hotspots:</strong> Charts
                  comparing demographic profiles across burden/indicator
                  hotspots.
                </p>
              </li>
              <li>
                <p>
                  <strong>Burden/Indicator Distribution:</strong> Interactive
                  bar chart showing burden/indicator breakdown by state or
                  county.
                </p>
              </li>
            </ul>
            <h3>Interacting with the Graphs</h3>
            <ul>
              <li>
                <p>
                  <strong>Filters:</strong> Use dropdown menus above the
                  burden/indicator distribution chart to filter by state,
                  county, or specific burdens/indicators.
                </p>
              </li>
              <li>
                <p>
                  <strong>Hover Information:</strong> Hover over chart elements
                  to view detailed information.
                </p>
              </li>
            </ul>
            <h2>6. Tips and Troubleshooting</h2>
            <h3>Common Issues</h3>
            <ul>
              <li>
                <p>If the map fails to load, try refreshing the page.</p>
              </li>
              <li>
                <p>
                  If sidebar data does not appear, ensure you have clicked
                  directly on a census tract.
                </p>
              </li>
              <li>
                <p>
                  Notice a bug? Use the contact information in the{' '}
                  <a className="usa-link" href={PAGES_ENDPOINTS.CONTACT}>
                    contact page
                  </a>{' '}
                  to reach out.
                </p>
              </li>
            </ul>
          </Grid>

          {/* Second column */}
          <Grid col={12} tablet={{col: 1}}>
            {/* Spacer column */}
          </Grid>

          {/* Third column - Only show the SubPagNav component on desktop width */}
          {width > USWDS_BREAKPOINTS.DESKTOP ? (
            <Grid col={12} tablet={{col: 3}}>
              <SubPageNav
                activeSubPageIndex={1}
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
      </J40MainGridContainer>
    </Layout>
  );
};

export default DownloadsPage;

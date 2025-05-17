// import {Grid} from '@trussworks/react-uswds';
// import {useIntl} from 'gatsby-plugin-intl';
import * as React from 'react';
// import {useWindowSize} from 'react-use';

// import DatasetsButton from '../components/DatasetsButton';
import J40MainGridContainer from '../components/J40MainGridContainer';
import Layout from '../components/layout';
import InteractiveGraph from '../components/InteractiveGraph';
// import ReleaseUpdate from '../components/ReleaseUpdate';
// import SubPageNav from '../components/SubPageNav';

// import {DATA_SURVEY_LINKS, PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
// import * as DOWNLOADS_COPY from '../data/copy/downloads';
interface IDownloadsPageProps {
  location: Location;
}

const DownloadsPage = ({location}: IDownloadsPageProps) => {
  return (
    <Layout location={location} title="Testing Inputs">
      <J40MainGridContainer>
        <section className={'page-heading'}>
          <h1>Testing Inputs</h1>
          <div id="chart-container-int">
            <InteractiveGraph url="http://localhost:5001/data/data-pipeline/data_pipeline/data/score/geojson/tract_total.json"></InteractiveGraph>
          </div>
        </section>
      </J40MainGridContainer>
    </Layout>
  );
};

export default DownloadsPage;

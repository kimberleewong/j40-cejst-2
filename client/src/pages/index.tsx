import React from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import {Grid} from '@trussworks/react-uswds';

// import ExploreDataBox from '../components/ExploreDataBox';
import J40Map from '../components/J40Map';
import J40MainGridContainer from '../components/J40MainGridContainer';
// import IncomeSlider from '../components/IncomeSlider';
import Layout from '../components/layout';
// import DatasetsButton from '../components/DatasetsButton';

import * as EXPLORE_COPY from '../data/copy/explore';
// import {DATA_SURVEY_LINKS} from '../data/constants';

interface IMapPageProps {
  location: Location;
}

const ExporeToolPage = ({location}: IMapPageProps) => {
  // We temporarily removed MapControls, which would enable you to `setFeatures` also, for now
  //   We will bring back later when we have interactive controls.
  const intl = useIntl();

  return (
    <Layout
      location={location}
      title={intl.formatMessage(EXPLORE_COPY.PAGE_INTRO.PAGE_TILE)}
    >
      <J40MainGridContainer fullWidth>
        <div style={{maxWidth: '90%', margin: 'auto'}}>
          <section className={'page-heading'}>
            <h2>
              Identifying Disadvantaged Communities Using Cumulative
              Environmental Burdens
            </h2>
            {/* <DatasetsButton href= {intl.locale === 'es' ? DATA_SURVEY_LINKS.ES : DATA_SURVEY_LINKS.EN} /> */}
          </section>

          <Grid row gap className={'j40-mb5-mt3'}>
            {/* Gradually increase width of the Grid as the width decreases from desktop to mobile*/}
            {/* desktop = 7 columns, tablet = 10 columns and mobile = 12 columns (full width) */}
            <Grid desktop={{col: 12}} tablet={{col: 10}} col={12}>
              <p style={{marginTop: '0rem'}}>
                {EXPLORE_COPY.PAGE_DESCRIPTION1}
              </p>
              <p>{EXPLORE_COPY.PAGE_DESCRIPTION2}</p>
            </Grid>
            <Grid desktop={{col: 4}} tablet={{col: 10}} col={12}>
              {/* <ExploreDataBox /> */}
            </Grid>
          </Grid>
        </div>
      </J40MainGridContainer>

      <J40MainGridContainer fullWidth>
        <div style={{maxWidth: '90%', margin: 'auto'}}>
          <Grid row>
            <J40Map location={location} />
          </Grid>
        </div>
      </J40MainGridContainer>

      <J40MainGridContainer fullWidth>
        <div style={{maxWidth: '90%', margin: 'auto'}}>
          <Grid desktop={{col: 7}} tablet={{col: 10}} col={12}>
            <h2>{EXPLORE_COPY.NOTE_ON_TERRITORIES.INTRO}</h2>
            <p>{EXPLORE_COPY.NOTE_ON_TERRITORIES.PARA_0}</p>
            <p>{EXPLORE_COPY.NOTE_ON_TERRITORIES.PARA_1}</p>
            <p>{EXPLORE_COPY.NOTE_ON_TERRITORIES.PARA_2}</p>
          </Grid>

          <Grid desktop={{col: 7}} tablet={{col: 10}} col={12}>
            <h2>{EXPLORE_COPY.NOTE_ON_TRIBAL_NATIONS.INTRO}</h2>
            <p>{EXPLORE_COPY.NOTE_ON_TRIBAL_NATIONS.PARA_1}</p>
            <p>{EXPLORE_COPY.NOTE_ON_TRIBAL_NATIONS.PARA_2}</p>
          </Grid>
        </div>
      </J40MainGridContainer>
    </Layout>
  );
};

export default ExporeToolPage;

import * as React from 'react';
import {Grid} from '@trussworks/react-uswds';
import {useIntl, FormattedMessage} from 'gatsby-plugin-intl';
import {useWindowSize} from 'react-use';

import J40MainGridContainer from '../components/J40MainGridContainer';
import Layout from '../components/layout';
import LinkTypeWrapper from '../components/LinkTypeWrapper';
// import DatasetsButton from '../components/DatasetsButton';

import * as CONTACT_COPY from '../data/copy/contact';
import {FEEDBACK_EMAIL} from '../data/copy/common';
import {PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
import SubPageNav from '../components/SubPageNav';

// import {DATA_SURVEY_LINKS} from '../data/constants';

interface IContactPageProps {
  location: Location;
}

const ContactPage = ({location}: IContactPageProps) => {
  const intl = useIntl();
  const {width} = useWindowSize();

  return (
    <Layout
      location={location}
      title={intl.formatMessage(CONTACT_COPY.PAGE_INTRO.PAGE_TILE)}
    >
      <J40MainGridContainer>
        <section className={'page-heading'}>
          <h1>{intl.formatMessage(CONTACT_COPY.PAGE_INTRO.PAGE_HEADING)}</h1>
          {/* <DatasetsButton
            href={
              intl.locale === 'es' ? DATA_SURVEY_LINKS.ES : DATA_SURVEY_LINKS.EN
            }
          /> */}
        </section>

        <Grid row gap={6}>
          {/* First column */}
          <Grid desktop={{col: 8}} col={12}>
            <h2>
              {intl.formatMessage(CONTACT_COPY.PAGE_INTRO.PAGE_SUB_HEADING)}
            </h2>
            <p>{CONTACT_COPY.CENSUS_TRACT_FEEDBACK.PARAGRAPH3}</p>
            <p>
              <FormattedMessage
                id={'contact.page.general'}
                description={'Contact page body text'}
                defaultMessage={`Email CEQ at: {general_email_address}.`}
                values={{
                  general_email_address: (
                    <LinkTypeWrapper
                      linkText={FEEDBACK_EMAIL}
                      internal={false}
                      url={`mailto:${FEEDBACK_EMAIL}`}
                      openUrlNewTab={true}
                    />
                  ),
                }}
              />
            </p>
          </Grid>

          {/* Second column, spacer */}
          <Grid col={12} tablet={{col: 1}}></Grid>

          {/* Third column */}
          {width > USWDS_BREAKPOINTS.DESKTOP ? (
            <Grid col={12} tablet={{col: 3}}>
              <SubPageNav
                activeSubPageIndex={3}
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

      <J40MainGridContainer fullWidth={true} greenBackground={true}>
        <J40MainGridContainer>
          <Grid col={12} tablet={{col: 8}} className="j40-mb5-mt3">
            <h2>Acknowledgements</h2>
            <p>
              We would like to thank the original CEJST team and the CEJST open
              source community for creating an incredible tool for our team to
              build upon. None of this work would have been possible without
              their clear documentation, open access code, and data resources.
            </p>
            <p>
              We would also like to thank our client and advisor{' '}
              <a
                className="usa-link"
                href="https://jayajitc.wixsite.com/jchakrab"
              >
                Dr. Jayajit Chakraborty
              </a>
              . His guidance was invaluable for thinking critically about
              creating geospatial tools for environmental justice.{' '}
            </p>
            <p>Additionally, we would like to thank these people:</p>
            <ul>
              <li>
                <p>
                  <a className="usa-link" href="https://github.com/carmengg">
                    Dr. Carmen Galaz García
                  </a>{' '}
                  for her instruction in our capstone class
                </p>
              </li>
              <li>
                <p>
                  <a className="usa-link" href="https://flukeandfeather.com/">
                    Dr. Max Czapanskiy
                  </a>{' '}
                  for his statistical expertise and conceptual guidance
                </p>
              </li>
              <li>
                <p>
                  <a className="usa-link" href="https://www.avmey.com/">
                    Abby Vath Meyer
                  </a>{' '}
                  for her crash course into all things front-end development
                </p>
              </li>
              <li>
                <p>
                  <a className="usa-link" href="https://julietcohen.github.io/">
                    Juliet Cohen
                  </a>{' '}
                  for her assistance with geospatial tiling
                </p>
              </li>
            </ul>
          </Grid>
        </J40MainGridContainer>
      </J40MainGridContainer>
    </Layout>
  );
};

export default ContactPage;

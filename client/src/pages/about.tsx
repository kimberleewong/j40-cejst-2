import {useIntl} from 'gatsby-plugin-intl';
import * as React from 'react';
import {useWindowSize} from 'react-use';

import {Grid} from '@trussworks/react-uswds';
import AboutCard from '../components/AboutCard/AboutCard';
import AboutCardsContainer from '../components/AboutCard/AboutCardsContainer';
import J40MainGridContainer from '../components/J40MainGridContainer';
import Layout from '../components/layout';
import SubPageNav from '../components/SubPageNav';

import {GITHUB_LINK, GITHUB_LINK_ES} from '../constants';
import {PAGES_ENDPOINTS, USWDS_BREAKPOINTS} from '../data/constants';
import * as ABOUT_COPY from '../data/copy/about';

import aboutJ40Image from '../images/about-usmap.svg';

import githubIcon from '/node_modules/uswds/dist/img/usa-icons/github.svg'; // @ts-ignore

interface IAboutPageProps {
  location: Location;
}

// markup
const AboutPage = ({location}: IAboutPageProps) => {
  const intl = useIntl();
  const {width} = useWindowSize();

  console.log(intl.locale);
  return (
    <Layout
      location={location}
      title={intl.formatMessage(ABOUT_COPY.PAGE.TITLE)}
    >
      <J40MainGridContainer>
        <section className={'page-heading'}>
          <h1 data-cy={'about-page-heading'}>About</h1>
        </section>

        <Grid row gap className={'j40-mb5-mt3'}>
          {/* First column */}
          <Grid col={12} tablet={{col: 8}}>
            <section>
              <h2>Justice40</h2>
              <p>
                The{' '}
                <a
                  className="usa-link"
                  href="https://bidenwhitehouse.archives.gov/environmentaljustice/justice40/"
                >
                  Justice40 Initiative
                </a>
                , established by President Biden in{' '}
                <a
                  className="usa-link"
                  href="https://www.federalregister.gov/documents/2021/02/01/2021-02177/tackling-the-climate-crisis-at-home-and-abroad"
                >
                  Executive Order 14008
                </a>
                , was a federal government-wide effort to direct{' '}
                <strong>
                  40 percent of the overall benefits from environment-related
                  investments back to disadvantaged communities
                </strong>
                . These are communities that have been historically
                marginalized, underserved, and overburdened by pollution.
                Justice 40 covered more than 400 programs across two dozen
                federal agencies and focused on investments in climate change,
                clean energy, sustainable housing, workforce development,
                pollution reduction, and clean water infrastructure. This
                approach not only addressed historical inequities but also
                encouraged economic opportunity in these communities, serving as
                a critical part of the administration&#39;s whole-of-government
                approach to advancing environmental justice. The initiative was
                reversed by the Trump administration in January 2025.
              </p>
              <h2>Climate and Economic Justice Screening Tool</h2>
              <p>
                The Climate and Economic Justice Screening Tool (CEJST),
                developed by the US Digital Service, was a key component of the
                Justice40 Initiative. It was a geospatial mapping tool that
                identified disadvantaged communities across the United States
                that were marginalized, underserved, and overburdened by
                pollution. It organized burdens into eight categories: climate
                change, energy, health, housing, legacy pollution,
                transportation, water and wastewater, and workforce development.
                CEJST was removed in January 2025, though archived versions have
                been preserved by various organizations.
              </p>
              <h2>CEJST+</h2>
              <p>
                This project was created as a Master of Environmental Data
                Science Capstone Project at the{' '}
                <a className="usa-link" href="https://bren.ucsb.edu/">
                  Bren School of Environmental Science & Management
                </a>
                . This project seeks to extend and improve CEJST’s model by
                assessing the cumulative impacts of climate and environmental
                burdens across communities in the U.S. By analyzing and
                incorporating cumulative burdens using cutting-edge geospatial
                techniques, the revised screening tool will promote more
                meaningful and equitable investment into overburdened
                disadvantaged communities facing the greatest risk from climate
                change. The project contributors are:
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Josephine Cardelle</strong>{' '}
                    <a
                      className="usa-link"
                      href="https://github.com/jocardelle"
                    >
                      GitHub
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://jocardelle.github.io/"
                    >
                      Website
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://www.linkedin.com/in/josephine-cardelle/"
                    >
                      LinkedIn
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Kat Le</strong>{' '}
                    <a className="usa-link" href="https://github.com/katleyq">
                      GitHub
                    </a>{' '}
                    |{' '}
                    <a className="usa-link" href="https://haylee360.github.io/">
                      Website
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://www.linkedin.com/in/katherine-le/"
                    >
                      LinkedIn
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Haylee Oyler</strong>{' '}
                    <a className="usa-link" href="https://github.com/haylee360">
                      GitHub
                    </a>{' '}
                    |{' '}
                    <a className="usa-link" href="https://haylee360.github.io/">
                      Website
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://www.linkedin.com/in/haylee-oyler/"
                    >
                      LinkedIn
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Kimberlee Wong</strong>{' '}
                    <a
                      className="usa-link"
                      href="https://github.com/kimberleewong"
                    >
                      GitHub
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://kimberleewong.github.io/"
                    >
                      Website
                    </a>{' '}
                    |{' '}
                    <a
                      className="usa-link"
                      href="https://www.linkedin.com/in/kimberlee-wong/"
                    >
                      LinkedIn
                    </a>
                  </p>
                </li>
              </ul>

              {/* <p>{ABOUT_COPY.CONTENT.PARA2}</p> */}
            </section>
          </Grid>

          {/* Second column */}
          <Grid col={12} tablet={{col: 1}}>
            {/* Spacer column */}
          </Grid>

          {/* Third column */}
          <Grid col={12} tablet={{col: 3}}>
            {width > USWDS_BREAKPOINTS.DESKTOP ? (
              <>
                <SubPageNav
                  endPoints={[
                    PAGES_ENDPOINTS.ABOUT,
                    PAGES_ENDPOINTS.DOWNLOADS,
                    PAGES_ENDPOINTS.METHODOLOGY,
                    PAGES_ENDPOINTS.CONTACT,
                  ]}
                />
                <img
                  src={aboutJ40Image}
                  alt="About J40"
                  className="about-image"
                  width="100%"
                  height="auto"
                  style={{maxWidth: '100%', marginTop: '2rem'}}
                />
              </>
            ) : (
              <img
                src={aboutJ40Image}
                alt="About J40"
                className="about-image"
                width="100%"
                height="auto"
                style={{maxWidth: '100%'}}
              />
            )}
          </Grid>
        </Grid>
      </J40MainGridContainer>

      <J40MainGridContainer fullWidth={true} greenBackground={true}>
        <J40MainGridContainer>
          <Grid col={12} tablet={{col: 8}} className="j40-mb5-mt3">
            <h2>{intl.formatMessage(ABOUT_COPY.HOW_TO_USE_TOOL.TITLE)}</h2>
            <p>{ABOUT_COPY.CONTENT.HOW_TO_USE_PARA1}</p>
            <p>{intl.formatMessage(ABOUT_COPY.HOW_TO_USE_TOOL.PARA2)}</p>
            <p>{ABOUT_COPY.CONTENT.HOW_TO_USE_PARA3}</p>
          </Grid>
        </J40MainGridContainer>
      </J40MainGridContainer>

      <J40MainGridContainer>
        <h2>{intl.formatMessage(ABOUT_COPY.GET_INVOLVED.TITLE)}</h2>
        <AboutCardsContainer>
          <AboutCard
            size={'small'}
            imgSrc={githubIcon}
            header={intl.formatMessage(
                ABOUT_COPY.GET_INVOLVED.JOIN_OSC_HEADING,
            )}
            linkText={intl.formatMessage(
                ABOUT_COPY.GET_INVOLVED.JOIN_OSC_LINK_TEXT,
            )}
            // linkTag={intl.formatMessage(
            //     ABOUT_COPY.GET_INVOLVED.JOIN_OSC_LINK_TAG,
            // )}
            url={intl.locale === 'es' ? GITHUB_LINK_ES : GITHUB_LINK}
            openUrlNewTab={true}
            internal={false}
          >
            <p>{intl.formatMessage(ABOUT_COPY.GET_INVOLVED.JOIN_OSC_INFO)}</p>
          </AboutCard>
        </AboutCardsContainer>
      </J40MainGridContainer>
    </Layout>
  );
};

export default AboutPage;

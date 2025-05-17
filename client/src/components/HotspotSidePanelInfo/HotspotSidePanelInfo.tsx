import React from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import {useWindowSize} from 'react-use';
// @ts-ignore
import plusIcon from '/node_modules/uswds/dist/img/usa-icons/add.svg';
// @ts-ignore
import searchIcon from '/node_modules/uswds/dist/img/usa-icons/search.svg';
// @ts-ignore
import locateIcon from '/node_modules/uswds/dist/img/usa-icons/my_location.svg';

import * as styles from './HotspotSidePanelInfo.module.scss';
import * as constants from '../../data/constants';
import * as EXPLORE_COPY from '../../data/copy/explore';

const HotspotSidePanelInfo = () => {
  const intl = useIntl();
  const {width: windowWidth} = useWindowSize();

  return (
    <aside className={styles.sidePanelInfoContainer}>
      {/* Heading 1 */}
      <header tabIndex={0} className={styles.sidePanelInfoTitle}>
        Hotspots & Coldspots
      </header>

      {/* Paragraph 1 */}
      <p tabIndex={0}>
        Hotspot detection utilizes the Getis-Ord Gi* statistics to identify spatial
        clusters, highlighting census tracts where burdens or indicators are significantly
        higher (&ldquo;hot spots&rdquo;) or lower (&ldquo;cold spots&rdquo;) than the
        national average.
      </p>

      {/* Heading 1 */}
      <header tabIndex={0} className={styles.sidePanelInfoTitle}>
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.HEADING1)}
      </header>

      {/* Paragraph 1 */}
      <p tabIndex={0}>
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.PARA1_PART1)}
        {
          windowWidth > constants.USWDS_BREAKPOINTS.MOBILE_LG &&
          <img tabIndex={0} className={styles.sidePanelInfoIcon} src={plusIcon}
            alt={intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INIT_STATE_ICON_ALT_TEXT.PLUS)}
          />
        }
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.PARA1_PART2)}
        {
          windowWidth > constants.USWDS_BREAKPOINTS.MOBILE_LG &&
          <img tabIndex={0} className={styles.sidePanelInfoIcon} src={searchIcon}
            alt={intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INIT_STATE_ICON_ALT_TEXT.SEARCH)}
          />
        }
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.PARA1_PART3)}
        {
          windowWidth > constants.USWDS_BREAKPOINTS.MOBILE_LG &&
          <img tabIndex={0} className={styles.sidePanelInfoIcon} src={locateIcon}
            alt={intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INIT_STATE_ICON_ALT_TEXT.LOCATE)}
          />
        }
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.PARA1_PART4)}
        {/* {
          windowWidth > constants.USWDS_BREAKPOINTS.MOBILE_LG &&
          <img tabIndex={0} className={styles.sidePanelInfoIcon} src={handPointIcon}
            alt={intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INIT_STATE_ICON_ALT_TEXT.MOUSE)}
          />
        } */}
        {intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INITIAL_STATE.PARA1_PART5)}
      </p>


    </aside>
  );
};

export default HotspotSidePanelInfo;

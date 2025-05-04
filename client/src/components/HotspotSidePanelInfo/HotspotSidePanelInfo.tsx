import React from 'react';
// import {useIntl} from 'gatsby-plugin-intl';
// import {useWindowSize} from 'react-use';

import * as styles from './HotspotSidePanelInfo.module.scss';
// import * as constants from '../../data/constants';
// import * as EXPLORE_COPY from '../../data/copy/explore';

const HotspotSidePanelInfo = () => {
  // const intl = useIntl();
  // const {width: windowWidth} = useWindowSize();

  return (
    <aside className={styles.sidePanelInfoContainer}>
      {/* Heading 1 */}
      <header tabIndex={0} className={styles.sidePanelInfoTitle}>
        Hotspots & Coldspots
      </header>

      {/* Paragraph 1 */}
      <p tabIndex={0}>This is where the description of Gi* will go</p>
    </aside>
  );
};

export default HotspotSidePanelInfo;

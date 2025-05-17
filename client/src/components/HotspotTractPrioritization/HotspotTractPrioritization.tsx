import React from 'react';

import * as styles from './HotspotTractPrioritization.module.scss';

interface IHotspotTractPrioritization {
  pValue: number;
}

/**
 * This component will return the appropriate designation for the tract's prioritization
 *
 * @param {boolean} scoreNCommunities
 * @param {number | null} tribalCountAK
 * @param {number | null} tribalCountUS
 * @param {number | null} percentTractTribal
 * @return {JSX}
 */

const HotspotTractPrioritization = ({
  pValue,
}: IHotspotTractPrioritization) => {
  if (pValue < -0.05) {
    return <h3>Not Significant</h3>;
  } else {
    if (pValue >= -0.05 && pValue < -0.01) {
      return <h3 className={styles.invertBlue}>Cold Spot</h3>;
    } else {
      if (pValue >= -0.01 && pValue < -0.000001) {
        return <h3 className={styles.invertBlue}>Very Cold Spot</h3>;
      } else {
        if (pValue >= 0 && pValue <= 0.01) {
          return <h3 className={styles.invertRed}>Very Hot Spot</h3>;
        } else {
          if (pValue > 0.01 && pValue <= 0.05) {
            return <h3 className={styles.invertRed}>Hot Spot</h3>;
          } else {
            return <h3>Not Significant</h3>;
          }
        }
      }
    }
  }
};

export default HotspotTractPrioritization;

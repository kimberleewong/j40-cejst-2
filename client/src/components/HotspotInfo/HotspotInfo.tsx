import React from 'react';

// import * as styles from './HotspotInfo.module.scss';
// import * as EXPLORE_COPY from '../../data/copy/explore';
// import * as constants from '../../data/constants';

export interface IHotspotInfoProps {
  // temperatureClass: string,
  // zScore: number;
  pValue: number;
}

const HotspotInfo = ({pValue}: IHotspotInfoProps) => {
  if (pValue < -0.05) {
    return <p>Significance Leve: Not Significant</p>;
  } else {
    if (pValue >= -0.05 && pValue < -0.01) {
      return <p>Significance Level: 95% </p>;
    } else {
      if (pValue >= -0.01 && pValue < -0.000001) {
        return <p>Significance Level: 99% </p>;
      } else {
        if (pValue >= 0 && pValue <= 0.01) {
          return <p>Significance Level: 99% </p>;
        } else {
          if (pValue > 0.01 && pValue <= 0.05) {
            return <p>Significance Level: 95% </p>;
          } else {
            return <p>Significance Level: Not Significant</p>;
          }
        }
      }
    }
  }
};
//     <ul className={styles.tractInfoContainer}>
//       {/* <li>
//         <span>Classification</span>
//         <span>{` ${temperatureClass}`}</span>
//       </li> */}
//       {/* <li>
//         <span>Z-score</span>
//         <span>{` ${zScore}`}</span>
//       </li> */}
//       <li>
//         <span>P-value</span>
//         <span>{` ${pValue}`}</span>
//       </li>
//     </ul>
//   );
// };

export default HotspotInfo;

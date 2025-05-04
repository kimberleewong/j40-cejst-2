import React from 'react';
import AreaDetail from './AreaDetail';
import HotspotAreaDetail from './HotspotAreaDetail';
import AdditiveAreaDetail from './AdditiveAreaDetail';
import SidePanelInfo from './SidePanelInfo';
import HotspotSidePanelInfo from './HotspotSidePanelInfo';
import AdditiveSidePanelInfo from './AdditiveSidePanelInfo';
import * as constants from '../data/constants';

interface IMapInfoPanelProps {
  className: string;
  featureProperties: { [key: string]: string | number } | undefined;
  selectedFeatureId: string | number | undefined;
  hash: string[];
  visibleLayer: string; // Add this prop to track the selected layer
}

const MapInfoPanel = ({
  className,
  featureProperties,
  selectedFeatureId,
  hash,
  visibleLayer, // Destructure the new prop
}: IMapInfoPanelProps) => {
  return (
    <div className={className}>
      {/* Render different sidebar content based on the selected layer */}
      {visibleLayer === constants.LEGACY_LAYER_ID &&
        (featureProperties && selectedFeatureId ? (
          <AreaDetail properties={featureProperties} hash={hash} />
        ) : (
          <SidePanelInfo />
        ))}

      {visibleLayer === constants.PSIM_BURDEN_LAYER_ID &&
        (featureProperties && selectedFeatureId ? (
          <HotspotAreaDetail properties={featureProperties} hash={hash} />
        ) : (
          <HotspotSidePanelInfo />
        ))}

      {visibleLayer === constants.PSIM_INDICATOR_LAYER_ID &&
        (featureProperties && selectedFeatureId ? (
          <HotspotAreaDetail properties={featureProperties} hash={hash} />
        ) : (
          <HotspotSidePanelInfo />
        ))}

      {visibleLayer === constants.ADD_BURDEN_LAYER_ID &&
        (featureProperties && selectedFeatureId ? (
          <AdditiveAreaDetail properties={featureProperties} hash={hash} />
        ) : (
          <AdditiveSidePanelInfo />
        ))}

      {visibleLayer === constants.ADD_INDICATOR_LAYER_ID &&
        (featureProperties && selectedFeatureId ? (
          <AdditiveAreaDetail properties={featureProperties} hash={hash} />
        ) : (
          <AdditiveSidePanelInfo />
        ))}
    </div>
  );
};

export default MapInfoPanel;

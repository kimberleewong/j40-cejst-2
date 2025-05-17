import React, {useState, useEffect} from 'react';
import {Label} from '@trussworks/react-uswds';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import * as constants from '../../data/constants';

interface IncomeSliderProps {
  onChange: (max: number) => void;
  minIncome?: number;
  maxIncome?: number;
  defaultMax?: number;
}

const IncomeSlider: React.FC<IncomeSliderProps> = ({
  onChange,
  minIncome = 0,
  maxIncome = 100,
  defaultMax = 60,
}) => {
  const [selectedIncomePercentile, setSelectedIncomePercentile] = useState<number>(defaultMax);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 685);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 685);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Call onChange when value changes
  useEffect(() => {
    onChange(selectedIncomePercentile);
  }, [selectedIncomePercentile, onChange]);

  // Handle value changes from the slider
  const handleIncomeSliderChange = (newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setSelectedIncomePercentile(newValue);
    }
  };

  const containerStyle = {
    position: 'absolute' as const,
    top: isMobile ? 'auto' : '10px',
    left: isMobile ? 'auto' : '10px',
    bottom: isMobile ? '10px' : 'auto',
    right: isMobile ? '10px' : 'auto',
    background: 'white',
    padding: '12px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    width: '250px',
  };

  const labelStyle = {
    padding: '5px',
    marginTop: 0,
    marginBottom: '5px',
    display: 'inline-block' as const,
    marginRight: '10px',
  };

  const valueDisplayStyle = {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    marginBottom: '10px',
    alignItems: 'center' as const,
  };

  return (
    <div style={containerStyle}>
      <div style={valueDisplayStyle}>
        <Label
          htmlFor="income-slider"
          style={labelStyle}
        >
          Low Income Percentile
        </Label>
        <span><strong>{selectedIncomePercentile}th</strong></span>
      </div>

      <Slider
        min={minIncome}
        max={maxIncome}
        step={1}
        value={selectedIncomePercentile}
        onChange={handleIncomeSliderChange}
        className="income-slider"
        aria-label="Low income percentile"
      />
    </div>
  );
};

export default IncomeSlider;

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ColorInput from '../../Inputs/ColorInput';

const StatsSection = ({ data, setData, setHasPendingChanges }) => {
  const [primaryColorStat, setPrimaryColorStat] = useState(
    data?.primaryColor || '#ffffff'
  );
  const [secondaryColorStat, setSecondaryColorStat] = useState(
    data?.secondaryColor || '#000000'
  );

  const stats = [
    {
      title: 'Số sự kiện',
      key: 'num_events',
      value: String(data?.num_events ?? ''),
    },
    {
      title: 'Số người đã giúp đỡ',
      key: 'num_people_helped',
      value: String(data?.num_people_helped ?? ''),
    },
    {
      title: 'Số tiền quyên góp',
      key: 'total_money_donated',
      value: String(data?.total_money_donated ?? ''),
    },
    {
      title: 'Số dự án đã làm',
      key: 'num_projects',
      value: String(data?.num_projects ?? ''),
    },
  ];

  const handleStatChange = (key, value) => {
    const numericValue =
      value === '' ? '' : Number(String(value).replace(/\D/g, '')) || 0;
    setData((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
    setHasPendingChanges(true);
  };

  useEffect(() => {
    setData((prev) => {
      if (
        prev.primaryColor === primaryColorStat &&
        prev.secondaryColor === secondaryColorStat
      ) {
        return prev; // Avoid unnecessary update
      }

      setHasPendingChanges(true);
      return {
        ...prev,
        primaryColor: primaryColorStat,
        secondaryColor: secondaryColorStat,
      };
    });
  }, [primaryColorStat, secondaryColorStat]);

  return (
    <>
      <div className="w-full h-250 md:h-64 flex flex-col md:flex-row gap-4 justify-center items-center z-auto relative -mt-[120px] px-2 sm:px-4">
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            className="w-64 h-full relative overflow-hidden rounded-xl"
            style={{
              backgroundColor: primaryColorStat,
              borderRadius: '1.5rem',
              boxShadow: '0px 8px 28px -9px rgba(0,0,0,0.45)',
            }}
          >
            <div
              className="wave absolute w-[540px] h-[700px] opacity-60"
              style={{
                left: '0',
                top: '270px',
                marginLeft: '-50%',
                marginTop: '-70%',
                background: `linear-gradient(744deg, ${secondaryColorStat}, #5b42f3 50%, #00ddeb)`,
                borderRadius: '40%',
                animation: 'wave 10s infinite linear',
              }}
            />
            <div className="relative z-10 md:top-0 top-10 w-full flex flex-col items-center justify-center">
              <h3 className="w-full font-medium text-xl py-3 md:py-9 text-center outline-none text-white">
                {stat.title}
              </h3>
              <input
                type="number"
                className="w-full font-bold text-6xl text-white text-center outline-none"
                value={stat.value}
                onChange={(e) => handleStatChange(stat.key, e.target.value)}
                placeholder="..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-20 flex justify-center items-center gap-4 px-2 sm:px-4">
        <ColorInput
          type="color"
          value={primaryColorStat}
          onChange={(e) => setPrimaryColorStat(e.target.value)}
          // className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer"
        />
        <ColorInput
          type="color"
          value={secondaryColorStat}
          onChange={(e) => setSecondaryColorStat(e.target.value)}
          // className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer"
        />
      </div>

      <style>
        {`
          @keyframes wave {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

StatsSection.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  setHasPendingChanges: PropTypes.func.isRequired,
};

export default StatsSection;

import PropTypes from "prop-types";

const StatsSection = ({
  stats,
  setStats,
  primaryColorStat,
  setPrimaryColorStat,
  secondaryColorStat,
  setSecondaryColorStat,
}) => {
  console.log("StatsSection rendering with stats:", stats);
  return (
    <>
      <div className="w-full h-full md:h-64 flex flex-col md:flex-row justify-center items-center z-auto relative -mt-30">
        {stats.map((stat, index) => (
          <div
            key={`stat_${index}`}
            className="w-64 h-full mx-4 relative overflow-hidden rounded-xl"
            style={{
              backgroundColor: primaryColorStat,
              borderRadius: "1.5rem",
              boxShadow: "0px 8px 28px -9px rgba(0,0,0,0.45)",
            }}
          >
            <div
              className="wave absolute w-[540px] h-[700px] opacity-60"
              style={{
                left: "0",
                top: "270px",
                marginLeft: "-50%",
                marginTop: "-70%",
                background: `linear-gradient(744deg, ${secondaryColorStat}, #5b42f3 50%, #00ddeb)`,
                borderRadius: "40%",
                animation: "wave 10s infinite linear",
              }}
            />
            <div className="relative z-10 w-full flex flex-col items-center justify-center">
              <h3 className="w-full font-medium text-sm md:text-xl py-3 md:py-9 text-center outline-none text-white">
                {stat.title}
              </h3>
              <input
                type="number"
                className="w-full font-bold text-2xl md:text-6xl text-white text-center outline-none"
                value={stat.data || ""}
                onChange={(e) => {
                  console.log("StatsSection onChange:", { key: `stat_${index}`, value: e.target.value });
                  setStats(`stat_${index}`, e.target.value);
                }}
                placeholder="..."
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-20 flex justify-center items-center gap-4">
        <input
          type="color"
          value={primaryColorStat}
          onChange={(e) => setPrimaryColorStat(e.target.value)}
        />
        <input
          type="color"
          value={secondaryColorStat}
          onChange={(e) => setSecondaryColorStat(e.target.value)}
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
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      data: PropTypes.string,
    })
  ).isRequired,
  setStats: PropTypes.func.isRequired,
  primaryColorStat: PropTypes.string.isRequired,
  setPrimaryColorStat: PropTypes.func.isRequired,
  secondaryColorStat: PropTypes.string.isRequired,
  setSecondaryColorStat: PropTypes.func.isRequired,
};

export default StatsSection;
const StatsSection = ({
  stats,
  setStats,
  primaryColorStat,
  setPrimaryColorStat,
  secondaryColorStat,
  setSecondaryColorStat,
}) => {
  const handleStatChange = (key, field, value) => {
    setStats((prevStats) => ({
      ...prevStats,
      [key]: { ...prevStats[key], [field]: value },
    }));
  };

  return (
    <>
      <div className="w-full h-full md:h-64 flex flex-col md:flex-row ground justify-center items-center z-auto relative -mt-30">
        {Object.entries(stats)
          .map(([key, stat]) => [key.slice(5), stat])
          .sort((a, b) => a[0] - b[0])
          .map(([key, stat]) => (
            <div
              key={`stat_${key}`}
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
                <input
                  className="w-full font-medium text-sm md:text-xl py-3 md:py-9 text-center outline-none text-white"
                  value={stat.title}
                  onChange={(e) => handleStatChange(`stat_${key}`, "title", e.target.value)}
                  placeholder="Nhập tiêu đề thống kê"
                />
                <input
                  className="w-full font-bold text-2xl md:text-6xl text-white text-center outline-none"
                  value={stat.data}
                  onChange={(e) => handleStatChange(`stat_${key}`, "data", e.target.value)}
                  placeholder="Nhập dữ liệu thống kê"
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

export default StatsSection;
import PropTypes from "prop-types";

const FundraisingHeader = ({
  imageUrl,
  fundraiserName,
  amountRaised,
  goalAmount,
  qrCodeUrl,
  onSupportClick,
}) => {
  const progressPercentage = Math.min((amountRaised / goalAmount) * 100, 100);

  return (
    <div
      className="rounded-xl shadow-xl relative w-full h-[400px] flex items-center justify-end bg-cover bg-center text-dark p-8"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-white/80 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold">{fundraiserName}</h2>

        {/* Progress Bar with Outer Border */}
        <div className="mt-4 w-full rounded-full p-1 border-2 border-gray-400">
          {" "}
          {/* Outer border */}
          <div className="w-full bg-gray-400 rounded-full h-4">
            {" "}
            {/* Background bar */}
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span>{amountRaised.toLocaleString()} VND</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <p className="mt-2">Cần đạt được: {goalAmount.toLocaleString()} VND</p>
        <div className="flex items-center justify-around mt-4">
          <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={onSupportClick}
          >
            Ủng hộ
          </button>
        </div>
      </div>
    </div>
  );
};

FundraisingHeader.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  fundraiserName: PropTypes.string.isRequired,
  amountRaised: PropTypes.number.isRequired,
  goalAmount: PropTypes.number.isRequired,
  qrCodeUrl: PropTypes.string.isRequired,
  onSupportClick: PropTypes.func.isRequired,
};

export default FundraisingHeader;

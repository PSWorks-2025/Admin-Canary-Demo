import PropTypes from "prop-types";

const DonorList = ({ donors }) => {
  return (
    <div className="mt-8 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold">Danh sách ủng hộ</h3>
      <ul className="mt-4">
        {donors.map((donor, index) => (
          <li key={index} className="border-b py-2">
            <strong>{donor.name}</strong> ủng hộ {donor.amount.toLocaleString()}{" "}
            VND
          </li>
        ))}
      </ul>
    </div>
  );
};

DonorList.propTypes = {
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default DonorList;

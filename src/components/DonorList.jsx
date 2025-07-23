import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { TextInput } from "./Inputs/TextInput";
import SectionWrap from "./SectionWrap";

const DonorList = ({ donors, onDonorChange, onAddDonor, onDeleteDonor, buttonColor }) => {
  const [localDonors, setLocalDonors] = useState(donors);

  useEffect(() => {
    setLocalDonors(donors);
  }, [donors]);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (index, field, value) => {
      const debouncedHandleDonorChange = debounce(onDonorChange, 1000);
      setLocalDonors((prev) => {
        const newDonors = [...prev];
        newDonors[index] = {
          ...newDonors[index],
          [field]: field === "amount" ? Number(value) || 0 : value,
        };
        debouncedHandleDonorChange(index, field, field === "amount" ? Number(value) || 0 : value);
        return newDonors;
      });
    },
    [onDonorChange]
  );

  return (
    <SectionWrap borderColor={buttonColor} className="mt-8 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold">Danh sách ủng hộ</h3>
      <div className="flex justify-center mt-4">
        <button
          className="text-white font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity duration-200"
          style={{ backgroundColor: buttonColor || "#4160DF" }}
          onClick={onAddDonor}
        >
          Thêm người ủng hộ
        </button>
      </div>
      <ul className="mt-4">
        {localDonors.map((donor, index) => (
          <li key={donor.id || index} className="border-b py-2 flex items-center">
            <div className="flex-1 space-y-2">
              <TextInput
                className="text-base font-semibold text-black outline-none bg-transparent w-full border rounded px-2 py-1"
                value={donor.name || ""}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Nhập tên người ủng hộ"
              />
              <TextInput
                type="number"
                className="text-base text-black outline-none bg-transparent w-full border rounded px-2 py-1"
                value={donor.amount !== undefined ? donor.amount : ""}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                placeholder="Nhập số tiền"
              />
            </div>
            <button
              className="ml-4 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600"
              onClick={() => onDeleteDonor(index)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </SectionWrap>
  );
};

DonorList.propTypes = {
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDonorChange: PropTypes.func.isRequired,
  onAddDonor: PropTypes.func.isRequired,
  onDeleteDonor: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default DonorList;
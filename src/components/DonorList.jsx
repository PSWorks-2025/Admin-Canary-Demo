import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from './Inputs/TextInput';
import SectionWrap from './SectionWrap';

const DonorList = ({ donors, setFundraising, setHasChanges, buttonColor }) => {
  const [localDonors, setLocalDonors] = useState(donors || []);

  useEffect(() => {
    setLocalDonors(donors || []);
  }, [donors]);

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const handleDonorChange = useCallback(
    (index, field, value) => {
      console.log(`DonorList: Updating donor[${index}].${field} to ${value}`);
      const updatedValue = field === 'amount' ? Number(value) || 0 : value;

      setLocalDonors((prev) => {
        const newDonors = [...prev];
        newDonors[index] = {
          ...newDonors[index],
          [field]: updatedValue,
        };
        return newDonors;
      });

      setFundraising((prev) => {
        const newDonors = [...prev.donors];
        newDonors[index] = {
          ...newDonors[index],
          [field]: updatedValue,
        };
        return {
          ...prev,
          donors: newDonors,
          amount_raised: newDonors.reduce(
            (sum, donor) => sum + (Number(donor.amount) || 0),
            0
          ),
        };
      });

      setHasChanges(true);
    },
    [setFundraising, setHasChanges]
  );

  const handleAddDonor = useCallback(() => {
    const newId = `donor_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log(`DonorList: Adding donor with id ${newId}`);
    setFundraising((prev) => ({
      ...prev,
      donors: [...prev.donors, { id: newId, name: '', amount: 0 }],
    }));
    setLocalDonors((prev) => [...prev, { id: newId, name: '', amount: 0 }]);
    setHasChanges(true);
  }, [setFundraising, setHasChanges]);

  const handleDeleteDonor = useCallback(
    (index) => {
      console.log(`DonorList: Deleting donor at index ${index}`);
      setFundraising((prev) => {
        const newDonors = prev.donors.filter((_, i) => i !== index);
        return {
          ...prev,
          donors: newDonors,
          amount_raised: newDonors.reduce(
            (sum, donor) => sum + (Number(donor.amount) || 0),
            0
          ),
        };
      });
      setLocalDonors((prev) => prev.filter((_, i) => i !== index));
      setHasChanges(true);
    },
    [setFundraising, setHasChanges]
  );

  return (
    <SectionWrap borderColor={buttonColor} className="mt-8 max-w-lg mx-auto">
      <div className="text-2xl sm:text-[2.5rem] font-bold text-center">
        Danh sách ủng hộ
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="text-white font-medium px-5 py-2 rounded-full hover:opacity-80 transition-opacity duration-200"
          style={{ backgroundColor: buttonColor || '#4160DF' }}
          onClick={handleAddDonor}
        >
          Thêm người ủng hộ
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {localDonors.map((donor, index) => (
          <li
            key={donor.id || index}
            className="border border-gray-200 rounded-xl p-4 flex justify-between items-start bg-white shadow-sm"
          >
            <div className="flex-1 pr-4 space-y-2">
              <TextInput
                className="text-base font-semibold text-black w-full px-3 py-2 border rounded focus:outline-none"
                value={donor.name || ''}
                onChange={(e) =>
                  handleDonorChange(index, 'name', e.target.value)
                }
                placeholder="Nhập tên người ủng hộ"
              />
              <TextInput
                type="number"
                className="text-base text-black w-full px-3 py-2 border rounded focus:outline-none"
                value={donor.amount !== undefined ? donor.amount : ''}
                onChange={(e) =>
                  handleDonorChange(index, 'amount', e.target.value)
                }
                placeholder="Nhập số tiền"
                min="0"
              />
              <div className="px-1 pt-1 flex items-center gap-2 text-sm font-medium">
                <div className="text-gray-800">{donor.name}:</div>
                <div className="text-green-600">
                  {currencyFormatter.format(donor.amount || 0)}
                </div>
              </div>
            </div>

            <button
              className="mt-1 shrink-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              onClick={() => handleDeleteDonor(index)}
              aria-label="Xoá người ủng hộ"
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
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
  setFundraising: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default DonorList;

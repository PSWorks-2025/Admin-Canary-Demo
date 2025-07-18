import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../components/Inputs/TextInput.jsx";

const TransactionList = ({ transactions, handleTransactionChange, addTransaction, deleteTransaction, buttonColor }) => {
  const [localTransactions, setLocalTransactions] = useState(transactions);

  useEffect(() => {
    setLocalTransactions(transactions);
    console.log("TransactionList rendered with transactions:", transactions);
  }, [transactions]);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleTransactionChange = debounce(handleTransactionChange, 1000);

  const handleChange = (index, field, value) => {
    console.log("TransactionList handleChange:", { index, field, value });
    const newTransactions = [...localTransactions];
    newTransactions[index] = {
      ...newTransactions[index],
      [field]: field === "amount" ? Number(value) || 0 : value,
    };
    setLocalTransactions(newTransactions);
    debouncedHandleTransactionChange(index, field, field === "amount" ? Number(value) || 0 : value);
  };

  return (
    <div className="mt-8 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold">Danh sách giao dịch</h3>
      <div className="flex justify-center mt-4">
        <button
          className="text-white font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity duration-200"
          style={{ backgroundColor: buttonColor || "#4160DF" }}
          onClick={addTransaction}
        >
          Thêm giao dịch
        </button>
      </div>
      <ul className="mt-4">
        {localTransactions.map((transaction, index) => (
          <li key={transaction.id || index} className="border-b py-2 flex items-center">
            <div className="flex-1 space-y-2">
              <select
                className="text-base text-black outline-none bg-transparent w-full border rounded px-2 py-1"
                value={transaction.type || "Thu"}
                onChange={(e) => handleChange(index, "type", e.target.value)}
              >
                <option value="Thu">Thu</option>
                <option value="Chi">Chi</option>
              </select>
              <TextInput
                type="number"
                className="text-base text-black outline-none bg-transparent w-full border rounded px-2 py-1"
                value={transaction.amount !== undefined ? transaction.amount : ""}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                placeholder="Nhập số tiền"
              />
              <TextInput
                type="date"
                className="text-base text-black outline-none bg-transparent w-full border rounded px-2 py-1"
                value={transaction.date || ""}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                placeholder="Chọn ngày"
              />
            </div>
            <button
              className="ml-4 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600"
              onClick={() => deleteTransaction(index)}
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
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleTransactionChange: PropTypes.func.isRequired,
  addTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

export default TransactionList;
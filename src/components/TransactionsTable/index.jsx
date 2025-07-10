import PropTypes from "prop-types";
import { useState } from "react";
import FilterOption from "./component/FilterOption";
import ResultTable from "./component/ResultTable";

const TransactionsTable = ({ totalCollected, totalSpent, transactions }) => {
  // State for filters
  const [transactionType, setTransactionType] = useState("Tất cả");
  const [startDate, setStartDate] = useState("12/12/2024");
  const [endDate, setEndDate] = useState("12/12/2024");
  const [amountFilter, setAmountFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Calculate pagination values
  const totalRecords = transactions.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Handle pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative p-4">
      {/* Filters Section */}
      <FilterOption
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Results Section */}
      <ResultTable
        totalCollected={totalCollected}
        totalSpent={totalSpent}
        transactions={transactions}
        currentPage={currentPage}
        recordsPerPage={recordsPerPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        setRecordsPerPage={setRecordsPerPage}
      />
    </div>
  );
};

TransactionsTable.propTypes = {
  totalCollected: PropTypes.number.isRequired,
  totalSpent: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TransactionsTable;

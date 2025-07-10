import TablePagination from "../../TablePagination";

// Results Section Component
const ResultTable = ({
  totalCollected,
  totalSpent,
  transactions,
  currentPage,
  recordsPerPage,
  totalPages,
  handlePageChange,
  setRecordsPerPage,
}) => {
  // Calculate paginated transactions
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Results Summary */}
      <div className="border-solid border-border-colorboder border-b-[0.5px] pt-3 pb-3 flex flex-col md:flex-row gap-4 md:gap-[253px] items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-start">
          <div className="text-text-colortextsecondary text-left font-roboto-regular text-base font-normal">
            Kết quả:
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center justify-start">
            <div className="text-left font-roboto-semi-bold text-base font-semibold">
              <span>
                <span className="nav-item-3-span">Thu</span>
                <span className="nav-item-3-span2">{`+ ${totalCollected.toLocaleString()} VND`}</span>
              </span>
            </div>{" "}
            <div className="text-left font-roboto-semi-bold text-base font-semibold">
              <span>
                <span className="nav-item-3-span">Chi</span>
                <span className="nav-item-3-span2">{`- ${totalSpent.toLocaleString()} VND`}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          recordsPerPage={recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Transactions Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-sm font-semibold">ID</th>
              <th className="p-2 text-left text-sm font-semibold">Loại</th>
              <th className="p-2 text-left text-sm font-semibold">Số tiền</th>
              <th className="p-2 text-left text-sm font-semibold">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-200">
                <td className="p-2 text-sm">{transaction.id}</td>
                <td className="p-2 text-sm">{transaction.type}</td>
                <td className="p-2 text-sm">
                  {transaction.amount.toLocaleString()} VND
                </td>
                <td className="p-2 text-sm">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;

import {
  FaStepBackward,
  FaStepForward,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Pagination Component
const TablePagination = ({
  currentPage,
  totalPages,
  recordsPerPage,
  setRecordsPerPage,
  handlePageChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-start">
      {/* Records Per Page */}
      <div className="flex flex-row gap-[7px] items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Bản ghi:
        </div>
        <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center h-8">
          <select
            className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex flex-row gap-4 items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Trang: {currentPage}-{totalPages} của {totalPages}
        </div>
        <div className="flex flex-row gap-4 items-center justify-start">
          <IconButton
            icon={<FaStepBackward className="w-5 h-5 text-gray-500" />}
            onClick={() => handlePageChange(1)}
          />
          <div className="flex flex-row gap-[15px] items-center justify-start">
            <IconButton
              icon={<FaChevronLeft className="w-5 h-5 text-gray-500" />}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            <IconButton
              icon={<FaChevronRight className="w-5 h-5 text-gray-500" />}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
          <IconButton
            icon={<FaStepForward className="w-5 h-5 text-gray-500" />}
            onClick={() => handlePageChange(totalPages)}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Icon Button Component
const IconButton = ({ icon, onClick }) => {
  return (
    <div
      className="p-1 flex flex-row gap-2 items-center justify-center w-8 h-8 cursor-pointer"
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default TablePagination;

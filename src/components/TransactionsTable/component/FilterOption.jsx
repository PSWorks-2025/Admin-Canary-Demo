import { FaChevronRight, FaSearch } from "react-icons/fa";

// Filters Section Component
const FilterOption = ({
  transactionType,
  setTransactionType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  amountFilter,
  setAmountFilter,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="pt-3 pb-3 flex flex-col md:flex-row items-center justify-between self-stretch gap-4 md:gap-2">
      {/* Transaction Type Filter */}
      <div className="flex flex-row gap-[7px] items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Loại giao dịch
        </div>
        <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center h-8">
          <select
            className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value={10}>1</option>
            <option value={20}>2</option>
            <option value={50}>3</option>
          </select>
        </div>
      </div>

      {/* Start Date Filter */}
      <div className="flex flex-row gap-2 items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Từ ngày
        </div>
        <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center w-24 h-8">
          <input
            type="text"
            className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      {/* End Date Filter */}
      <div className="flex flex-row gap-2 items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Đến ngày
        </div>
        <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center w-24 h-8">
          <input
            type="text"
            className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Amount Filter */}
      <div className="flex flex-row gap-[7px] items-center justify-start">
        <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
          Số tiền
        </div>
        <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center h-8">
          <select
            className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
          >
            <option value={10}>1</option>
            <option value={20}>2</option>
            <option value={50}>3</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-bg-colorbglayout rounded-[99px] border-solid border-border-colorboder border p-2 flex flex-row items-center justify-between w-full md:w-64">
        <input
          type="text"
          className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal bg-transparent outline-none w-full"
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="shrink-0 w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
};

// Reusable Filter Dropdown Component
const FilterDropdown = ({ label, value, onChange, icon }) => {
  return (
    <div className="flex flex-row gap-2 items-center justify-start">
      <div className="text-text-colortextsecondary text-left font-roboto-regular text-sm font-normal">
        {label}
      </div>
      <div className="rounded border-solid border-border-colorboder border p-1 flex flex-row gap-2 items-center justify-center w-24 h-8">
        <input
          type="text"
          className="text-text-colortext text-left font-roboto-regular text-sm font-normal bg-transparent outline-none w-full"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default FilterOption;

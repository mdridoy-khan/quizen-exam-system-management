// components/SortDropdown.js
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const SortDropdown = ({ options = [], selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-gradient-to-r from-primary to-secondary flex items-center gap-1 py-1 px-3 rounded-lg text-white"
      >
        Sort by {isOpen ? <IoChevronUp /> : <IoChevronDown />}
      </button>

      {isOpen && (
        <div className="bg-white shadow-xl rounded-xl p-4 absolute z-50 w-80 right-0 top-9">
          {options.map((opt, index) => {
            const inputId = `sort-option-${index}`;
            return (
              <div
                key={opt.value || index}
                className="input-group flex items-center gap-2 mb-2"
              >
                <input
                  type="radio"
                  id={inputId}
                  name="sortOption"
                  value={opt.value}
                  className="w-4 h-4 text-blue600 bg-white border-2 border-gray300 rounded-full checked:bg-blue600 checked:border-blue600 transition duration-200"
                  checked={selected === opt.value}
                  onChange={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                />
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-gray700 cursor-pointer select-none"
                >
                  {opt.label}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;

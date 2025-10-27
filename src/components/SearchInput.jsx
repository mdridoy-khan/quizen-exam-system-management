// components/SearchInput.js

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="border border-primary rounded-lg py-1 px-2 shadow-none outline-none appearance-none bg-transparent focus:border-primary"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;

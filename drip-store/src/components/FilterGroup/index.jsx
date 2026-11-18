
import './style.css';

function FilterGroup({
  title,
  options,
  selectedValues,
  onChange
}) {
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>

      {options.map((option) => (
        <label className="filter-option" key={option}>
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default FilterGroup;

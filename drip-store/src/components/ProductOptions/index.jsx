
import './style.css';

function ProductOptions({
  title,
  options = [],
  selected,
  onChange,
  shape = 'square',
  unavailableOptions = []
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="product-options">
      <h3>{title}</h3>

      <div className="product-options-list">
        {options.map((option) => {
          const unavailable =
            unavailableOptions.includes(option);

          return (
            <button
              key={option}
              type="button"
              disabled={unavailable}
              className={`product-option ${shape} ${
                selected === option ? 'selected' : ''
              } ${unavailable ? 'unavailable' : ''}`}
              onClick={() => onChange(option)}
              aria-pressed={
                !unavailable && selected === option
              }
              title={
                unavailable
                  ? `${option} - Esgotado`
                  : `${option} - Disponível`
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductOptions;

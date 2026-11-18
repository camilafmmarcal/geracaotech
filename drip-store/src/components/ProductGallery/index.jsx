
import { useState } from 'react';
import './style.css';

function GalleryContent({ images, productName }) {
  const [current, setCurrent] = useState(0);

  const validImages = images.filter(Boolean);
  const currentIndex =
    current < validImages.length ? current : 0;

  if (validImages.length === 0) {
    return (
      <div className="product-gallery-empty">
        Imagem indisponível
      </div>
    );
  }

  const nextImage = () => {
    setCurrent(
      (currentIndex + 1) % validImages.length
    );
  };

  const previousImage = () => {
    setCurrent(
      (currentIndex - 1 + validImages.length) %
        validImages.length
    );
  };

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img
          src={validImages[currentIndex]}
          alt={`${productName} - imagem ${currentIndex + 1}`}
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery-arrow previous"
              onClick={previousImage}
              aria-label="Imagem anterior"
            >
              &#10094;
            </button>

            <button
              type="button"
              className="product-gallery-arrow next"
              onClick={nextImage}
              aria-label="Próxima imagem"
            >
              &#10095;
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="product-gallery-thumbnails">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={
                currentIndex === index
                  ? 'product-gallery-thumbnail active'
                  : 'product-gallery-thumbnail'
              }
              onClick={() => setCurrent(index)}
              aria-label={`Visualizar imagem ${index + 1}`}
              aria-pressed={currentIndex === index}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductGallery({
  images = [],
  productName = 'Produto',
}) {
  const validImages = images.filter(Boolean);

  return (
    <GalleryContent
      key={JSON.stringify(validImages)}
      images={validImages}
      productName={productName}
    />
  );
}

export default ProductGallery;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css';

function Gallery() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      subtitle: 'Melhores ofertas personalizadas',
      title: 'Queima de estoque Nike🔥',
      description: 'Confira nossas ofertas especiais Nike.',
      image: '/banner-tenis.png',
      destination: '/products?brand=Nike'
    },
    {
      subtitle: 'Melhores ofertas personalizadas',
      title: 'Ofertas especiais Adidas🔥',
      description: 'Descubra os produtos Adidas disponíveis na loja.',
      image: 'produtos/tenis-adidas.jpeg',
      destination: '/products?brand=Adidas'
    },
    {
      subtitle: 'Encontre seu estilo',
      title: 'Seu estilo começa aqui!',
      description: 'Explore outras marcas e descubra novos produtos.',
      image: 'produtos/tenis-esportivo1.webp',
      destination: '/products?collection=outras-marcas'
    }
  ];

  function nextSlide() {
    setCurrent((previous) =>
      (previous + 1) % slides.length
    );
  }

  function previousSlide() {
    setCurrent((previous) =>
      (previous - 1 + slides.length) % slides.length
    );
  }

  const slide = slides[current];

  return (
    <section className="gallery">
      <div className="gallery-container">
        <div className="gallery-content">
          <p className="gallery-subtitle">
            {slide.subtitle}
          </p>

          <h1>{slide.title}</h1>

          <p className="gallery-description">
            {slide.description}
          </p>

          <button
            type="button"
            className="gallery-button"
            onClick={() => navigate(slide.destination)}
          >
            Ver Ofertas
          </button>
        </div>

        <div className="gallery-visual">
          <img
            src={slide.image}
            alt={slide.title}
            className="gallery-product-image"
          />
        </div>
      </div>

      <button
        type="button"
        className="gallery-arrow gallery-prev"
        onClick={previousSlide}
        aria-label="Banner anterior"
      >
        &#10094;
      </button>

      <button
        type="button"
        className="gallery-arrow gallery-next"
        onClick={nextSlide}
        aria-label="Próximo banner"
      >
        &#10095;
      </button>

      <div className="gallery-dots">
        {slides.map((item, index) => (
          <button
            key={index}
            type="button"
            className={index === current ? 'active' : ''}
            onClick={() => setCurrent(index)}
            aria-label={`Ir para o banner ${index + 1}`}
            aria-current={
              index === current ? 'true' : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}

export default Gallery;

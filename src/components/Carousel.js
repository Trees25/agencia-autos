import React from 'react';

const Carousel = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button 
          type="button" 
          data-bs-target="#carouselExampleCaptions" 
          data-bs-slide-to="0" 
          className="active" 
          aria-current="true" 
          aria-label="Slide 1">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleCaptions" 
          data-bs-slide-to="1" 
          aria-label="Slide 2">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleCaptions" 
          data-bs-slide-to="2" 
          aria-label="Slide 3">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleCaptions" 
          data-bs-slide-to="3" 
          aria-label="Slide 4">
        </button>
        <button 
          type="button" 
          data-bs-target="#carouselExampleCaptions" 
          data-bs-slide-to="4" 
          aria-label="Slide 5">
        </button>
      </div>
      <div className="carousel-inner">

  <div className="carousel-item active">
    <img src="/img/exterior3.jpg" className="d-block w-100" alt="Exterior de auto 3" />
    <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "20px", borderRadius: "10px" }}>
        <h2 className="fw-bold text-white">Descubre la excelencia</h2>
        <p className="text-white mb-0">Autos seleccionados para quienes buscan lo mejor.</p>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <img src="/img/frente2.jpg" className="d-block w-100" alt="Frente de auto 2" />
    <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "20px", borderRadius: "10px" }}>
        <h2 className="fw-bold text-white">Promociones del mes</h2>
        <p className="text-white mb-0">Descuentos únicos que no puedes dejar pasar.</p>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <img src="/img/exterior2.jpg" className="d-block w-100" alt="Exterior de auto 2" />
    <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "20px", borderRadius: "10px" }}>
        <h2 className="fw-bold text-white">Cotiza tu próximo auto</h2>
        <p className="text-white mb-0">Te ofrecemos asesoría personalizada sin compromiso.</p>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <img src="/img/frente1.jpg" className="d-block w-100" alt="Frente de auto 1" />
    <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "20px", borderRadius: "10px" }}>
        <h2 className="fw-bold text-white">Variedad en stock</h2>
        <p className="text-white mb-0">Encuentra el modelo perfecto para ti hoy mismo.</p>
      </div>
    </div>
  </div>

  <div className="carousel-item">
    <img src="/img/exterior4.jpg" className="d-block w-100" alt="Exterior de auto 4" />
    <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "20px", borderRadius: "10px" }}>
        <h2 className="fw-bold text-white">Confianza y experiencia</h2>
        <p className="text-white mb-0">Más de 20 años ofreciendo calidad y seguridad.</p>
      </div>
    </div>
  </div>

</div>

      <button 
        className="carousel-control-prev" 
        type="button" 
        data-bs-target="#carouselExampleCaptions" 
        data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button 
        className="carousel-control-next" 
        type="button" 
        data-bs-target="#carouselExampleCaptions" 
        data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default Carousel;
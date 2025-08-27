import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: isMobile ? "10px 15px" : "15px 30px",
    borderRadius: "10px",
    width: isMobile ? "75%" : "60%",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: isMobile ? "1rem" : "1.8rem",  // texto más pequeño en móviles
    color: "#fff",
    marginBottom: "6px",
    fontWeight: "bold",
  };

  const textStyle = {
    fontSize: isMobile ? "0.7rem" : "1rem", // texto más pequeño en móviles
    color: "#fff",
    marginBottom: "0",
  };

  const slides = [
    {img: "/img/exterior3.jpg", title: "Descubre la excelencia", text: "Autos seleccionados para quienes buscan lo mejor."},
    {img: "/img/frente2.jpg", title: "Promociones del mes", text: "Descuentos únicos que no puedes dejar pasar."},
    {img: "/img/exterior2.jpg", title: "Cotiza tu próximo auto", text: "Te ofrecemos asesoría personalizada sin compromiso."},
    {img: "/img/frente1.jpg", title: "Variedad en stock", text: "Encuentra el modelo perfecto para ti hoy mismo."},
    {img: "/img/exterior4.jpg", title: "Confianza y experiencia", text: "Más de 20 años ofreciendo calidad y seguridad."},
  ];

  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : undefined}
            aria-label={`Slide ${i+1}`}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((item, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img src={item.img} className="d-block w-100" alt={item.title} />
            <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
              <div style={captionStyle}>
                <h2 style={titleStyle}>{item.title}</h2>
                <p style={textStyle}>{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default Carousel;

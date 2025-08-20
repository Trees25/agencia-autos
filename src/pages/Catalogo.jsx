import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaWhatsapp, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import Footer from '../components/Footer.js';

export default function Catalogo() {
  const [autos, setAutos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    const { data, error } = await supabase
      .from("autos")
      .select("*")
      .eq("status", "Disponible")
      .order("creado", { ascending: false });

    if (!error) setAutos(data || []);
  };

  const adminWsp = "5492645851326";

  const openModal = (auto, index = 0) => {
    setSelectedAuto(auto);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAuto(null);
  };

  const prevImage = () => {
    if (!selectedAuto?.imagenes) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedAuto.imagenes.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!selectedAuto?.imagenes) return;
    setCurrentImageIndex((prev) =>
      prev === selectedAuto.imagenes.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main>
      <section className="py-5">
        <div className="container">
          <h1 className="text-center mb-5">Nuestros Vehículos</h1>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {autos.length > 0 ? autos.map(auto => {
              const autoUrl = `${window.location.origin}/catalogo#${auto.id}`;
              const wspMessage = encodeURIComponent(
                `Hola, quiero consultar sobre este auto: ${auto.marca} ${auto.modelo} ${auto.anio}. Link: ${autoUrl}`
              );

              return (
                <div className="col" key={auto.id}>
                  <div className="card h-100">
                    {auto.imagenes?.length > 0 && (
                      <img
                        src={auto.imagenes[0].thumb || auto.imagenes[0]}
                        className="card-img-top"
                        style={{ height: 300, objectFit: "cover", cursor: "pointer" }}
                        alt={`${auto.marca} ${auto.modelo}`}
                        onClick={() => openModal(auto, 0)}
                      />
                    )}
                    <div className="card-body">
                      <h2 className="card-title">{auto.marca} {auto.modelo} {auto.anio}</h2>
                      <p className="card-text">{auto.caracteristicas}</p>
                      <ul className="list-unstyled">
                        <li><strong>Motor:</strong> {auto.motor}</li>
                        <li><strong>Transmisión:</strong> {auto.transmision}</li>
                        <li><strong>Kilómetros:</strong> {auto.km?.toLocaleString()}</li>
                        <li><strong>Combustible:</strong> {auto.combustible}</li>
                        <li><strong>Precio:</strong> ${auto.precio?.toLocaleString()}</li>
                      </ul>
                      <a
                        href={`https://wa.me/${adminWsp}?text=${wspMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success d-flex align-items-center"
                      >
                        <FaWhatsapp size={20} className="me-2"/> Consultar
                      </a>
                    </div>
                  </div>
                </div>
              )
            }) : <p className="text-center">No hay autos disponibles.</p>}
          </div>
        </div>
      </section>
      <Footer />

      {/* Modal de imagen con carrusel */}
      {modalOpen && selectedAuto && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="position-relative"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedAuto.imagenes[currentImageIndex].full || selectedAuto.imagenes[currentImageIndex]}
              alt="Auto grande"
              className="w-100 rounded"
              style={{ objectFit: "contain", maxHeight: "80vh" }}
            />

            {/* Botones de navegación */}
            {selectedAuto.imagenes.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                >
                  <FaArrowRight />
                </button>
              </>
            )}

            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="btn btn-danger position-absolute top-0 end-0 m-2"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

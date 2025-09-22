import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaWhatsapp, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import Footer from "../components/Footer.js";

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

    if (!error) {
      // Normalizamos las imágenes para que siempre sean objetos {thumb, full}
      const normalized = (data || []).map(auto => ({
        ...auto,
        imagenes: (auto.imagenes || []).map(img =>
          typeof img === "string" ? JSON.parse(img) : img
        )
      }));
      setAutos(normalized);
    }
  };

  const adminWsp = "5492645051543";

  const openModal = (auto, index = 0) => {
    setSelectedAuto(auto);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAuto(null);
    setCurrentImageIndex(0);
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
            {autos.length > 0 ? (
              autos.map((auto) => {
                const autoUrl = `${window.location.origin}/catalogo#${auto.id}`;
                const wspMessage = encodeURIComponent(
                  `Hola, quiero consultar sobre este auto: ${auto.marca} ${auto.modelo} ${auto.anio}. Link: ${autoUrl}`
                );

                return (
                  <div className="col" key={auto.id}>
                    <div className="card shadow-sm h-100">
                      {auto.imagenes?.length > 0 && (
                        <img
                          src={auto.imagenes[0].thumb || auto.imagenes[0]}
                          className="card-img-top"
                          style={{
                            height: 200,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          alt={`${auto.marca} ${auto.modelo}`}
                          onClick={() => openModal(auto, 0)}
                        />
                      )}
                      <div className="card-body">
                        <h2 className="card-title">
                          {auto.marca} {auto.modelo}
                        </h2>
                        <ul className="list-unstyled">
                          <li>
                            <strong>Año:</strong> {auto.anio}
                          </li>
                          <li>
                            <strong>Kilometraje:</strong>{" "}
                            {auto.km?.toLocaleString()} km
                          </li>
                          <li>
                            <strong>Combustible:</strong> {auto.combustible}
                          </li>
                          <li>
                            <strong>Motor:</strong> {auto.motor}
                          </li>
                          <li>
                            <strong>Transmisión:</strong> {auto.transmision}
                          </li>
                        </ul>

                        {/* Contenedor de botones centrado */}
                        <div className="d-flex flex-column align-items-center mt-3">
                          {/* Botón de ver detalles */}
                          <button
                            className="btn btn-primary mb-2"
                            onClick={() => openModal(auto, 0)}
                          >
                            Ver detalles
                          </button>

                          {/* Botón de WhatsApp */}
                          <a
                            href={`https://wa.me/${adminWsp}?text=${wspMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success d-flex align-items-center justify-content-center"
                          >
                            <FaWhatsapp size={20} className="me-2" /> Consultar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">No hay autos disponibles.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />

      {/* Modal con carrusel e info completa */}
      {modalOpen && selectedAuto && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
          onClick={closeModal}
        >
          <div
            className="bg-white p-3 rounded position-relative"
            style={{ maxWidth: "90%", maxHeight: "90%", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3">
              {selectedAuto.marca} {selectedAuto.modelo}
            </h3>

            {selectedAuto.imagenes?.length > 0 ? (
              <div className="text-center">
                <img
                  src={
                    selectedAuto.imagenes[currentImageIndex].full ||
                    selectedAuto.imagenes[currentImageIndex]
                  }
                  alt="Auto grande"
                  className="w-100 rounded"
                  style={{ objectFit: "contain", maxHeight: "60vh" }}
                />

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
              </div>
            ) : (
              <p>No hay imágenes disponibles</p>
            )}

            <ul className="mt-3">
              <li>
                <strong>Modelo:</strong> {selectedAuto.modelo}
              </li>
              <li>
                <strong>Año:</strong> {selectedAuto.anio}
              </li>
              <li>
                <strong>Kilometraje:</strong>{" "}
                {selectedAuto.km?.toLocaleString()} km
              </li>
              <li>
                <strong>Combustible:</strong> {selectedAuto.combustible}
              </li>
              <li>
                <strong>Color:</strong> {selectedAuto.color}
              </li>
              <li>
                <strong>Equipamiento:</strong> {selectedAuto.caracteristicas}
              </li>
              <li>
                <strong>Comentario:</strong> {selectedAuto.comentario}
              </li>
            </ul>

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

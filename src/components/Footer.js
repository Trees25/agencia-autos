import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
      <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        <div className="row justify-content-center text-center">
          
          <div className="col-md-4 mb-3">
            <h3 className="titulo-footer">Contacto</h3>
            <ul className="list-unstyled">
              <li>
                <a href="https://wa.me/5492645051543" 
                className="text-white d-flex align-items-center justify-content-center gap-2"
                target="_blank"
                rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
              </li>
              <li>
                <a href="tel:+5492645051543" className="text-white d-flex align-items-center justify-content-center gap-2">
                  <i className="fas fa-phone"></i> +54 9 2645 051543
                </a>
              </li>
            </ul>
          </div>
    
          <div className="col-md-4 mb-3">
            <h3 className="titulo-footer">Sobre nosotros</h3>
            <p>Más de 20 años en el sector, ofreciendo la mejor calidad y servicio.</p>
          </div>
    
          <div className="col-md-4 mb-3">
            <h3 className="titulo-footer">Síguenos</h3>
            <div className="social-links d-flex flex-column align-items-center">
              <a href="https://www.instagram.com/molinaautos?igsh=cmh6Y3RzdzVrMWg3" 
              className="text-white d-flex align-items-center gap-2"
              target="_blank"
              rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
    
        </div>
      </div>
    </footer>

    );
};

export default Footer;

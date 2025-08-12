import { useState } from 'react';
import { supabase } from '../supabaseClient';

function InputImagenes({ imagenes, onChange }) {
  const [loading, setLoading] = useState(false);

  // Subir archivo a supabase storage y actualizar URLs
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setLoading(true);
    const newUrls = [...imagenes];

    for (let file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `autos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('autos')
        .upload(filePath, file);

      if (error) {
        alert('Error subiendo imagen: ' + error.message);
        continue;
      }

      // Obtener URL pública
      const { publicURL, error: urlError } = supabase.storage
        .from('autos')
        .getPublicUrl(filePath);

      if (urlError) {
        alert('Error obteniendo URL pública: ' + urlError.message);
        continue;
      }

      newUrls.push(publicURL);
    }

    onChange(newUrls);
    setLoading(false);
    e.target.value = null;
  };

  const handleRemove = (index) => {
    const filtered = imagenes.filter((_, i) => i !== index);
    onChange(filtered);
  };

  return (
    <div>
      <div className="mb-2">
        <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={loading} />
      </div>
      <div className="d-flex flex-wrap gap-2">
        {imagenes.map((url, i) => (
          <div key={i} style={{ position: 'relative', width: 100, height: 70 }}>
            <img src={url} alt={`Imagen ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                border: 'none',
                background: 'rgba(255, 0, 0, 0.7)',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                cursor: 'pointer',
              }}
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputImagenes;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import imageCompression from "browser-image-compression";

export default function Admin() {
  const [autos, setAutos] = useState([]);
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    anio: '',
    km: '',
    motor: '',
    transmision: '',
    rendimiento: '',
    caracteristicas: '',
    estado: '',
    color: '',
    combustible: '',
    precio: '',
    status: '',
    comentario: '',
    imagenes: [],
    archivosImagenes: null,
  });
  const [editAuto, setEditAuto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) navigate('/login');
    else fetchAutos();
  };
  const fetchAutos = async () => {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser?.user) return;

    const { data, error } = await supabase
      .from("autos")
      .select("*")
      .eq("user_id", currentUser.user.id)
      .order("creado", { ascending: false });

    if (error) {
      console.error("Error al traer autos:", error.message);
      setAutos([]);
    } else {
      // Normalizamos las imágenes
      setAutos(
        (data || []).map(auto => ({
          ...auto,
          imagenes: (auto.imagenes || []).map(img =>
            typeof img === "string" ? JSON.parse(img) : img
          )
        }))
      );
    }
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm(prev => ({ ...prev, archivosImagenes: files }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadImages = async () => {
    if (!form.archivosImagenes || form.archivosImagenes.length === 0) return [];

    const uploadedUrls = [];

    for (const file of form.archivosImagenes) {
      try {
        // Config miniatura
        const thumbOptions = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 300,
          useWebWorker: true,
          fileType: "image/webp",
        };

        // Config imagen grande
        const fullOptions = {
          maxSizeMB: 0.6,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: "image/webp",
        };

        // Miniatura
        const thumbFile = await imageCompression(file, thumbOptions);
        const thumbName = `thumb_${Date.now()}_${file.name.split(".")[0]}.webp`;
        const { error: thumbError } = await supabase.storage.from("autos").upload(thumbName, thumbFile);
        if (thumbError) throw thumbError;
        const { data: thumbData } = supabase.storage.from("autos").getPublicUrl(thumbName);

        // Imagen grande
        const fullFile = await imageCompression(file, fullOptions);
        const fullName = `full_${Date.now()}_${file.name.split(".")[0]}.webp`;
        const { error: fullError } = await supabase.storage.from("autos").upload(fullName, fullFile);
        if (fullError) throw fullError;
        const { data: fullData } = supabase.storage.from("autos").getPublicUrl(fullName);

        uploadedUrls.push({ thumb: thumbData.publicUrl, full: fullData.publicUrl });
      } catch (err) {
        console.error("❌ Error subiendo/comprimiendo:", err.message);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return alert("Debes iniciar sesión");

    const { data: autosExistentes } = await supabase
      .from('autos')
      .select('id')
      .eq('user_id', userData.user.id);

    if (autosExistentes.length >= 10) {
      return alert("Solo puedes tener un máximo de 10 autos publicados.");
    }

    let imagenesUrls = form.imagenes;
    if (form.archivosImagenes && form.archivosImagenes.length > 0) {
      try {
        imagenesUrls = [...imagenesUrls, ...(await uploadImages())];
      } catch {
        return alert('❌ Error subiendo imágenes');
      }
    }

    const autoData = {
      marca: form.marca,
      modelo: form.modelo,
      anio: parseInt(form.anio),
      km: parseInt(form.km),
      motor: form.motor,
      transmision: form.transmision,
      rendimiento: form.rendimiento,
      caracteristicas: form.caracteristicas,
      estado: form.estado,
      color: form.color,
      combustible: form.combustible,
      precio: parseFloat(form.precio),
      status: form.status,
      comentario: form.comentario,
      imagenes: imagenesUrls,
      user_id: userData.user.id,
    };

    const { error } = await supabase.from('autos').insert(autoData);

    if (error) {
      alert("❌ Hubo un error al agregar el auto: " + error.message);
    } else {
      alert("✅ Auto agregado correctamente");
      setForm({
        marca: '', modelo: '', anio: '', km: '', motor: '', transmision: '',
        rendimiento: '', caracteristicas: '', estado: '', color: '',
        combustible: '', precio: '', status: '', comentario: '', imagenes: [], archivosImagenes: null
      });
      fetchAutos();
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSaveEdit = async () => {
    if (!editAuto?.id) return alert("No hay auto seleccionado");

    const updateData = {
      caracteristicas: editAuto.caracteristicas,
      estado: editAuto.estado,
      precio: parseFloat(editAuto.precio) || 0,
      comentario: editAuto.comentario,
      status: editAuto.status,
      actualizado: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('autos')
      .update(updateData)
      .eq('id', editAuto.id);

    if (error) alert("Error al actualizar: " + error.message);
    else { fetchAutos(); setEditAuto(null); }
  };

  const handleDeleteAuto = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este auto?")) return;

    const { error } = await supabase
      .from('autos')
      .delete()
      .eq('id', id);

    if (error) alert("Error al eliminar: " + error.message);
    else fetchAutos();
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Autos</h2>
        <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {/* FORMULARIO DE AGREGAR AUTOS */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input className="form-control mb-2" name="marca" placeholder="Marca" value={form.marca} onChange={handleInput} required />
        <input className="form-control mb-2" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleInput} required />
        <input className="form-control mb-2" name="anio" type="number" placeholder="Año" value={form.anio} onChange={handleInput} required />
        <input className="form-control mb-2" name="km" type="number" placeholder="Kilómetros" value={form.km} onChange={handleInput} />
        <input className="form-control mb-2" name="motor" placeholder="Motor" value={form.motor} onChange={handleInput} />
        <select className="form-select mb-2" name="transmision" value={form.transmision} onChange={handleInput} required>
          <option value="">Selecciona transmisión</option>
          <option value="Manual">Manual</option>
          <option value="Automático">Automático</option>
        </select>
        <input className="form-control mb-2" name="rendimiento" placeholder="Rendimiento" value={form.rendimiento} onChange={handleInput} />
        <input className="form-control mb-2" name="caracteristicas" placeholder="Características" value={form.caracteristicas} onChange={handleInput} />
        <select className="form-select mb-2" name="estado" value={form.estado} onChange={handleInput} required>
          <option value="">Selecciona estado</option>
          <option value="Usado">Usado</option>
          <option value="Nuevo">Nuevo</option>
        </select>
        <input className="form-control mb-2" name="color" placeholder="Color" value={form.color} onChange={handleInput} />
        <select className="form-select mb-2" name="combustible" value={form.combustible} onChange={handleInput} required>
          <option value="">Selecciona combustible</option>
          <option value="Nafta">Nafta</option>
          <option value="Gasoil">Gasoil</option>
        </select>
        <input className="form-control mb-2" name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleInput} />
        <select className="form-select mb-2" name="status" value={form.status} onChange={handleInput} required>
          <option value="">Estado de venta</option>
          <option value="Disponible">Disponible</option>
          <option value="Vendido">Vendido</option>
        </select>
        <textarea
          className="form-control mb-2"
          name="comentario"
          placeholder="Comentario"
          value={form.comentario}
          onChange={handleInput}
        />
        {/* SUBIR IMÁGENES */}
        <input
          className="form-control mb-2"
          type="file"
          name="imagenes"
          multiple
          accept="image/*"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);
            const totalFiles = (form.archivosImagenes?.length || 0) + selectedFiles.length;
            if (totalFiles > 6) { alert("Solo puedes agregar hasta 6 imágenes"); return; }
            setForm(prev => ({ ...prev, archivosImagenes: [...(prev.archivosImagenes || []), ...selectedFiles] }));
          }}
        />

        {/* MINIATURAS DE IMÁGENES SELECCIONADAS */}
        {form.archivosImagenes && form.archivosImagenes.length > 0 && (
          <div className="d-flex flex-wrap mb-2">
            {form.archivosImagenes.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} className="position-relative me-2 mb-2">
                  <img src={url} alt={`preview-${index}`} width={100} height={70} style={{ objectFit: 'cover' }} />

                  {/* Botón eliminar */}
                  <button type="button" onClick={() => {
                    const newFiles = [...form.archivosImagenes];
                    newFiles.splice(index, 1);
                    setForm(prev => ({ ...prev, archivosImagenes: newFiles }));
                  }}
                    style={{
                      position: 'absolute', top: 0, right: 0,
                      background: 'red', color: 'white', border: 'none',
                      borderRadius: '50%', width: 20, height: 20, cursor: 'pointer'
                    }}>
                    &times;
                  </button>

                  {/* Botón mover izquierda */}
                  {index > 0 && (
                    <button type="button" onClick={() => {
                      const newFiles = [...form.archivosImagenes];
                      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
                      setForm(prev => ({ ...prev, archivosImagenes: newFiles }));
                    }}
                      style={{
                        position: 'absolute', bottom: 0, left: 0,
                        background: 'blue', color: 'white', border: 'none',
                        borderRadius: '3px', padding: '0 5px', cursor: 'pointer'
                      }}>
                      ◀
                    </button>
                  )}

                  {/* Botón mover derecha */}
                  {index < form.archivosImagenes.length - 1 && (
                    <button type="button" onClick={() => {
                      const newFiles = [...form.archivosImagenes];
                      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
                      setForm(prev => ({ ...prev, archivosImagenes: newFiles }));
                    }}
                      style={{
                        position: 'absolute', bottom: 0, right: 0,
                        background: 'blue', color: 'white', border: 'none',
                        borderRadius: '3px', padding: '0 5px', cursor: 'pointer'
                      }}>
                      ▶
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button className="btn btn-success" type="submit">Agregar Auto</button>
      </form>

      <hr />
      <h3>Mis autos</h3>
      <div className="row">
        {autos.map((auto) => (
          <div key={auto.id} className="col-md-4 mb-3">
            <div className="card">

              {/* Carrusel de imágenes */}
              {auto.imagenes?.length > 0 && (
                <div id={`carousel-${auto.id}`} className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {auto.imagenes.map((img, index) => {
                      const url = typeof img === "string" ? img : img.thumb;
                      return (
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          <img
                            src={url}
                            alt={`${auto.marca}-${auto.modelo}-${index}`}
                            className="d-block w-100"
                            style={{ height: 200, objectFit: "cover" }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Controles del carrusel */}
                  {auto.imagenes.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carousel-${auto.id}`}
                        data-bs-slide="prev"
                      >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carousel-${auto.id}`}
                        data-bs-slide="next"
                      >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="card-body">
                <h5>{auto.marca} {auto.modelo}</h5>
                <p>{auto.status}</p>
                <button
                  className="btn btn-sm btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => setEditAuto({ ...auto })}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteAuto(auto.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* MODAL DE EDICIÓN */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Auto</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">

              {/* Características */}
              <label htmlFor="edit-caracteristicas" className="form-label">Características</label>
              <input
                id="edit-caracteristicas"
                name="caracteristicas"
                className="form-control mb-2"
                placeholder="Características"
                value={editAuto?.caracteristicas || ''}
                onChange={e => setEditAuto(prev => ({ ...prev, caracteristicas: e.target.value }))}
              />

              {/* Comentario */}
              <label htmlFor="edit-comentario" className="form-label">Comentario</label>
              <textarea
                id="edit-comentario"
                name="comentario"
                className="form-control mb-2"
                placeholder="Comentario"
                value={editAuto?.comentario || ''}
                onChange={e => setEditAuto(prev => ({ ...prev, comentario: e.target.value }))}
              />

              {/* Estado */}
              <label htmlFor="edit-estado" className="form-label">Estado del auto</label>
              <select
                id="edit-estado"
                name="estado"
                className="form-select mb-2"
                value={editAuto?.estado || ''}
                onChange={e => setEditAuto(prev => ({ ...prev, estado: e.target.value }))}
              >
                <option value="">Selecciona estado</option>
                <option value="Usado">Usado</option>
                <option value="Nuevo">Nuevo</option>
              </select>

              {/* Precio */}
              <label htmlFor="edit-precio" className="form-label">Precio</label>
              <input
                id="edit-precio"
                name="precio"
                className="form-control mb-2"
                type="number"
                placeholder="Precio"
                value={editAuto?.precio || ''}
                onChange={e => setEditAuto(prev => ({ ...prev, precio: e.target.value }))}
              />

              {/* Estado de venta */}
              <label htmlFor="edit-status" className="form-label">Estado de venta</label>
              <select
                id="edit-status"
                name="status"
                className="form-select mb-2"
                value={editAuto?.status || ''}
                onChange={e => setEditAuto(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Estado de venta</option>
                <option value="Disponible">Disponible</option>
                <option value="Vendido">Vendido</option>
              </select>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveEdit}>Guardar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

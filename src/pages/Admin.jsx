import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
        imagenes: [], // URLs array
        archivosImagenes: null, // archivos para subir
    });
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAutos();
    }, []);

    const fetchAutos = async () => {
        const { data, error } = await supabase
            .from('autos')
            .select('*')
            .order('creado', { ascending: false });

        if (error) {
            console.error('Error al traer autos:', error.message);
            setAutos([]);
        } else {
            setAutos(data || []);
        }
    };

    const handleInput = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            // Para input file múltiple
            setForm((prev) => ({ ...prev, archivosImagenes: files }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Subir múltiples imágenes y devolver array de URLs públicas
    const uploadImages = async () => {
        if (!form.archivosImagenes || form.archivosImagenes.length === 0) return [];

        const uploadedUrls = [];

        for (const file of form.archivosImagenes) {
            const filename = `${Date.now()}_${file.name}`;
            const { error } = await supabase.storage.from('autos').upload(filename, file);
            if (error) {
                console.error('Error subiendo imagen:', error.message);
                throw error;
            }
            const { data } = supabase.storage.from('autos').getPublicUrl(filename);
            uploadedUrls.push(data.publicUrl);
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit llamado', form);
        let imagenesUrls = form.imagenes; // URLs existentes en edición
        const user = supabase.auth.getUser();

        // Si hay archivos nuevos para subir
        if (form.archivosImagenes && form.archivosImagenes.length > 0) {
            try {
                const newUrls = await uploadImages();
                imagenesUrls = [...(imagenesUrls || []), ...newUrls];
            } catch {
                alert('Error subiendo imágenes');
                return;
            }
        }
        const auto = {
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
            imagenes: imagenesUrls,
            user_id: (await user).data.user.id, // ✅ Aquí
        };

        if (editId) {
            await supabase.from('autos').update(auto).eq('id', editId);
            setEditId(null);
        } else {
            await supabase.from('autos').insert(auto);
        }

        setForm({
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
            imagenes: [],
            archivosImagenes: null,
        });
        fetchAutos();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // Quitar imagen del array en edición
    const removeImageAtIndex = (index) => {
        const newImgs = [...form.imagenes];
        newImgs.splice(index, 1);
        setForm((prev) => ({ ...prev, imagenes: newImgs }));
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestión de Autos</h2>
                <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                {/* Campos de texto */}
                <input className="form-control mb-2" name="marca" placeholder="Marca" value={form.marca} onChange={handleInput} required />
                <input className="form-control mb-2" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleInput} required />
                <input className="form-control mb-2" name="anio" type="number" placeholder="Año" value={form.anio} onChange={handleInput} required />
                <input className="form-control mb-2" name="km" type="number" placeholder="Kilómetros" value={form.km} onChange={handleInput} />
                <input className="form-control mb-2" name="motor" placeholder="Motor" value={form.motor} onChange={handleInput} />
                <select
                    className="form-select mb-2"
                    name="transmision"
                    value={form.transmision}
                    onChange={handleInput}
                    required
                >
                    <option value="">Selecciona transmisión</option>
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                </select>
                <input className="form-control mb-2" name="rendimiento" placeholder="Rendimiento" value={form.rendimiento} onChange={handleInput} />
                <input className="form-control mb-2" name="caracteristicas" placeholder="Características" value={form.caracteristicas} onChange={handleInput} />
                <select
                    className="form-select mb-2"
                    name="estado"
                    value={form.estado}
                    onChange={handleInput}
                    required
                >
                    <option value="">Selecciona estado</option>
                    <option value="Usado">Usado</option>
                    <option value="Nuevo">Nuevo</option>
                </select>
                <input className="form-control mb-2" name="color" placeholder="Color" value={form.color} onChange={handleInput} />
                <select
                    className="form-select mb-2"
                    name="combustible"
                    value={form.combustible}
                    onChange={handleInput}
                    required
                >
                    <option value="">Selecciona combustible</option>
                    <option value="Nafta">Nafta</option>
                    <option value="Gasoil">Gasoil</option>
                </select>
                <input className="form-control mb-2" name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleInput} />
                <select
                    className="form-select mb-2"
                    name="status"
                    value={form.status}
                    onChange={handleInput}
                    required
                >
                    <option value="">Selecciona estado de venta</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Vendido">Vendido</option>
                </select>

                {/* Mostrar imágenes actuales con opción a borrarlas */}
                {form.imagenes.length > 0 && (
                    <div className="mb-2">
                        <label>Imágenes actuales:</label>
                        <div className="d-flex flex-wrap">
                            {form.imagenes.map((url, idx) => (
                                <div key={idx} className="position-relative me-2 mb-2">
                                    <img src={url} alt={`auto-${idx}`} width={100} height={70} style={{ objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeImageAtIndex(idx)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: 20,
                                            height: 20,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subir nuevas imágenes */}
                <input
                    className="form-control mb-2"
                    type="file"
                    name="imagenes"
                    multiple
                    onChange={handleInput}
                />

                <button className="btn btn-success" type="submit">
                    {editId ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

        </div>
    );
}

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import InputImagenes from '../components/InputImagenes';
export default function Catalogo() {
    const [autos, setAutos] = useState([]);
    const [user, setUser] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        getUser();
        fetchAutos();
    }, []);

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (!error) setUser(data.user);
    };

    const fetchAutos = async () => {
        const { data, error } = await supabase
            .from('autos')
            .select('*')
            .order('creado', { ascending: false });

        if (!error) setAutos(data || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro que querés eliminar este auto?')) {
            const { error } = await supabase.from('autos').delete().eq('id', id);
            if (!error) fetchAutos();
        }
    };

    const openEditModal = (auto) => {
        setEditForm(auto);
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { data: currentUser } = await supabase.auth.getUser();
        const uid = currentUser?.user?.id;

        const updateData = {
            status: editForm.status,
            caracteristicas: editForm.caracteristicas,
            precio: parseFloat(editForm.precio) || 0,
            imagenes: editForm.imagenes || [],
            actualizado: new Date().toISOString(),
            user_id: uid
        };

        const { error } = await supabase
            .from('autos')
            .update(updateData)
            .eq('id', editForm.id);

        if (error) {
            alert('Error al actualizar auto: ' + error.message);
            console.error(error);
            return;
        }
        setEditModalOpen(false);
        fetchAutos();
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Catálogo de Autos</h2>
            <div className="row">
                {autos.length > 0 ? (
                    autos.map((auto) => (
                        <div className="col-md-4 mb-4" key={auto.id}>
                            <div className="card h-100">
                                {auto.imagenes?.length > 0 ? (
                                    <div className="d-flex overflow-auto gap-2">
                                        {auto.imagenes.map((imgUrl, idx) => (
                                            <img
                                                key={idx}
                                                src={imgUrl}
                                                alt={`auto-${auto.id}-img-${idx}`}
                                                className="img-thumbnail"
                                                style={{ height: 120, width: 160, objectFit: 'cover' }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className="bg-secondary text-white d-flex justify-content-center align-items-center"
                                        style={{ height: 120 }}
                                    >
                                        Sin imagen
                                    </div>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {auto.marca} {auto.modelo}
                                        {auto.status === 'Vendido' && (
                                            <span className="badge bg-danger ms-2">Vendido</span>
                                        )}
                                    </h5>
                                    <p className="card-text">
                                        Año: {auto.anio}<br />
                                        Kilómetros: {auto.km?.toLocaleString()}<br />
                                        Motor: {auto.motor} - {auto.transmision}<br />
                                        Estado: {auto.estado} - Color: {auto.color}<br />
                                        Combustible: {auto.combustible}<br />
                                        Precio: ${auto.precio?.toLocaleString()}
                                    </p>

                                    {user && (
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-sm btn-primary" onClick={() => openEditModal(auto)}>
                                                Editar
                                            </button>

                                            {auto.status !== 'Vendido' ? (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => alert('No se puede eliminar el auto. Para quitarlo del catálogo, marcá su estado como "Vendido".')}
                                                    disabled
                                                >
                                                    Eliminar
                                                </button>
                                            ) : (
                                                <span className="text-muted">Auto vendido</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No hay autos disponibles.</p>
                )}
            </div>

            {/* Modal de edición */}
            {editModalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleUpdate}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Auto</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Estado / Disponibilidad</label>
                                        <select
                                            name="status"
                                            value={editForm.status || ''}
                                            onChange={handleEditChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Seleccioná estado</option>
                                            <option value="Disponible">Disponible</option>
                                            <option value="Vendido">Vendido</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Características</label>
                                        <textarea
                                            name="caracteristicas"
                                            value={editForm.caracteristicas || ''}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describí las características del auto"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Precio</label>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={editForm.precio || ''}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Imágenes</label>
                                        <InputImagenes
                                            imagenes={editForm.imagenes || []}
                                            onChange={(imgs) => setEditForm({ ...editForm, imagenes: imgs })}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">
                                        Guardar
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Package, Save, ArrowLeft } from 'lucide-react';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [uom, setUom] = useState('');
    const [description, setDescription] = useState('');
    const [reorderLevel, setReorderLevel] = useState(0);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/products/${id}`);
                    setName(data.name);
                    setSku(data.sku);
                    setCategory(data.category);
                    setUom(data.uom);
                    setDescription(data.description);
                    setReorderLevel(data.reorderLevel);
                } catch (err) {
                    console.error("Failed to fetch product", err);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { name, sku, category, uom, description, reorderLevel };
        try {
            if (isEditMode) {
                await api.put(`/products/${id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving product', error);
            alert('Error saving product');
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Link to="/products" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to Products
                        </Link>
                    </div>
                    <h1 className="page-title">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
                </div>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                className="form-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Wireless Mouse"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">SKU (Stock Keeping Unit)</label>
                            <input
                                className="form-input"
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="e.g. ACC-001"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input
                                className="form-input"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Electronics"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Unit of Measure (UOM)</label>
                            <select
                                className="form-input"
                                value={uom}
                                onChange={(e) => setUom(e.target.value)}
                                required
                            >
                                <option value="">Select UOM</option>
                                <option value="Unit">Unit</option>
                                <option value="Box">Box</option>
                                <option value="Kg">Kg</option>
                                <option value="Liter">Liter</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Reorder Level</label>
                            <input
                                className="form-input"
                                type="number"
                                value={reorderLevel}
                                onChange={(e) => setReorderLevel(Number(e.target.value))}
                                placeholder="Min quantity before alert"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                            <Save size={18} /> {isEditMode ? 'Update Product' : 'Save Product'}
                        </button>
                        <Link to="/products" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Package, Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get(`/products?pageNumber=${page}&keyword=${keyword}`);
                setProducts(data.products);
                setPages(data.pages);
                setPage(data.page);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };
        fetchProducts();
    }, [page, keyword]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                alert('Error deleting product');
            }
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p style={{ color: '#6B7280' }}>Manage your product catalog and inventory levels</p>
                </div>
                <Link to="/products/new" className="btn btn-primary" style={{ width: 'auto' }}>
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search by name, SKU or category..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>UOM</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{product.sku}</td>
                                <td>{product.name}</td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td>{product.uom}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Link to={`/products/${product._id}/edit`} className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'none' }}>
                                        <Edit2 size={18} color="#4F46E5" />
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        style={{ background: 'none', border: 'none', padding: '0.4rem', cursor: 'pointer', marginLeft: '0.5rem' }}
                                    >
                                        <Trash2 size={18} color="#EF4444" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', width: '40px', height: '40px' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Page <strong>{page}</strong> of {pages}
                </span>
                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', width: '40px', height: '40px' }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ProductList;

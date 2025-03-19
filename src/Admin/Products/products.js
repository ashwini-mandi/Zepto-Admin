import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table } from "react-bootstrap";

const FIREBASE_BASE_URL =
  "https://restaraunt-admin-default-rtdb.firebaseio.com";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    name: "",
    imageUrl: "",
    categoryId: "",
    subcategoryId: "",
    description: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${FIREBASE_BASE_URL}/categories.json`
        );
        if (response.data) {
          setCategories(
            Object.entries(response.data).map(([id, cat]) => ({
              id,
              name: cat.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${FIREBASE_BASE_URL}/subcategories.json`
        );
        if (response.data) {
          setSubcategories(
            Object.entries(response.data).map(([id, sub]) => ({
              id,
              name: sub.name,
              categoryId: sub.categoryId,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${FIREBASE_BASE_URL}/products.json`);
        if (response.data) {
          setProducts(
            Object.entries(response.data).map(([id, product]) => ({
              id,
              ...product,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setNewProduct({
      ...newProduct,
      categoryId: e.target.value,
      subcategoryId: "",
    });
  };

  const handleAddProductClick = () => {
    setNewProduct({
      productId: "",
      name: "",
      imageUrl: "",
      categoryId: "",
      subcategoryId: "",
      description: "",
    });
    setEditProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    if (newProduct.name && newProduct.imageUrl && newProduct.categoryId) {
      try {
        if (editProduct) {
          await axios.put(
            `${FIREBASE_BASE_URL}/products/${editProduct.id}.json`,
            newProduct
          );
          setProducts(
            products.map((prod) =>
              prod.id === editProduct.id ? { ...newProduct, id: prod.id } : prod
            )
          );
        } else {
          const response = await axios.post(
            `${FIREBASE_BASE_URL}/products.json`,
            newProduct
          );
          setProducts([...products, { id: response.data.name, ...newProduct }]);
        }
        setShowModal(false);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${FIREBASE_BASE_URL}/products/${id}.json`);
      setProducts(products.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddProductClick}>
          Add Product
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Image</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod.id}>
              <td>{index + 1}</td>

              <td>{prod.name}</td>
              <td>
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                {categories.find((cat) => cat.id === prod.categoryId)?.name ||
                  "Unknown"}
              </td>
              <td>
                {subcategories.find((sub) => sub.id === prod.subcategoryId)
                  ?.name || "None"}
              </td>
              <td>{prod.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditProduct(prod)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteProduct(prod.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Scrollable Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={newProduct.imageUrl}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newProduct.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                name="subcategoryId"
                value={newProduct.subcategoryId}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {subcategories
                  .filter((sub) => sub.categoryId === newProduct.categoryId)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newProduct.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editProduct ? "Update Product" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;

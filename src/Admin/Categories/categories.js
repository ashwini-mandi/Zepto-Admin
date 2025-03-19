import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const FIREBASE_BASE_URL =
  "https://restaraunt-admin-default-rtdb.firebaseio.com/categories";

const Categories = () => {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${FIREBASE_BASE_URL}.json`);
        if (response.data) {
          const formattedData = Object.keys(response.data).map((key) => ({
            id: key,
            name: response.data[key].name,
            url: response.data[key].url,
          }));
          setCategories(formattedData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleClose = () => {
    setShow(false);
    setCategoryName("");
    setCategoryUrl("");
    setEditId(null);
  };
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim() || !categoryUrl.trim()) return;

    try {
      if (editId) {
        await axios.patch(`${FIREBASE_BASE_URL}/${editId}.json`, {
          name: categoryName,
          url: categoryUrl,
        });
      } else {
        await axios.post(`${FIREBASE_BASE_URL}.json`, {
          name: categoryName,
          url: categoryUrl,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Error saving category:", error);
    }
    handleClose();
  };

  const handleEdit = (id) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditId(id);
      setCategoryName(category.name);
      setCategoryUrl(category.url);
      handleShow();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${FIREBASE_BASE_URL}/${id}.json`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <Button variant="primary" onClick={handleShow}>
          <FaPlus className="me-2" /> Add Category
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Category URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.url}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(cat.id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No categories added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit" : "Add"} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category URL"
                value={categoryUrl}
                onChange={(e) => setCategoryUrl(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {editId ? "Update" : "Save"} Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;

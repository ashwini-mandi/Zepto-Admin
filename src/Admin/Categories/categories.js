import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Categories = () => {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track edit mode

  // Open & Close Modal
  const handleClose = () => {
    setShow(false);
    setCategoryName("");
    setCategoryUrl("");
    setEditIndex(null); // Reset edit index when closing modal
  };
  const handleShow = () => setShow(true);

  // Handle Form Submission (Add/Edit Category)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim() && categoryUrl.trim()) {
      if (editIndex !== null) {
        // Editing an existing category
        const updatedCategories = [...categories];
        updatedCategories[editIndex] = { name: categoryName, url: categoryUrl };
        setCategories(updatedCategories);
      } else {
        // Adding a new category
        setCategories([
          ...categories,
          { name: categoryName, url: categoryUrl },
        ]);
      }
      handleClose();
    }
  };

  // Handle Edit Click
  const handleEdit = (index) => {
    setEditIndex(index);
    setCategoryName(categories[index].name);
    setCategoryUrl(categories[index].url);
    handleShow();
  };

  // Handle Delete Click
  const handleDelete = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categories</h2>
        <Button variant="primary" onClick={handleShow}>
          <FaPlus className="me-2" /> Add Category
        </Button>
      </div>

      {/* Category Table */}
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.url}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(index)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(index)}
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

      {/* Bootstrap Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Edit" : "Add"} Category
          </Modal.Title>
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
              {editIndex !== null ? "Update" : "Save"} Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Categories;

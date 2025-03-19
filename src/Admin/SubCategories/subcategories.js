import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table } from "react-bootstrap";

const FIREBASE_BASE_URL =
  "https://restaraunt-admin-default-rtdb.firebaseio.com";

const Subcategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    url: "",
    categoryId: "",
  });
  const [editSubcategory, setEditSubcategory] = useState(null);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${FIREBASE_BASE_URL}/categories.json`
        );
        if (response.data) {
          const categoriesArray = Object.entries(response.data).map(
            ([id, category]) => ({
              id,
              name: category.name,
            })
          );
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories from Firebase
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${FIREBASE_BASE_URL}/subcategories.json`
        );
        if (response.data) {
          const subcategoriesArray = Object.entries(response.data).map(
            ([id, sub]) => ({
              id,
              name: sub.name,
              url: sub.url,
              categoryId: sub.categoryId,
            })
          );
          setSubcategories(subcategoriesArray);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setNewSubcategory({ ...newSubcategory, [e.target.name]: e.target.value });
  };

  // Handle adding a new subcategory
  const handleAddSubcategory = async () => {
    if (
      newSubcategory.name.trim() !== "" &&
      newSubcategory.url.trim() !== "" &&
      newSubcategory.categoryId
    ) {
      const newSub = { ...newSubcategory };

      try {
        const response = await axios.post(
          `${FIREBASE_BASE_URL}/subcategories.json`,
          newSub
        );
        setSubcategories([
          ...subcategories,
          { id: response.data.name, ...newSub },
        ]);
        setShowModal(false);
        setNewSubcategory({ name: "", url: "", categoryId: "" });
      } catch (error) {
        console.error("Error adding subcategory:", error);
      }
    }
  };

  // Handle editing a subcategory
  const handleEditSubcategory = (sub) => {
    setEditSubcategory(sub);
    setNewSubcategory(sub);
    setShowModal(true);
  };

  // Handle updating a subcategory
  const handleUpdateSubcategory = async () => {
    if (editSubcategory) {
      try {
        await axios.put(
          `${FIREBASE_BASE_URL}/subcategories/${editSubcategory.id}.json`,
          newSubcategory
        );
        setSubcategories(
          subcategories.map((sub) =>
            sub.id === editSubcategory.id
              ? { ...newSubcategory, id: sub.id }
              : sub
          )
        );
        setShowModal(false);
        setEditSubcategory(null);
        setNewSubcategory({ name: "", url: "", categoryId: "" });
      } catch (error) {
        console.error("Error updating subcategory:", error);
      }
    }
  };

  // Handle deleting a subcategory
  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(`${FIREBASE_BASE_URL}/subcategories/${id}.json`);
      setSubcategories(subcategories.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  // Filtered subcategories based on search term
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Manage Subcategories</h2>

      {/* Search and Add Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search subcategories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Subcategory
        </Button>
      </div>

      {/* Subcategories Table */}
      <Table striped bordered hover responsive>
        <thead className="table">
          <tr>
            <th>#</th>
            <th>Subcategory Name</th>
            <th>URL</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubcategories.length > 0 ? (
            filteredSubcategories.map((sub, index) => (
              <tr key={sub.id}>
                <td>{index + 1}</td>
                <td>{sub.name}</td>
                <td>{sub.url}</td>
                <td>
                  {categories.find((cat) => cat.id === sub.categoryId)?.name ||
                    "Unknown"}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditSubcategory(sub)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteSubcategory(sub.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No subcategories found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Subcategory */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editSubcategory ? "Edit Subcategory" : "Add Subcategory"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSubcategory.name}
                onChange={handleChange}
                placeholder="Enter subcategory name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={newSubcategory.url}
                onChange={handleChange}
                placeholder="Enter subcategory URL"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={newSubcategory.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={
              editSubcategory ? handleUpdateSubcategory : handleAddSubcategory
            }
          >
            {editSubcategory ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Subcategories;

import React, { useState } from "react";

const Offers = () => {
  const [offers, setOffers] = useState([
    { id: 1, title: "Diwali Sale - 50% Off", validTill: "30th Oct" },
    { id: 2, title: "New Year Sale - 30% Off", validTill: "1st Jan" },
  ]);
  const [newOffer, setNewOffer] = useState({ title: "", validTill: "" });

  const handleAddOffer = () => {
    if (newOffer.title && newOffer.validTill) {
      setOffers([...offers, { id: offers.length + 1, ...newOffer }]);
      setNewOffer({ title: "", validTill: "" });
    }
  };

  const handleDeleteOffer = (id) => {
    setOffers(offers.filter((offer) => offer.id !== id));
  };

  return (
    <div>
      <h2>Manage Offers</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter offer title"
          value={newOffer.title}
          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Valid Till (e.g., 30th Oct)"
          value={newOffer.validTill}
          onChange={(e) =>
            setNewOffer({ ...newOffer, validTill: e.target.value })
          }
        />
        <button className="btn btn-primary" onClick={handleAddOffer}>
          Add Offer
        </button>
      </div>
      <ul className="list-group">
        {offers.map((offer) => (
          <li
            key={offer.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {offer.title} - Valid Till: {offer.validTill}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteOffer(offer.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Offers;

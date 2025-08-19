import React, { useState } from "react";
import axios from "axios";

const InstitutionForm = () => {
  const [formData, setFormData] = useState({
    institution_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    contact_phone: "",
    contact_email: "",
    website: "",
    logo_url: "",
    affiliation_board: "",
    udise_code: "",
    gstin: "",
    pan: "",
    established_date: ""
  });

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
 try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/create/institution",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Institution Created Successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating institution");
    }
  };


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Institution</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="institution_name"
          placeholder="Institution Name"
          value={formData.institution_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address_line1"
          placeholder="Address Line 1"
          value={formData.address_line1}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="address_line2"
          placeholder="Address Line 2"
          value={formData.address_line2}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="contact_phone"
          placeholder="Contact Phone"
          value={formData.contact_phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="contact_email"
          placeholder="Contact Email"
          value={formData.contact_email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="logo_url"
          placeholder="Logo URL"
          value={formData.logo_url}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="affiliation_board"
          placeholder="Affiliation Board"
          value={formData.affiliation_board}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="udise_code"
          placeholder="UDISE Code"
          value={formData.udise_code}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="gstin"
          placeholder="GSTIN"
          value={formData.gstin}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="pan"
          placeholder="PAN"
          value={formData.pan}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="established_date"
          value={formData.established_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Institution
        </button>
      </form>
    </div>
  );
};

export default InstitutionForm;

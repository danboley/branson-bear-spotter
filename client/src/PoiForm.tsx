// import React, { useState } from 'react';

// const PoiForm: React.FC = () => {
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [image, setImage] = useState<File | null>(null);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('address', address);
//     if (image) {
//       formData.append('image', image);
//     }

//     // Assuming you're using fetch to send data to your backend
//     const response = await fetch('/api/pois', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.ok) {
//       // Handle success
//     } else {
//       // Handle error
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Location Name"
//         required
//       />
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Address"
//         required
//       />
//       <input
//         type="file"
//         onChange={(e) => {
//           if (e.target.files) {
//             setImage(e.target.files[0]);
//           }
//         }}
//         accept="image/*"
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default PoiForm;

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

const PoiSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    details: "",
    latitude: "",
    longitude: "",
    image: null as File | null,
    approvalNotes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("formData", formData);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("details", formData.details);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("approvalNotes", formData.approvalNotes);
    // Update to current user's ID later
    data.append("userId", "6213ec18-7298-4183-9ded-1aa852e64a28");
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post("/api/pois", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("POI submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting POI:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Location Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Details:</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Approval Notes:</label>
        <input
          type="text"
          name="approvalNotes"
          value={formData.approvalNotes}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" name="image" onChange={handleFileChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PoiSubmissionForm;
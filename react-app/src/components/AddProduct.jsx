import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";
import './AddProduct.css'; // 👈 Import custom styles

function AddProduct() {
  const navigate = useNavigate();

  const [pname, setpname] = useState('');
  const [pdesc, setpdesc] = useState('');
  const [price, setprice] = useState('');
  const [category, setcategory] = useState('');
  const [pimage, setpimage] = useState('');
  const [pimage2, setpimage2] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  const handleApi = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const formData = new FormData();
      formData.append('plat', position.coords.latitude);
      formData.append('plong', position.coords.longitude);
      formData.append('pname', pname);
      formData.append('pdesc', pdesc);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('pimage', pimage);
      formData.append('pimage2', pimage2);
      formData.append('userId', localStorage.getItem('userId'));

      const url = API_URL + '/add-product';
      axios.post(url, formData)
        .then((res) => {
          if (res.data.message) {
            alert(res.data.message);
            navigate('/');
          }
        })
        .catch(() => {
          alert('Server error');
        });
    });
  };

  return (
    <div>
      <Header />

      <div className="add-product-wrapper">
        <h2 className="add-product-title">Add Product</h2>
        <div className="add-product-card">

          <label>Product Name</label>
          <input className="form-control" type="text" value={pname} onChange={(e) => setpname(e.target.value)} />

          <label>Product Description</label>
          <input className="form-control" type="text" value={pdesc} onChange={(e) => setpdesc(e.target.value)} />

          <label>Product Price</label>
          <input className="form-control" type="text" value={price} onChange={(e) => setprice(e.target.value)} />

          <label>Product Category</label>
          <select className="form-control" value={category} onChange={(e) => setcategory(e.target.value)}>
            <option disabled value="">-- Select Category --</option>
            <option>Quilts and covers</option>
            <option>Dustbin</option>
            <option>Foot-mats</option>
            <option>Bathing products</option>
            <option>Books</option>
            <option>Electronics</option>
            <option>Broomstick and Dustpan</option>
            <option>Mattresses</option>
            <option>Question papers</option>
            <option>Bed </option>
            {
              categories.map((item, index) => (
                <option key={'cat-' + index}>{item}</option>
              ))
            }
          </select>

          <label>Product Image</label>
          <input className="form-control" type="file" onChange={(e) => setpimage(e.target.files[0])} />

          <label>Second Image (optional)</label>
          <input className="form-control" type="file" onChange={(e) => setpimage2(e.target.files[0])} />

          <button onClick={handleApi} className="btn btn-primary submit-btn mt-3">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

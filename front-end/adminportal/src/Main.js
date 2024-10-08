import React from 'react';
import './index.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditProducts from "./pages/EditProducts";
import BlockAndUnblock from './pages/BlockAndUnblock';
import GetBadReviews from './pages/getBadReviews';
import Footer from './components/Footer';


function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/editProducts' element={<EditProducts />} />
        <Route path='/badReviews' element={<GetBadReviews />} />
        <Route path='/blockAndUnblock' element={<BlockAndUnblock />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Main;
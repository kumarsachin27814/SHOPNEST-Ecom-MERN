import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";


// all product
export const getProducts = async (req , res) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json(allProducts)
  } catch (error) {
    return res.status(500).json({message: 'Sever error'})
  }
}
 // specific product
export const getProductById = async (req, res) => {
  try {
    const Products = await Product.findById(req.params.id);
    return res.status(200).json(Products);
  } catch (error) {
    return res.status(500).json({ message: "Sever error" });
  }
};

export const createProduct = async (req , res) => {
  try {
    const {name , description , price , category , stock } = req.body;
    let imageUrl = '';
    if(req.file){ // if muler through image aayega
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const product = new Product({
      name , 
      description,
      price , 
      category,
      stock,
      imageUrl
    });
    const savedProduct = await product.save();
    return res.status(201).json({savedProduct});
  } catch (error) {
    return res.status(500).json({ message: "Sever error" });
  }
};

export const updateProduct = async (req , res) => {
  try {
    const {name , description , price , category , stock } = req.body;
    const product = await Product.findById(req.params.id);
    if(product){
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;

      }
      const updatedProduct = await product.save();
      return res.json(updatedProduct);

    }
    else{
      return res.status(404).json({message: 'product not found'});
    }
  } catch (error) {
    return res.status(500).json({ message: "Sever error" });
  }
};

export const deleteProduct = async (req , res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Product Removed" });
    } else {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Sever error" });
  }
};


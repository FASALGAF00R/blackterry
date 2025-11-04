const category = require("../category/categoryModel");
const Product = require("../products/productModel");

const addProduct = async (req, res) => {
    console.log("entereddd");
    try {
        const {categoryid, title, description, actualPrice,product_Code,discount,manufacture_name,manufacturerBrand,manufacturerAddress,totalStock} = req.body;   
        console.log(req.body,"llllllllllll");
        const categoryExists = await category.findById(categoryid);
        console.log(categoryExists.name,"lllll");
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        const imagePaths = req.files.map(file => `uploads/${file.filename}`);
        const images = imagePaths;


    let offerPrice = actualPrice;
        if (discount && discount > 0) {
            offerPrice = actualPrice - (actualPrice * discount / 100);
        }



        const product = new Product({
            categoryid,
            categoryName: categoryExists.name,
            title,
            description,
            actualPrice,
            offerPrice,
            images,
            product_Code,
            discount,
            manufacture_name,
            manufacturerBrand,
            manufacturerAddress,
            totalStock

        });



        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    addProduct
};






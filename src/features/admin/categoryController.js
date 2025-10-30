const categoryModel = require("../category/categoryModel");

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new categoryModel({ name });
        await category.save();
        res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }   

}

const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const  name  = req.body;
        const category = await categoryModel.findByIdAndUpdate(id, name , { new: true });
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

    module.exports = {  
    addCategory,
    editCategory
    }
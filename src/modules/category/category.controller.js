import CategoryModel from "../../../db/models/category.model.js";
import multer from 'multer';
import {
    v4 as uuidv4
} from 'uuid';
import UserModel from "../../../db/models/user.model.js";
import isEmpty from "../../../helper/checkOnBody.js";

//multer

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/webp': 'webp',
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isvalidtype = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isvalidtype) {
            uploadError = null;
        }
        cb(uploadError, 'uploads/categories')
    },
    filename: function (req, file, cb) {

        const fileName = uuidv4() + "-" + file.originalname.replace(" ", "-");
        if (fileName)
            cb(null, fileName)
    }
});

export const upload = multer({
    storage: storage
});

// All Categories
export const AllCategory = async (req, res) => {
    try {
        let allCat = await CategoryModel.find();
        if (!allCat.length) return res.json({
            "message": "No Category Added Yet"
        })
        res.json({
            "messages": "all categories",
            allCat
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Categories Data"
        });
    }

}
//get specific Category
export const SpecificCategory = async (req, res) => {
    try {
        let catId = req.params.id;
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!catId) return res.json({ "message": "Invalid Category Id"});
        let catData = await CategoryModel.findById({
            _id: catId
        });
        res.status(200).json({
            "message": "category data ",
            catData
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Category Data"
        });
    }
}
// Add New Category
export const AddCategory = async (req, res) => {
    // console.log(!req.file);
    try {
        let {name} = req.body;
        const category = await CategoryModel.findOne({
            categoryName: name
        });
        if (category) return res.json({
            "message": "Category Already Exist"
        });
        if (req.file) {
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/uploads/category/`;
            let addedCategory = await CategoryModel.insertMany({
                categoryName: name,
                image: `${basePath}${fileName}`,
                createdBy: req.userId
            });

            res.json({
                "message": "Category Added Successfully",
                addedCategory
            })
        } else {
            res.json({
                "message": "image is required"
            })

        }
    } catch (error) {
        res.status(500).json({
            "message": "Failed to Add Category Data"
        });
    }

}

//Update Category
export const UpdateCategory = async (req, res) => {
   
    try {
        // console.log(req.file);
        let catId = req.params.id;
        if(isEmpty(req.body)) return res.json({"message":"You Can't Perform Update On Empty Field"});
        let { name ,createdBy} = req.body;
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!catId) return res.json({ "message": "Invalid Category Id" });

        // Retrieve the category data by ID
        let catData = await CategoryModel.findById(catId);
        if (!catData) return res.json({ "message": "Category not found" });

        // Check if the user is authorized to update the category
        if (req.role == "admin" || req.userId == catData.createdBy) {
            let updateFields={};
            if(name){
                updateFields.categoryName= name;
            }
            if(createdBy){
                let checkuser=await UserModel.findById({_id:createdBy});
                if(!checkuser) return res.json({"message":"invalid user"});
                updateFields.createdBy= createdBy;
            }
            // If there's a file attached in the request, update the image
            if (req.file) {
                const fileName = req.file.filename;
                const basePath = `${req.protocol}://${req.get('host')}/uploads/category/`;
                updateFields.image = `${basePath}${fileName}`;
            }

            // Update the category using its ID
            let updatedCategory = await CategoryModel.findByIdAndUpdate(catId, updateFields, { new: true });

            res.json({ "message": "Category Updated Successfully", updatedCategory });
        } else {
            res.status(401).json({ "message": "Not Authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Failed to Update Category" });
    }
}

// Delete Category

export const DeleteCategory = async (req, res) => {
    try {
        let catId = req.params.id;
        // console.log(req.userId);
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!catId) return res.json({ "message": "Invalid Category Id"});
        let catData = await CategoryModel.findById({
            _id: catId
        });
        if (!catData) return res.json({ "message": "Category not found" });
        if (req.role == "admin" || req.userId == catData.createdBy) {
            await CategoryModel.findByIdAndDelete({
                _id: catId
            });
            res.status(200).json({
                "message": "Category Deleted Successfully"
            });
        } else {
            res.status(401).json({
                "message": "Not Authorized to perform this action"
            });
        }

    } catch (error) {
        res.status(500).json({
            "message": "Failed to Delete Category"
        });
    }
}
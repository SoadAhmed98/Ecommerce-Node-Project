import ProductModel from '../../../db/models/product.model.js';
import multer from 'multer';
import slugify from 'slugify';
import {v4 as uuidv4} from 'uuid';
import CategoryModel from '../../../db/models/category.model.js';
import { ObjectId } from 'mongodb';
import UserModel from '../../../db/models/user.model.js';
import isEmpty from '../../../helper/checkOnBody.js';


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
        cb(uploadError, 'uploads/products')
    },
    filename: function (req, file, cb) {

        const fileName = uuidv4() + "-" + file.originalname.replace(" ", "-");
        if (fileName)
            cb(null, fileName)
    }
});

export const upload = multer({storage: storage});

//get all Products

export const AllProduct = async (req, res) => {
    
   try {
        let { page = 1, limit = 5 } = req.query;
        // console.log( typeof(limit) ,typeof (page) ); //don't forget that type of limit and page are string so we need to make parseInt()
        let allPro = await ProductModel.aggregate([
            {
                $facet: {
                    metaData: [
                        {
                            $count: "totalDocuments"
                        },
                        {
                            $addFields: {
                                pageNumber: page,
                                totalPages: { $ceil: { $divide: ["$totalDocuments", parseInt(limit)] } }
                            }
                        }
                    ],
                    data: [
                        {
                            $skip: (parseInt(page) - 1) * parseInt(limit) //if this is the first page, we don't need to skip anything
                        },
                        {
                            $limit: parseInt(limit)
                        }
                    ]
                }
            }
        ]);
        let allProResult = allPro[0];
        allProResult.metaData = { ...allProResult.metaData[0], count: allProResult.data.length };
        if (!allProResult.data.length) {
                    return res.json({
                        "message": "No Product Added Yet"
                        
                    });
                }
                res.json({
                    "message": "all Products",
                    allProResult
                });
            } catch (error) {
                res.status(500).json({
                    "message": "Failed to retrieve Products Data"
                });
            }
}

// get all product in the same category
export const AllProductSameCat = async (req, res) => {
    
    try {
        let catId = req.params.id;
        let categoryId = new ObjectId(catId);
        // console.log(typeof(catId));
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!catId) return res.json({
            "message": "Invalid Category Id"
        });
        let catData = await CategoryModel.findById({
            _id: catId
        });
        if(!catData) return res.json({"message":"Invalid Category Id"})
         let { page = 1, limit = 5 } = req.query;


         console.log( typeof(limit) ,typeof (page) ); //don't forget that type of limit and page are string so we need to make parseInt()
         let allPro = await ProductModel.aggregate([
             

                {
                    $match: {
                        category: categoryId
                    }
                }
                 ,
                 {
                    $facet: {
                        metaData: [
                            {
                                $count: "totalDocuments"
                            },
                            {
                                $addFields: {
                                    pageNumber: page,
                                    totalPages: { $ceil: { $divide: ["$totalDocuments", parseInt(limit)] } }
                                }
                            }
                        ],
                        data: [
                            {
                                $skip: (parseInt(page) - 1) * parseInt(limit) //if this is the first page, we don't need to skip anything
                            },
                            {
                                $limit: parseInt(limit)
                            }
                        ]
                    }
                 }
             
         ]);
         let allProResult = allPro[0];
         allProResult.metaData = { ...allProResult.metaData[0], count: allProResult.data.length };
         if (!allProResult.data.length) {
                     return res.json({
                         "message": "No Product Added Yet"
                         
                     });
                 }
                 res.json({
                     "message": "all Products",
                     allProResult
                 });
             return  res.json({allPro})
             } catch (error) {
                 res.status(500).json({
                     "message": "Failed to retrieve Products Data"
                 });
             }
 }
// get specific product
export const SpecificProduct =async (req,res)=>{
    
    try {
        let proId = req.params.id;
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!proId) { return res.json({"message": "Invalid Product Id"});}
        let proData = await ProductModel.findById({
            _id: proId
        });
        if(!proData) return res.status(500).json({"message":"Product Not Found"})
        res.status(200).json({
            "message": "product data ",
            proData
        });
    } catch (error) {
        res.status(500).json({
            "message": "Failed to retrive Product Data"
        });
    }
}
//Add New Product
export const AddProduct =async (req,res)=>{
    try {
        let {name,price,category,stock} = req.body;
        const product = await ProductModel.findOne({
            productName: name
        });
        if (product) return res.json({
            "message": "Product Already Exist"
        });
        if (req.file) {
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/uploads/products/`;
            //check if this category already exist
            let cat= await CategoryModel.findById({ _id:category});
            if(!cat) return res.json({"message":"This Catergory don't exist"});
            let addedProduct = await ProductModel.insertMany({
                productName: name,
                slug:slugify(name),
                image: `${basePath}${fileName}`,
                price:price,
                category:category,
                stock:stock,
                createdBy:req.userId
            });

            res.json({
                "message": "Product Added Successfully",
                addedProduct
            })
        } else {
            res.json({
                "message": "image is required"
            })

        }
    } catch (error) {
        res.status(500).json({
            "message": "Failed to Add Product Data"
        });
    }
}
//update product
export const UpdateProduct = async (req, res) => {
   
    try {
        // console.log(req.file);
        let proId = req.params.id;
        if(isEmpty(req.body)) return res.json({"message":"You Can't Perform Update On Empty Field"});
        let { name,priceAfterDiscount,finalPrice,category,stock,createdBy} = req.body;
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!proId) return res.json({ "message": "Invalid Category Id" });

        // Retrieve the product data by ID
        let proData = await ProductModel.findById(proId);
        if (!proData) return res.json({ "message": "Product not found" });
       
        // Check if the user is authorized to update the category
        if (req.role == "admin" || req.userId == proData.createdBy) {
            let updateFields={};
            if(name){
                updateFields.productName= name;
                updateFields.slug=slugify(name);
            }
            if(priceAfterDiscount){
                updateFields.priceAfterDiscount= priceAfterDiscount;
            }
            if(finalPrice){
                updateFields.finalPrice= finalPrice;
            }
            if(category){
                 //check if category exist before update
                let cat= await CategoryModel.findById({_id:category});
                if(!cat) return res.json({"message":"This Catergory don't exist"});
                updateFields.category= category;
            }
            if(stock){
                updateFields.stock= stock;
            }
            if(createdBy){
                let checkuser=await UserModel.findById({_id:createdBy});
                if(!checkuser) return res.json({"message":"invalid user"});
                updateFields.createdBy= createdBy;
            }
            
            // If there's a file attached in the request, update the image
            if (req.file) {
                const fileName = req.file.filename;
                const basePath = `${req.protocol}://${req.get('host')}/uploads/products/`;
                updateFields.image = `${basePath}${fileName}`;
            }

            // Update the category using its ID
            let updatedProduct = await ProductModel.findByIdAndUpdate(proId, updateFields, { new: true });

          return  res.json({ "message": "Product Updated Successfully", updatedProduct });
        } else {
         return   res.status(401).json({ "message": "Not Authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Failed to Update Product" });
    }
}
//delete product
export const DeleteProduct = async (req, res) => {
    try {
        let proId = req.params.id;
        // console.log(req.userId);
        //i want to check if id dosen't found but i know this is wrong way becuase he search for route and don't find one dosen't recieve id 
        if (!proId) return res.json({
            "message": "Invalid Product Id"
        });
        let proData = await ProductModel.findById({
            _id: proId
        });
        if (!proData) return res.json({ "message": "Product not found" });
        if (req.role == "admin" || req.userId == proData.createdBy) {
            await ProductModel.findByIdAndDelete({
                _id: proId
            });
            res.status(200).json({
                "message": "Product Deleted Successfully"
            });
        } else {
            res.status(401).json({
                "message": "Not Authorized to perform this action"
            });
        }

    } catch (error) {
        res.status(500).json({
            "message": "Failed to Delete Product"
        });
    }
}
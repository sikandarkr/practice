const userModel = require("../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports ={
    create:async (req,res)=>{
        // console.log("your data", req.body);
         // return res.json({"data":req.body,status:"success"});
        const {name, email, password } = req.body;
        const profileUrl= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrEBd7AR5WT1fsRwcBlU0xpOZWlgvqQBGkiZ7z4bSNv1-C7_ENg";
        const userExist = await userModel.findOne({$or: [
            {email: req.body.email}
        ]});
        if (userExist) {
            return res.status(409).json({
              status: 409,
              message: "This email or username has been taken already",
              data: userExist
            });
          }
          const user = new userModel({
            name,
            email,
            password,
            profileUrl,
          });
          if (!(await user.save())) {
            return res.json({"message":"registration unsuccessfull"});
          }
          return res.status(201).json({
            status: 201,
            message: "success",
            data: "registration successfull"
          });
    },
    authenticate:async (req,res)=>{
      // return res.json({data:req.body,"status":"success"})
        userModel.findOne({$or: [
            // {username: req.body.email},
            {email: req.body.email}
        ]}).exec(function(err,  userInfo){
            if(!userInfo){
                // next(err);
                return res.json({"status":401,"error":"you are not registered with this username or email"})
            }
            else{
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                            const token = jwt.sign(
                            { id: userInfo._id },
                            req.app.get("secretKey"),
                            { expiresIn: "22h" }
                            );
                            return res.status(200).json(
                            {   "messaage":"success",
                                "token":token,
                                "userName":userInfo.username,
                                "email":userInfo.email,
                                "upvote":userInfo.upvote,
                                "downvote":userInfo.downvote,
                                "userName":userInfo.country

                            }
                        );
                }
                else{
                    return res.json({"status":401,"error":"incorrect password"});
                }
            }
        });
    }
    }

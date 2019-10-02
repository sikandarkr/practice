const chatModel = require("../../models/chatconnection");
const userModel = require("../../models/users");
module.exports = {
    request: async (req,res)=>{
        const {requesterId,accepterId} = req.body;
        const ishistory = await chatModel.findOne({$or: [
            {requesterId: req.body.requesterId},
            {accepterId: req.body.accepterId}
        ]});
        if(ishistory){
            return res.json({"chatId":ishistory.id,status:200})
        }
        else{
            const chatInstance = new chatModel({
                requesterId,
                accepterId,
            });
            if (!(await chatInstance.save())) {
                return res.json({"message":"internal server error",status:500});
            }
            else{
                const ishistory = await chatModel.findOne({$or: [
                    {requesterId: req.body.requesterId},
                    {accepterId: req.body.accepterId}
                ]});
                return res.json({"chatId":ishistory.id,status:200,"message":"chat has been started"});
            }
        }
    },

users: async (req,res) =>{
    userModel.find({}, function(err, data) {
        if (!err){ 
            return res.json({data:data,status:200})
            process.exit();
        } else {
            return res.json({data:null,status:401})
        }
    });
}
}
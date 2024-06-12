const User = require("../../model/user")
const Comment = require("../../model/announcementCommentdata");

exports.homePage=async (req,res,next)=>{
    const userRole = req.user.role;
    const user = await User.findById(req.user.userId);
    const totalComment = await Comment.countDocuments();
    const userName = user.name;
    res.render('admin/index',{
        userName,
        userRole,
        totalComment
    });
}


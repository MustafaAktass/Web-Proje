const ShopData = require("../../model/shopdata")
const AnnouncementData = require("../../model/announcementdata");
const Comment = require("../../model/commentdata");


function getCurrentDateTime() {
    // Bugünün tarihini ve saatini al
    const now = new Date();

    // Tarih formatı: Gün/Ay/Yıl
    const date = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();

    // Saat formatı: Saat:Dakika:Saniye
    const time = now.getHours() + ':' + now.getMinutes();

    // Tarih ve saat stringlerini birleştir
    const dateTime = date + ' ' + time;

    // Birleştirilmiş stringi return et
    return dateTime;
}

exports.homePage = async (req, res, next) => {
    const userRole = req.user.role;
    try {
        const data = await ShopData.find();
        res.render('user/home-page', {
            userRole : userRole,
            shopdata: data, 
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.announcementPage = async (req, res, next) => {
    const userRole = req.user.role;
    try {
        const data = await AnnouncementData.find();
        res.render('user/announcement-page', {
            userRole : userRole,
            announcementdata: data, 
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.announcementDetailPage = async (req, res, next) => {
    const userRole = req.user.role;
    try {
        const data = await AnnouncementData.findById(req.params.id)
        .populate({
            path: 'Yorumlar',
            populate: {
                path: 'yazar',
                model: 'users'
            }
        })
        const dataList = await AnnouncementData.find();
        res.render('user/announcement-detail-page', {
            userRole : userRole,
            announcementdata: data,
            announcementdataList:dataList,
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.getAllShops = async (req, res) => {
    try {
        const allShops = await ShopData.find();
        res.json(allShops);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
exports.listShop = async(req,res,next)=>{
    const userRole = req.user.role;
    try {
        const data = await ShopData.find();
        res.render('user/shop-page', { 
            userRole : userRole,
            shopdata: data, 
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}

exports.shopDetail=async(req,res,next)=>{
    const userRole = req.user.role;
    try {
        const dataList = await ShopData.find();
        const data = await ShopData.findById(req.params.id);
        if (!data) {
            return res.status(404).send('İşletme bulunamadı');
        }
        res.render('user/shop-detail-page',{ 
            userRole : userRole,
            shopdata: data,
            shopdataList: dataList,
            layout: false 
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
}

exports.search = async (req, res) => {
    const userRole = req.user.role;
    const { IsletmeAdi, Sehir, Kategori } = req.body;

    try {
        // MongoDB sorgu nesnesi oluştur
        let query = {};

        if (IsletmeAdi) {
            query.IsletmeAdi = { $regex: new RegExp(IsletmeAdi, 'i') }; // Case-insensitive regex
        }

        if (Sehir) {
            query.Sehir = { $regex: new RegExp(Sehir, 'i') }; // Case-insensitive regex
        }

        if (Kategori) {
            query.Kategori = Kategori;
        }

        // Veritabanından filtrelenmiş verileri al
        const filteredData = await ShopData.find(query);

        res.render('user/home-page', {
            userRole : userRole,
            shopdata: filteredData, 
            layout: false 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const { icerik, postId } = req.body;
        const comment = new Comment({
            icerik,
            yazar: req.user.userId,
            post: postId,
            tarih:getCurrentDateTime()
        });
        await comment.save();

        const post = await AnnouncementData.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Announcement not found' });
        }
        post.Yorumlar.push(comment.id);
        await post.save();
        next();
        //res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
        next();
    }
};
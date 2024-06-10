const ShopData = require("../../model/shopdata")
const AnnouncementData = require("../../model/announcementdata");
const Comment = require("../../model/commentdata");

exports.homePage = async (req, res, next) => {
    try {
        const data = await ShopData.find();
        res.render('user/home-page', {
            userRole: req.user.role,
            shopdata: data,
            tokenControl: req.tokenControl,
            layout: false
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.announcementPage = async (req, res, next) => {
    const perPage = 3; // Sayfa başına gösterilecek kayıt sayısı
    const page = req.query.page || 1; // Sayfa numarası, varsayılan olarak 1

    try {
        // Toplam kayıt sayısını al
        const totalItems = await AnnouncementData.countDocuments();

        // Sayfalı duyuruları al
        const data = await AnnouncementData.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);

        // Popüler duyuruları al
        const popularAnnouncements = await AnnouncementData.find()
            .populate({
                path: 'Yorumlar',
                populate: {
                    path: 'yazar',
                    model: 'users'
                }
            })
            .sort({ 'Yorumlar': -1 })
            .limit(5); // En çok yorum alan ilk 5 duyuru

        // View'i render et
        res.render('user/announcement-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: data,
            popularAnnouncements: popularAnnouncements,
            current: page,
            pages: Math.ceil(totalItems / perPage), // Toplam sayfa sayısı
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.announcementDetailPage = async (req, res, next) => {
    try {
        const { slug } = req.params;

        // Detaylı duyuruyu slug ile bul ve yorumlarıyla birlikte al
        const data = await AnnouncementData.findOne({ slug })
            .populate({
                path: 'Yorumlar',
                populate: {
                    path: 'yazar',
                    model: 'users'
                }
            });

        // Popüler duyuruları al
        const popularAnnouncements = await AnnouncementData.find()
            .populate({
                path: 'Yorumlar',
                populate: {
                    path: 'yazar',
                    model: 'users'
                }
            })
            .sort({ 'Yorumlar': -1 })
            .limit(5); // En çok yorum alan ilk 5 duyuru

        res.render('user/announcement-detail-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: data,
            popularAnnouncements: popularAnnouncements,
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllShops = async (req, res) => {
    try {
        const allShops = await ShopData.find();
        res.json(allShops);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
exports.listShop = async (req, res, next) => {
    const perPage = 6; // Sayfa başına gösterilecek kayıt sayısı
    const page = req.query.page || 1; // Sayfa numarası, varsayılan olarak 1

    try {
        const totalItems = await ShopData.countDocuments(); // Toplam kayıt sayısı
        const data = await ShopData.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);

        res.render('user/shop-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            shopdata: data,
            current: page,
            pages: Math.ceil(totalItems / perPage), // Toplam sayfa sayısı
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.shopDetail=async(req,res,next)=>{
    
    try {
        const { slug } = req.params;
        const dataList = await ShopData.find();
        const data = await ShopData.findOne({slug});
        if (!data) {
            return res.status(404).send('İşletme bulunamadı');
        }
        res.render('user/shop-detail-page',{ 
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            shopdata: data,
            shopdataList: dataList,
            layout: false 
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
}

exports.search = async (req, res) => {
    
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
            tokenControl: req.tokenControl,
            userRole: req.user.role,
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

        // Slug ile duyuruyu bulun
        const post = await AnnouncementData.findOne({ slug: postId });
        if (!post) {
            return res.status(404).json({ msg: 'Announcement not found' });
        }

        const comment = new Comment({
            icerik,
            yazar: req.user.userId,
            post: post._id, // postId yerine post._id kullanın
        });

        await comment.save();

        post.Yorumlar.push(comment._id);
        await post.save();
        
        // Yorum kaydedildikten sonra kullanıcıyı duyuru sayfasına yönlendirin
        res.redirect(`/user/announcement-detail-page/${post.slug}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
exports.searchAnnouncement = async (req, res) => {
    const { keyword } = req.query;
    const perPage = 3; // Number of records per page
    const page = req.query.page || 1; // Page number, default is 1

    try {
        // MongoDB query to find announcements by keyword
        let query = {};

        if (keyword) {
            query = {
                $or: [
                    { DuyuruAdi: { $regex: new RegExp(keyword, 'i') } },
                    { Aciklama: { $regex: new RegExp(keyword, 'i') } },
                    { Kategori: { $regex: new RegExp(keyword, 'i') } },
                ]
            };
        }

        // Fetch total number of items matching the query
        const totalItems = await AnnouncementData.countDocuments(query);

        // Fetch filtered announcements with pagination
        const filteredData = await AnnouncementData.find(query)
            .skip((perPage * page) - perPage)
            .limit(perPage);

        res.render('user/announcement-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: filteredData,
            current: page,
            pages: Math.ceil(totalItems / perPage), // Total number of pages
            layout: false 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

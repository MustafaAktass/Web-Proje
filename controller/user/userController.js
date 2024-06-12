const ShopData = require("../../model/shopdata");
const AnnouncementData = require("../../model/announcementdata");
const Comment = require("../../model/announcementCommentdata");
const ShopComment = require("../../model/shopCommentdata");
const { getPaginatedData, getPopularAnnouncements, renderPage } = require("../../middleware/helper");

exports.homePage = async (req, res, next) => {
    try {
        const data = await ShopData.find();
        renderPage(res, 'user/home-page', {
            userRole: req.user.role,
            shopdata: data,
            tokenControl: req.tokenControl
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.announcementPage = async (req, res, next) => {
    const perPage = 3;
    const page = req.query.page || 1;

    try {
        const { data, totalItems } = await getPaginatedData(AnnouncementData, page, perPage);
        const popularAnnouncements = await getPopularAnnouncements();

        renderPage(res, 'user/announcement-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: data,
            popularAnnouncements: popularAnnouncements,
            current: page,
            pages: Math.ceil(totalItems / perPage)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.announcementDetailPage = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const data = await AnnouncementData.findOne({ slug })
            .populate({
                path: 'Yorumlar',
                populate: {
                    path: 'yazar',
                    model: 'users'
                }
            });
        const popularAnnouncements = await getPopularAnnouncements();

        renderPage(res, 'user/announcement-detail-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: data,
            popularAnnouncements: popularAnnouncements
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
    const perPage = 6;
    const page = req.query.page || 1;

    try {
        const { data, totalItems } = await getPaginatedData(ShopData, page, perPage);
        renderPage(res, 'user/shop-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            shopdata: data,
            current: page,
            pages: Math.ceil(totalItems / perPage)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.shopDetail = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const dataList = await ShopData.find();
        const data = await ShopData.findOne({ slug })
            .populate({
                path: 'Yorumlar',
                populate: {
                    path: 'yazar',
                    model: 'users'
                }
            });

        if (!data) {
            return res.status(404).send('İşletme bulunamadı');
        }

        const popularAnnouncements = await getPopularAnnouncements(); // Duyuruları almak için eklenen satır

        renderPage(res, 'user/shop-detail-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            shopdata: data,
            shopdataList: dataList,
            popularAnnouncements: popularAnnouncements // Duyuruları view'e gönder
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.search = async (req, res) => {
    const { IsletmeAdi, Sehir, Kategori } = req.body;

    try {
        let query = {};
        if (IsletmeAdi) {
            query.IsletmeAdi = { $regex: new RegExp(IsletmeAdi, 'i') };
        }
        if (Sehir) {
            query.Sehir = { $regex: new RegExp(Sehir, 'i') };
        }
        if (Kategori) {
            query.Kategori = Kategori;
        }

        const filteredData = await ShopData.find(query);
        renderPage(res, 'user/home-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            shopdata: filteredData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const { icerik, postId } = req.body;
        const post = await AnnouncementData.findOne({ slug: postId });
        if (!post) {
            return res.status(404).json({ msg: 'Announcement not found' });
        }

        const comment = new Comment({
            icerik,
            yazar: req.user.userId,
            post: post._id,
        });

        await comment.save();
        post.Yorumlar.push(comment._id);
        await post.save();

        res.redirect(`/user/announcement-detail-page/${post.slug}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.createShopComment = async (req, res, next) => {
    try {
        const { icerik, postId } = req.body;
        const post = await ShopData.findOne({ slug: postId });
        if (!post) {
            return res.status(404).json({ msg: 'Shop not found' });
        }
        
        const comment = new ShopComment({
            icerik,
            yazar: req.user.userId,
            post: post._id,
        });
       
        await comment.save();
        post.Yorumlar.push(comment._id);
        await post.save();

        res.redirect(`/user/shop-detail-page/${post.slug}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.searchAnnouncement = async (req, res) => {
    const { keyword } = req.query;
    const perPage = 3;
    const page = req.query.page || 1;

    try {
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

        const { data, totalItems } = await getPaginatedData(AnnouncementData, page, perPage, query);
        const popularAnnouncements = await getPopularAnnouncements();

        renderPage(res, 'user/announcement-page', {
            tokenControl: req.tokenControl,
            userRole: req.user.role,
            announcementdata: data,
            current: page,
            pages: Math.ceil(totalItems / perPage),
            popularAnnouncements: popularAnnouncements
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

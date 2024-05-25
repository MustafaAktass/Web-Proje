const ShopData = require("../../model/shopdata")

exports.homePage = async (req, res, next) => {
    try {
        const data = await ShopData.find();
        res.render('user/home-page', { 
            shopdata: data, 
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}
exports.announcementPage = async (req, res, next) => {
    res.render('user/announcement-page', {  layout: false });
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
    try {
        const data = await ShopData.find();
        res.render('user/shop-page', { 
            shopdata: data, 
            layout: false 
        });
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
}

exports.shopDetail=async(req,res,next)=>{
    try {
        const dataList = await ShopData.find();
        const data = await ShopData.findById(req.params.id);
        if (!data) {
            return res.status(404).send('İşletme bulunamadı');
        }
        res.render('user/shop-detail-page',{ 
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
            shopdata: filteredData, 
            layout: false 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


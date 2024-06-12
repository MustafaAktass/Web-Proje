// helpers.js

const AnnouncementData = require("../model/announcementdata");

exports.getPaginatedData = async (model, page, perPage, query = {}) => {
    const totalItems = await model.countDocuments(query);
    const data = await model.find(query)
        .skip((perPage * page) - perPage)
        .limit(perPage);
    return { data, totalItems };
};

exports.getPopularAnnouncements = async () => {
    return await AnnouncementData.find()
        .populate({
            path: 'Yorumlar',
            populate: {
                path: 'yazar',
                model: 'users'
            }
        })
        .sort({ 'Yorumlar': -1 })
        .limit(5);
};

exports.renderPage = (res, view, options) => {
    res.render(view, {
        layout: false,
        ...options
    });
};

const AnnouncementData = require("../model/announcementdata")
const ShopData = require("../model/shopdata")
const slugify = require('slugify');

const uniqueSlug = async (model, fieldName, value) => {
    let slug = slugify(value, { lower: true, strict: true });
    let query = {};
    query[fieldName] = slug;
    
    let existingEntry = await model.findOne(query);
    let counter = 1;
  
    while (existingEntry) {
        slug = slugify(`${value}-${counter}`, { lower: true, strict: true });
        query[fieldName] = slug;
        existingEntry = await model.findOne(query);
        counter++;
    }

    return slug;
};


module.exports = uniqueSlug;
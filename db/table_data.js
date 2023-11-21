const knex = require("./knex");
// knex paginate module
const { attachPaginate } = require('knex-paginate');
attachPaginate();
// main table--------------
function createArticle(slug, title, tag, tagall, desc, author, content, published,created,updated) {
    return knex("blog_table").insert({url:slug, title: title,tag:tag, tagall:tagall, desc:desc, author:author, content: content, published:published,created:created,updated:updated});
}

function getAll() {
    return knex("blog_table").select("*");
}

function getFirst(id){
    return knex("blog_table").select("*").where("id",id).first()
}

function doUpdate(id,slug, title, tag, tagall, desc, author, content, published,created,updated){
    return knex("blog_table").where("id", id).update({url:slug, title: title,tag:tag, tagall:tagall, desc:desc, author:author, content: content, published:published,created:created,updated:updated})
}

function doDelete(id){
    return knex("blog_table").where("id", id).del();
}

function getTag(tag) {
    return knex("blog_table").where("tag", tag).first();
}

function getInput(input) {
    return knex("blog_table").where("url", input).first();
}

// Draft table

function getFirstDraft(id){
    return knex("blog_draft").select("*").where("id",id).first()
}

function createDraft(slug, title, tag, tagall, desc, author, content, published,created,updated) {
    return knex("blog_draft").insert({url:slug, title: title,tag:tag, tagall:tagall, desc:desc, author:author, content: content, published:published,created:created,updated:updated});
}

function doUpdateDraft(id,slug, title, tag, tagall, desc, author, content, published,created,updated){
    return knex("blog_draft").where("id", id).update({url:slug, title: title,tag:tag, tagall:tagall, desc:desc, author:author, content: content, published:published,created:created,updated:updated})
}

function doDeleteDraft(id){
    return knex("blog_draft").where("id", id).del();
}

function getAllDraft() {
    return knex("blog_draft").select("*");
}
// for tags
function getTagall(input) {
    // return knex("cad_table").select("tags","header","url");
    return knex("blog_table").where("tagall",'like', `%${input}%`).select("tagall","title","url");
}
// for category page
function getCategory(input) {
    // return knex("cad_table").select("tags","header","url");
    return knex("blog_table").where("tag",'like', `%${input}%`).select("tag","title","url");
}

// for search and author page
function getSearch(input) {
    return knex("blog_table").where("url",'like', `%${input}%`).select("tag","title","url");
}

module.exports = {
    // for python output
    createArticle,
    getAll,
    doDelete,
    doUpdate,
    getFirst,
    getTag,
    getInput,
    createDraft,
    doUpdateDraft,
    doDeleteDraft,
    getAllDraft,
    getFirstDraft,
    getCategory,
    getSearch,
    getTagall
}
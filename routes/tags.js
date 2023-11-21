const express = require('express')
const router = express.Router()
const db = require("../db/table_data")



// English to Bengali Homepage sobdartho.com/tag/
router.get('/', (req, res) => {
    let qu = req.query.query
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }
    res.render('tags/tag_home')
    })



router.get('/:input', async(req, res) => {
    let qu = req.query.query
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }
 
    let page = req.query.page ? req.query.page : "1";

    const python_doc = await db.getTagall(req.params.input).paginate({
        perPage: 10,
        currentPage: page
      })
    // to include url second part which is catagory

    let next = parseInt(page) + 1;
    let prev = parseInt(page) - 1;

    try{
        if (python_doc) {
            res.render('tags/tags',{word:req.params.input, info: python_doc, next:next, prev:prev})
          }
      }catch{
            return res.redirect(`not-found/404`);
      }

})
  








// not found 404 page
router.get('/not-found/404', (req, res) => {
    let queryparm = req.query.query
    if (queryparm) {
       return res.redirect(`/tag/${queryparm.replace(/\s+$/, '').replace(/ /g, '-').toLowerCase()}`);
    }
    res.render('tags/not_found')
})


module.exports = router
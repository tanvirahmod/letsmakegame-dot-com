const express = require('express')
const router = express.Router()
const db = require("../db/table_data")


router.get('/:input', async(req, res) => {
    const page = req.query.page
    let qu = req.query.query
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }
    
    const python_doc = await db.getSearch(req.params.input.replace(" ","-").replace(" ","-").replace(" ","-").replace(" ","-")).paginate({
        perPage: 10,
        currentPage: page
      })


      let next = parseInt(page) + 1;
      let prev = parseInt(page) - 1;
  
      try{
        if (python_doc.data[0].url) {
              res.render('search/search',{word:req.params.input, info: python_doc, next:next, prev:prev})
          }
      }catch{
            return res.redirect(`not-found/404`);
      }



})
  

// not found 404 page
router.get('/not-found/404', (req, res) => {
    let queryparm = req.query.query
    if (queryparm) {
       return res.redirect(`/search/${queryparm.replace(/\s+$/, '').replace(/ /g, '-').toLowerCase()}`);
    }
    res.render('search/not_found')
    })

    
module.exports = router
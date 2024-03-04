const express = require('express')
const db = require('./db/table_data')
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/category');
const tagsRoutes = require('./routes/tags');
const searchRoutes = require('./routes/search');


const app = express()


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/tag', tagsRoutes);
app.use('/search', searchRoutes);


app.route('/').get(async (req, res) => {
    const page = req.query.page
    let qu = req.query.query
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }
    res.render('index')
})



app.get('/author/tanvir', async (req, res) => {
    const page = req.query.page
    let qu = req.query.query
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }

    const python_doc = await db.getSearch("-").paginate({
        perPage: 10,
        currentPage: page
    })
    console.log(python_doc.data)
    let next = parseInt(page) + 1;
    let prev = parseInt(page) - 1;
    if (python_doc) {
        res.render('author/author', { allData: python_doc.data, word: req.params.input, next: next, prev: prev })
    }
    res.render("author/author")
});

// other Pages like about us
app.get('/privacy-policy', (req, res) => {
    res.render('otherPages/privacy_policy')
});

app.get('/terms-and-conditions', (req, res) => {
    res.render('otherPages/terms_and_conditions')
});

app.get('/disclaimer', (req, res) => {
    res.render('otherPages/disclaimer')
});

app.get('/contact', (req, res) => {
    res.render('otherPages/contact')
});

// // static sitemap
// app.get('/sitemap.xml', async function (req, res, next) {
//     res.set('Content-Type', 'text/xml')
//     res.sendFile(__dirname + '/public/sitemaps/sitemap_main.xml');
// });

// dynamic sitemap
app.get('/sitemap.xml', async function (req, res, next) {
    const check = await db.getAll();

    let ext = ""
    check.forEach(element => {
        // console.log(element.id)
        ext = ext + "<url>\n <loc>https://letsmakegame.com/" + element.tag + "/" + element.url+"</loc>\n</url>\n"
    });
  
    let xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "<url>\n <loc>https://letsmakegame.com</loc>\n</url>\n" + ext + '</urlset>'
    // console.log(xml_content)

    res.set('Content-Type', 'text/xml')
    res.send(xml_content)
})




app.get('/:category/:input', async (req, res) => {
    const tag_doc = await db.getTag(req.params.category);
    const input_doc = await db.getInput(req.params.input);
    let qu = req.query.query;
    if (qu) {
        return res.redirect(`/search/${qu.replace(/\s+$/, '').toLowerCase()}?page=1`);
    }
    if (tag_doc && input_doc && input_doc.tag === req.params.category) {
        const check = await db.getAll(input_doc.id);
        res.render('articles/articles', { tag: req.params.category, info: input_doc, check: check })
    } else {
        return res.redirect(`not-found/404`);
    }
});





// 404 not found pages --- keen bottom of the page this section-------------
app.use(function (req, res, next) {
    let queryparm = req.query.query
    if (queryparm) {
        return res.redirect(`/search/${queryparm}`);
    }
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.render('tags/not_found', { url: req.url });
        return;
    }

});



const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
})
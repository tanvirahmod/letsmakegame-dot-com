const express = require('express')
const router = express.Router()
const db = require("../db/table_data")
const methodOverride = require('method-override')
// import file upload library
const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"public/uploads")
    },
    filename: (req,file,cb)=>{
        console.log(file)
        cb(null,file.originalname)
    }
})

const upload = multer({storage: storage})

// for Sessions new
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
// end
router.use(express.urlencoded({ extended: true }))
router.use(methodOverride('_method'))




// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
router.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir7676",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// cookie parser middleware
router.use(cookieParser());
//username and password
const myusername = 'tanvir.ahmod@gmail.com'
const mypassword = 'tanvir.comahmedoke'

// a variable to save a session
var session;
// end----------------- middleware




router.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.render('admin/admin')
    } else {
        res.render("admin/login")
    }
});


router.post('/', (req, res) => {
    if (req.body.username == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.render('admin/admin')
    }
    else {
        res.send('Invalid username or password');
    }
})



router.route('/published').get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const getResult = await db.getAll()
        res.render('admin/create', { getall: getResult })
    } else {
        res.render('admin/login')
    }

}).post(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const getResult = await db.getAll()
        if (req.body.published == "Publish") {
            await db.createArticle(req.body.slug.toLowerCase(), req.body.title, req.body.tag.toLowerCase(), req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated);
            res.render('admin/create', { getall: getResult })
        } else {
            await db.createDraft(req.body.slug.toLowerCase(), req.body.title, req.body.tag.toLowerCase(), req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated);
            res.render('admin/create', { getall: getResult })
        }
    } else {
        res.render('admin/login')
    }
}).put(

).delete(

)

router.route('/draft').get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const getResult = await db.getAllDraft()
        res.render('admin/create_draft', { getall: getResult })
    } else {
        res.render('admin/login')
    }
}).post(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const getResult = await db.getAllDraft()
        if (req.body.published == "Draft") {
            await db.createDraft(req.body.slug.toLowerCase(), req.body.title, req.body.tag.toLowerCase(), req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated);
            res.render('admin/create_draft', { getall: getResult })
        } else {
            await db.createArticle(req.body.slug.toLowerCase(), req.body.title, req.body.tag.toLowerCase(), req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated);
            res.render('admin/create', { getall: getResult })
        }
    } else {
        res.render('admin/login')
    }
}).put(

).delete(

)


router.route('/delete/published/:id').get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        console.log(req.params.id)
        res.send("worked")
    } else {
        res.render('admin/login')
    }
}).delete(async (req, res) => {
    session = req.session;
    if (session.userid) {
        await db.doDelete(req.params.id);
        return res.redirect("/admin/published")
    } else {
        res.render('admin/login')
    }
})



router.route('/delete/draft/:id').get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        console.log(req.params.id)
        res.send("worked")
    } else {
        res.render('admin/login')
    }

}).delete(async (req, res) => {
    session = req.session;
    if (session.userid) {
        await db.doDeleteDraft(req.params.id);
        return res.redirect("/admin/draft")
    } else {
        res.render('admin/login')
    }
})



router.route("/edit/published/:id").get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const id = req.params.id
        const getResult = await db.getFirst(req.params.id)
        res.render('admin/edit', { id: id, getall: getResult })
    } else {
        res.render('admin/login')
    }

}).put(async (req, res) => {
    session = req.session;
    if (session.userid) {
        await db.doUpdate(req.params.id, req.body.slug, req.body.title, req.body.tag, req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated)
        return res.redirect("/admin/published")
    } else {
        res.render('admin/login')
    }
})



router.route("/edit/draft/:id").get(async (req, res) => {
    session = req.session;
    if (session.userid) {
        const id = req.params.id
        const getResult = await db.getFirstDraft(req.params.id)
        res.render('admin/edit_draft', { id: id, getall: getResult })
    } else {
        res.render('admin/login')
    }
}).put(async (req, res) => {
    session = req.session;
    if (session.userid) {
        if (req.body.published == "Publish") {
            await db.createArticle(req.body.slug, req.body.title, req.body.tag, req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated);
            return res.redirect("/admin/draft")
        } else {
            await db.doUpdateDraft(req.params.id, req.body.slug, req.body.title, req.body.tag, req.body.tagall.toLowerCase(), req.body.desc, req.body.author, req.body.content, req.body.published, req.body.created, req.body.updated)
            return res.redirect("/admin/draft")
        }
    } else {
        res.render('admin/login')
    }

})

// file upload
router.get('/file-upload', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.render('admin/file-upload')
    } else {
        res.render("admin/login")
    }
});

router.post('/file-upload', upload.single('filee'), (req, res) => {
    session = req.session;
    if (session.userid) {
        res.render("admin/admin")
    } else {
        res.render("admin/login")
    }
})


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
























// not found 404 page
router.get('/not-found/404', (req, res) => {
    let queryparm = req.query.query
    if (queryparm) {
        return res.redirect(`/tag/${queryparm.replace(/\s+$/, '').replace(/ /g, '-').toLowerCase()}`);
    }
    res.render('tags/not_found')
})


module.exports = router
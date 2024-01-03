const router = require("express").Router();
const mainCon = require("../controller/controller");
const multer = require('multer');


const islogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
};


const isloginAdmin = (req, res, next) => {
    if (!req.session.admin) {
        res.redirect("/login");
    } else {
        next();
    }
};



//blog images
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/postImages')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)

    }
});

const upload = multer({ storage: storage });


//for user Avatar
const avatarStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/userAvatar')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)

    }
});

const uploadAvatar = multer({ storage: avatarStorage });


router.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


router.get("/", mainCon.getIndex);
router.get("/index", (req, res) => {
    res.redirect("/");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});
router.post("/register", uploadAvatar.single('userImg'), mainCon.postRegister);


router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});
router.post("/login", mainCon.postlogin);


router.post("/livesearch", mainCon.liveSearch);





//user
router.use("/userIndex", islogin);
router.get("/userIndex", mainCon.getUserIndex);

router.use("/createBlog", islogin);
router.get("/createBlog", mainCon.createBlog);
router.post("/createBlog", upload.single('picture'), mainCon.userPostBlog);

router.use("/userProfile", islogin);
router.get("/userProfile", mainCon.userProfile);

router.get('/delete/:id', mainCon.deleteBlog);
router.get('/restoreBlog/:id', mainCon.restoreBlog);

router.use("/recentlyDeleted", islogin);
router.get("/recentlyDeleted", mainCon.recentlyDeleted);
router.get('/deletePermanently/:id', mainCon.deletePermanently);
router.get('/deleteDraft/:id', mainCon.deleteDraft);
router.get('/postDraft/:id', mainCon.postDraft);





router.post("/editProfile", uploadAvatar.single('avatar'), mainCon.editProfile);

module.exports = router;
const con = require("../database/connection.js");
const flash = require("express-flash");
const argon2 = require("argon2");
const striptags = require('striptags');






exports.getIndex = (req, res) => {

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY totalView desc LIMIT 3 ";
    con.query(sql, (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            res.render("index", { title: "Home", blogs, stripTags: striptags });

        }
    });
};

exports.liveSearch = (req, res) => {
    const search = req.body.query;
    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM  post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 AND p.title LIKE ? GROUP BY p.id ORDER BY totalView DESC";
    con.query(sql, ['%' + search + '%'], (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            res.render("livesearch", { blogs, stripTags: striptags });

        }
    });
};




exports.postlogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let alert = "";
    const sql = "SELECT * FROM user_tbl WHERE email=?";
    con.query(sql, [email], async (err, results) => {
        if (err) {
            console.log(err.message);
            return;
        }
        if (results.length > 0) {
            const hashpass = results[0].password;

            if (await argon2.verify(hashpass, password)) {
                // password match
                // res.send("create session then redirect");

                if (results[0].type == 0) {
                    req.session.user = results[0];
                    //console.log(req.session.user);
                    res.redirect("/userIndex");
                } else {
                    req.session.admin = results[0];
                    res.redirect("/adminViewBlogs");
                }

            } else {
                // password did not match
                alert = "Invalid password";
                res.render("login", { title: "login page", alert });
            }
        } else {
            alert = "Invalid username";
            res.render("login", { title: "login page", alert });
        }
    });
};


exports.postRegister = async (req, res) => {

    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const email = req.body.email;
    const pass = req.body.pass;
    const hashpass = await argon2.hash(pass);
    const conpass = req.body.conpass;
    let alert = "";

    if (conpass !== pass) {
        alert = "Password Does Not Match";
        res.render("register", { password });

    } else {
        const sql = "INSERT INTO user_tbl (email, firstname, middlename, lastname, password, avatar) VALUES (?,?,?,?,?,?)";
        con.query(sql, [email, fname, mname, lname, hashpass, req.file.filename], (err, results) => {
            if (err) {
                console.log(err.message);
                alert = "Email Already Exists";
                res.render("register", { alert });
            } else {
                res.redirect('/login');
            }

        });
        // res.send(hashpass);
    }




};



//user
exports.getUserIndex = (req, res) => {

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY totalView desc LIMIT 3 ";
    con.query(sql, (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        }
        res.render("user/index", { title: "User Home", blogs, stripTags: striptags, url: req.url });
    });
};


//admin
exports.getAdminIndex = (req, res) => {

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY totalView desc LIMIT 3 ";
    con.query(sql, (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        }
        const category_sql = 'SELECT * FROM category_tbl WHERE id > ?';
        con.query(category_sql, [0], (err, results) => {
            const category_num = results.length;
            if (err) {
                res.send(err.message);
                return;
            }
            const user_sql = 'SELECT * FROM user_tbl WHERE id > ?';
            con.query(user_sql, [0], (err, results) => {
                const user_num = results.length;
                if (err) {
                    res.send(err.message);
                    return;
                }
                const post_sql = 'SELECT * FROM post_tbl WHERE id > ?';
                con.query(post_sql, [0], (err, results) => {
                    const post_num = results.length;
                    if (err) {
                        res.send(err.message);
                        return;
                    }
                    res.render("admin/index", { title: "Admin Home", blogs, stripTags: striptags, url: req.url, category_num: category_num, user_num:user_num, post_num:post_num });
                });

               
            });
            
        });

    });
};


exports.getPost = (req,res)=>{
const sql = 'SELECT * FROM post_tbl';

con.query(sql, (err, results)=>{
    if (err) {
        res.send(err.message);
        return;
    }

    const sql_user = 'SELECT * FROM user_tbl ';

    con.query(sql_user, (err2,user_results)=>{
        if (err) {
            res.send(err.message);
            return;
        }
        res.render('admin/post', {results,user_results});
    })
    
});

    
}
exports.createBlog = (req, res) => {

    const sql = "SELECT * FROM category_tbl";
    con.query(sql, (err, category) => {
        if (err) {
            res.send(err.message);
            return;
        }
        let posted = req.flash("success");
        let drafted = req.flash("warning");
        res.render("user/createBlog", { category, posted, drafted, url: req.url });
    });
};


exports.userPostBlog = (req, res) => {
    const isSaveDraftClicked = req.body.saveDraft !== undefined;
    const isUploadClicked = req.body.upload !== undefined;
    const userid = req.body.userid;
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let sql = "";
    let values = [];



    if (isUploadClicked) {

        if (req.file) {
            console.log(req.file);

            sql = "INSERT INTO post_tbl (user_id, category_id, title, content, status, images) VALUES (?, ?, ?, ?, ?, ?)";
            values = [userid, category, title, content, 1, req.file.filename];
        } else {

            sql = "INSERT INTO post_tbl (user_id, category_id, title, content, status) VALUES (?, ?, ?, ?, ?)";
            values = [userid, category, title, content, 1];

        }


        con.query(sql, values, (err, results) => {
            if (err) {
                console.log(err.message);

            }
            req.flash("success", "Blog Posted");
            res.redirect("/createBlog");
        });


    } else {

        if (req.file) {
            sql = "INSERT INTO post_tbl (user_id, category_id, title, content, status, images) VALUES (?, ?, ?, ?, ?, ?)";
            values = [userid, category, title, content, 0, req.file.filename];
        } else {

            sql = "INSERT INTO post_tbl (user_id, category_id, title, content, status) VALUES (?, ?, ?, ?, ?)";
            values = [userid, category, title, content, 0];

        }

        con.query(sql, values, (err, results) => {
            if (err) {
                console.log(err.message);

            }
            req.flash("warning", "Blog Saved as draft");
            res.redirect("/createBlog");
        });

    }


};




exports.userProfile = (req, res) => {

    const user = req.session.user;
    const user_id = user.id;

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView, COALESCE(COUNT(cm.id), 0) AS totalComments FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid LEFT JOIN comment_tbl cm ON p.id = cm.post_id WHERE p.status = 1 AND p.`delete_flag` = 0  AND p.user_id = ? GROUP BY p.id ORDER BY p.created_at desc"
    con.query(sql, [user_id], (err, userPosts) => {
        if (err) {
            res.send(err.message);
            return;
        }

        // Second query (example): Fetch categories
        const draft_sql = "SELECT p.*, c.name AS `category` FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id WHERE p.status = 0 AND p.user_id = ? ORDER BY p.created_at desc";
        con.query(draft_sql, [user_id], (err, drafts) => {
            if (err) {
                res.send(err.message);
                return;
            }

            let posted = req.flash("success");
            let drafted = req.flash("warning");
            res.render("user/profile", {
                userPosts,
                drafts,
                posted,
                drafted,
                stripTags: striptags
            });

        });
    });
};


exports.deleteBlog = (req, res) => {
    const id = req.params.id;

    const sql = "UPDATE post_tbl SET delete_flag = 1 WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Blog Successfully Deleted";
        }

        req.flash("success", "Blog Successfully Deleted");
        console.log(alert);
        res.redirect("/userProfile");
    });
};

exports.recentlyDeleted = (req, res) => {

    const user = req.session.user;
    const user_id = user.id;

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView, COALESCE(COUNT(cm.id), 0) AS totalComments FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid LEFT JOIN comment_tbl cm ON p.id = cm.post_id WHERE p.status = 1 AND p.`delete_flag` = 1  AND p.user_id = ? GROUP BY p.id ORDER BY p.created_at"
    con.query(sql, [user_id], (err, userPosts) => {
        if (err) {
            res.send(err.message);
            return;
        }

        // Second query (example): Fetch categories


        let posted = req.flash("success");

        res.render("user/recentlyDeleted", {
            userPosts,
            posted,
            stripTags: striptags
        });


    });
};

exports.restoreBlog = (req, res) => {
    const id = req.params.id;

    const sql = "UPDATE post_tbl SET delete_flag = 0 WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Blog Successfully Restored";
        }

        req.flash("success", "Blog Successfully Restored");
        console.log(alert);
        res.redirect("/recentlyDeleted");
    });
};

exports.deletePermanently = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM post_tbl WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Blog Successfully Deleted";
        }

        req.flash("success", "Blog Permanently Deleted");
        console.log(alert);
        res.redirect("/recentlyDeleted");
    });
};


exports.deleteDraft = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM post_tbl WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Draft Successfully Deleted";
        }

        req.flash("warning", "Draft Permanently Deleted");
        console.log(alert);
        res.redirect("/userProfile");
    });
};


exports.postDraft = (req, res) => {
    const id = req.params.id;

    const sql = "UPDATE post_tbl SET status = 1 WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Blog Successfully Posted";
        }

        req.flash("success", "Blog Successfully Posted");
        console.log(alert);
        res.redirect("/userProfile");
    });
};


exports.editProfile = async (req, res) => {

    const user = req.session.user;
    const user_id = user.id;

    const fname = req.body.fname;
    const mname = req.body.mname;
    const lname = req.body.lname;
    const pass = req.body.pass;
    const hashpass = await argon2.hash(pass);



    let sql = "";
    let values = [];



    if (pass != '') {

        if (req.file) {
            console.log(req.file);

            sql = "UPDATE user_tbl SET firstname = ?, middlename = ?, lastname =?, pass = ? avatar=? WHERE id = ?";
            values = [fname, mname, lname, hashpass, req.file.filename, user_id];
        } else {
            sql = "UPDATE user_tbl SET firstname = ?, middlename = ?, lastname =?, pass = ? WHERE id = ?";
            values = [fname, mname, lname, hashpass, user_id];

        }




    } else {

        if (req.file) {
            console.log(req.file);

            sql = "UPDATE user_tbl SET firstname = ?, middlename = ?, lastname =?, avatar=? WHERE id = ?";
            values = [fname, mname, lname, req.file.filename, user_id];
        } else {
            sql = "UPDATE user_tbl SET firstname = ?, middlename = ?, lastname =? WHERE id = ?";
            values = [fname, mname, lname, user_id];

        }



    }

    con.query(sql, values, (err, results) => {
        if (err) {
            console.log(err.message);

        }
        res.redirect("/logout");
    });


};


exports.retreiveBlog = (req, res) => {
    const id = req.params.id;

    const insert = "INSERT INTO views (plusone, postid) VALUES (?,?)";
    con.query(insert, [1, id], (err, results) => {
        if (err) {
            alert = err.message;
        }

        const sql = "SELECT b.id,b.user_id,a.email, b.title,b.created_at,b.content, b.images from user_tbl a inner join post_tbl b on a.id = b.user_id WHERE b.id=?";
        con.query(sql, [id], (err, results) => {
            if (err) {
                alert = err.message;
            }

            const comment_sql = "SELECT a.*,b.email, b.avatar FROM comment_tbl a inner join user_tbl b on a.user_id=b.id WHERE a.post_id=?";
            con.query(comment_sql, [id], (err, comments) => {
                if (err) {
                    alert = err.message;
                }

                const views_sql = "SELECT COALESCE(SUM(plusone), 0) AS totalView  FROM views WHERE postid = ?";
                con.query(views_sql, [id], (err, views) => {
                    if (err) {
                        alert = err.message;
                    }

                    res.render("viewBlog", { blog: results[0], comments, post_id: id, totalView: views[0].totalView });
                });
            });
        });

    });
};

exports.userLiveSearch = (req, res) => {
    const search = req.body.query;
    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM  post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 AND p.title LIKE ? GROUP BY p.id ORDER BY totalView DESC";
    con.query(sql, ['%' + search + '%'], (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            res.render("user/userLiveSearch", { blogs, stripTags: striptags });

        }
    });
};


exports.userRetreiveBlog = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const user_id = user.id;

    const insert = "INSERT INTO views (plusone, postid) VALUES (?,?)";
    con.query(insert, [1, id], (err, results) => {
        if (err) {
            alert = err.message;
        }
        const sql = "SELECT b.id,b.user_id,a.email, b.title,b.created_at,b.content, b.images from user_tbl a inner join post_tbl b on a.id = b.user_id WHERE b.id=?";
        con.query(sql, [id], (err, results) => {
            if (err) {
                alert = err.message;
            }

            const comment_sql = "SELECT a.*,b.email, b.avatar FROM comment_tbl a inner join user_tbl b on a.user_id=b.id WHERE a.post_id=?";
            con.query(comment_sql, [id], (err, comments) => {
                if (err) {
                    alert = err.message;
                }

                const favorite_sql = "SELECT * FROM favorite where post_id= ? and user_id=?";
                con.query(favorite_sql, [id, user_id], (err, favorite) => {
                    if (err) {
                        alert = err.message;
                    }
                    const views_sql = "SELECT COALESCE(SUM(plusone), 0) AS totalView  FROM views WHERE postid = ?";
                    con.query(views_sql, [id], (err, views) => {
                        if (err) {
                            alert = err.message;
                        }

                        let alert = req.flash("success");
                        res.render("user/userViewBlog", { blog: results[0], comments, post_id: id, alert, favorite, totalView: views[0].totalView });
                    });

                });
            });
        });

    });

};


exports.deleteComment = (req, res) => {
    const id = req.params.id;
    const post_id = req.params.post_id;
    const sql = "DELETE FROM comment_tbl WHERE id =?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        } else {
            alert = "Comment Successfully Deleted";
        }

        req.flash("success", "Comment Successfully Deleted");
        res.redirect(`/userViewBlog/${post_id}`);
    });
};


exports.favorite = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const user_id = user.id;


    const sql = "INSERT INTO favorite (user_id, post_id) VALUES (?,?)";
    con.query(sql, [user_id, id], (err, results) => {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect(`/userViewBlog/${id}`);
        }

    });

};


exports.unfavorite = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const user_id = user.id;


    const sql = "DELETE FROM favorite where user_id = ? AND post_id = ?";
    con.query(sql, [user_id, id], (err, results) => {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect(`/userViewBlog/${id}`);
        }

    });

};



exports.postComment = (req, res) => {
    const post_id = req.body.post_id;
    const comment = req.body.comment;
    const user = req.session.user;
    const user_id = user.id;


    const sql = "INSERT INTO comment_tbl (user_id, post_id, comment) VALUES (?, ?, ?)";
    con.query(sql, [user_id, post_id, comment], (err, results) => {
        if (err) {
            console.log(err.message);
        } else {
            req.flash("success", "Comment Successfully Posted");
            res.redirect(`/userViewBlog/${post_id}`);
        }

    });

};


exports.viewDraft = (req, res) => {

    const post_id = req.params.id;

    const sql = "SELECT * FROM category_tbl";
    con.query(sql, (err, category) => {
        if (err) {
            res.send(err.message);
            return;
        }

        const retreive = "SELECT * FROM post_tbl where id = ?";
        con.query(retreive, [post_id], (err, draft) => {
            if (err) {
                res.send(err.message);
                return;
            }


            let posted = req.flash("success");
            let drafted = req.flash("warning");
            res.render("user/draft", { draft: draft[0], posted, category });
        });

    });
};


exports.postViewDraft = (req, res) => {
    const post_id = req.body.post_id;
    const isSaveDraftClicked = req.body.updateDraft !== undefined;
    const isUploadClicked = req.body.upload !== undefined;

    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let sql = "";
    let values = [];

    if (isUploadClicked) {
        if (req.file) {
            //onsole.log(req.file);

            sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ?, status = ?, images = ? WHERE id = ?";
            values = [category, title, content, 1, req.file.filename, post_id];
        } else {
            sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ?, status = ? WHERE id = ?";
            values = [category, title, content, 1, post_id];
        }

        con.query(sql, values, (err, results) => {
            if (err) {
                console.log(err.message);
            }
            req.flash("success", "Blog Posted");
            res.redirect("/userProfile");
        });
    } else {
        if (req.file) {
            console.log(req.file);

            sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ?, status = ?, images = ? WHERE id = ?";
            values = [category, title, content, 0, req.file.filename, post_id];
        } else {
            sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ?, status = ? WHERE id = ?";
            values = [category, title, content, 0, post_id];
        }

        con.query(sql, values, (err, results) => {
            if (err) {
                console.log(err.message);
            }
            req.flash("warning", "Blog Updated and Saved as Draft");
            res.redirect("/userProfile");
        });
    }
};



exports.viewEditPost = (req, res) => {

    const post_id = req.params.id;

    const sql = "SELECT * FROM category_tbl";
    con.query(sql, (err, category) => {
        if (err) {
            res.send(err.message);
            return;
        }

        const retreive = "SELECT * FROM post_tbl where id = ?";
        con.query(retreive, [post_id], (err, post) => {
            if (err) {
                res.send(err.message);
                return;
            }


            let posted = req.flash("success");
            let drafted = req.flash("warning");
            res.render("user/editPost", { post: post[0], posted, category });
        });

    });
};


exports.updatePost = (req, res) => {

    const post_id = req.body.post_id;


    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let sql = "";
    let values = [];


    if (req.file) {
        //onsole.log(req.file);

        sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ?, images = ? WHERE id = ?";
        values = [category, title, content, req.file.filename, post_id];
    } else {
        sql = "UPDATE post_tbl SET category_id = ?, title = ?, content = ? WHERE id = ?";
        values = [category, title, content, post_id];
    }

    con.query(sql, values, (err, results) => {
        if (err) {
            console.log(err.message);
        }
        req.flash("success", "Blog Updated");
        res.redirect("/userProfile");
    });

};

exports.userViewDeleted = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const user_id = user.id;


    const sql = "SELECT b.id,b.user_id,a.email, b.title,b.created_at,b.content, b.images from user_tbl a inner join post_tbl b on a.id = b.user_id WHERE b.id=?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            alert = err.message;
        }

        const comment_sql = "SELECT a.*,b.email, b.avatar FROM comment_tbl a inner join user_tbl b on a.user_id=b.id WHERE a.post_id=?";
        con.query(comment_sql, [id], (err, comments) => {
            if (err) {
                alert = err.message;
            }

            const favorite_sql = "SELECT * FROM favorite where post_id= ? and user_id=?";
            con.query(favorite_sql, [id, user_id], (err, favorite) => {
                if (err) {
                    alert = err.message;
                }
                const views_sql = "SELECT COALESCE(SUM(plusone), 0) AS totalView  FROM views WHERE postid = ?";
                con.query(views_sql, [id], (err, views) => {
                    if (err) {
                        alert = err.message;
                    }

                    let alert = req.flash("success");
                    res.render("user/viewDeleted", { blog: results[0], comments, post_id: id, alert, favorite, totalView: views[0].totalView });
                });

            });
        });
    });
};


exports.fetchFavorite = (req, res) => {

    const user = req.session.user;
    const user_id = user.id;

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView, COALESCE(COUNT(cm.id), 0) AS totalComments FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid LEFT JOIN comment_tbl cm ON p.id = cm.post_id INNER JOIN favorite f ON p.id = f.post_id AND f.user_id = ? WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY p.created_at;"
    con.query(sql, [user_id], (err, userPosts) => {
        if (err) {
            res.send(err.message);
            return;
        }

        let posted = req.flash("success");

        res.render("user/favorites", {
            userPosts,
            posted,
            stripTags: striptags
        });


    });
};


exports.unfavoritePost = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const user_id = user.id;


    const sql = "DELETE FROM favorite where user_id = ? AND post_id = ?";
    con.query(sql, [user_id, id], (err, results) => {
        if (err) {
            console.log(err.message);
        } else {
            res.redirect('/favorites');
        }

    });

};


exports.fetchCategory = (req, res) => {

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY totalView desc LIMIT 3 ";
    con.query(sql, (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            const cat = "SELECT * FROM category_tbl";
            con.query(cat, (err, cat) => {
                if (err) {
                    res.send(err.message);
                    return;
                }
                res.render("category", { blogs, stripTags: striptags, cat });
            });
        }
    });

};


exports.liveSearchCategory = (req, res) => {
    const search = req.body.query;
    const cat_id = req.body.cat_id;
    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM  post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 AND p.title LIKE ? AND p.category_id = ? GROUP BY p.id ORDER BY totalView DESC";
    con.query(sql, ['%' + search + '%', cat_id], (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            res.render("livesearch", { blogs, stripTags: striptags });

        }
    });
};



exports.fetchCategoryUser = (req, res) => {

    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 GROUP BY p.id ORDER BY totalView desc LIMIT 3 ";
    con.query(sql, (err, blogs) => {
        if (err) {
            res.send(err.message);
            return;
        } else {
            const cat = "SELECT * FROM category_tbl";
            con.query(cat, (err, cat) => {
                if (err) {
                    res.send(err.message);
                    return;
                }
                res.render("user/userCategory", { blogs, stripTags: striptags, cat, url: req.url });
            });
        }
    });

};


exports.userLiveSearchCategory = (req, res) => {
    const search = req.body.query;
    const cat_id = req.body.cat_id;
    const sql = "SELECT p.*, c.name AS `category`, COALESCE(SUM(v.plusone), 0) AS totalView FROM  post_tbl p INNER JOIN category_tbl c ON p.category_id = c.id LEFT JOIN views v ON p.id = v.postid WHERE p.status = 1 AND p.`delete_flag` = 0 AND p.title LIKE ? AND p.category_id = ? GROUP BY p.id ORDER BY totalView DESC";
    con.query(sql, ['%' + search + '%', cat_id], (err, blogs) => {
        if (err) {
            console.log(err.message);
        } else {
            res.render("user/userLiveSearch", { blogs, stripTags: striptags });

        }
    });
};
import db from "../db.js";


export const getPosts = async (req, res)  => {
    let post =[];
    try{
        const response = await db.query("SELECT * FROM users u JOIN posts p ON u.id=p.userid JOIN postdetails pd ON p.id = pd.postid JOIN postimages pi ON p.id = pi.postid;");
        response.rows.forEach(element => {
            delete element.password;
            delete element.email;
        });
        // console.log(response);
        res.status(200).json(response.rows);
    }catch(err){
        console.log(err);
        res.status(400).json({ message : "No post available!"})
    }

}

export const getPost = async (req, res) => {
    const postId = req.url.slice(1);
    try{

        const response = await db.query("SELECT * FROM users u JOIN posts p ON u.id=p.userid JOIN postdetails pd ON p.id = pd.postid WHERE p.id = $1;", [postId]);
        const images = await db.query("SELECT * FROM postimages WHERE postid=$1",[postId]);
        // console.log(response);
        response.rows.forEach(element => {
            delete element.password;
            delete element.email;
        });

        const data = {...response.rows[0], images: images.rows}
        res.status(200).json(data);

    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Post not available!"})
    }
    
}

export const addPost = async (req, res) => {
    const {title, price, address, city, bedroom, bathroom, latitude, longitude, type, property, description, utilities, pet, income, size, school, bus, restaurant, images} = req.body
    const uid = req.userId
    var postimages = []
    console.log(uid);
    
    try{
        const postResponse = await db.query("INSERT INTO posts (title, price, address, city, bedroom, bathroom, latitude, longitude, type, property, userid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, (SELECT id FROM users WHERE id=$11)) RETURNING *", [title, price, address, city, bedroom, bathroom, latitude, longitude, type, property, uid]);
        const postDetailsResponse = await db.query("INSERT INTO postdetails(description, utilities, pet, income, size, school, bus, restaurant, postid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM posts WHERE id=$9)) RETURNING *", [description, utilities, pet, income, size, school, bus, restaurant, postResponse.rows[0].id]);
        await Promise.all(images.map(async (image) => {
            const imageUrl = await db.query(
              "INSERT INTO postimages (image, postid) VALUES ($1, (SELECT id FROM posts WHERE id=$2)) RETURNING *",
              [image, postResponse.rows[0].id]
            );
            postimages.push(imageUrl.rows[0].image);
          }));  
        console.log({...postResponse.rows[0], ...postDetailsResponse.rows[0], ...postimages});
        const data = {...postResponse.rows[0], ...postDetailsResponse.rows[0], ...postimages};
        res.status(200).json(data);

    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Cannot add post!"})
    }
    
}

export const editPost = async (req, res) => {
    try{

    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Not authorized to edit!"})
    }
    
}

export const deletePost = async (req, res) => {
    const postId = req.url.slice(1);
    const uid = req.userId
    try{
        
        const response = await db.query("SELECT * FROM posts WHERE id = $1;",[postId]);
        if(uid != response.rows[0].userid) return res.status(200).json({ message: "Not authorized!"});
        await db.query("DELETE FROM posts WHERE id = $1",[postId]);
        await db.query("DELETE FROM postdetails WHERE postid = $1",[postId]);
        await db.query("DELETE FROM postimages WHERE postid = $1",[postId]);
        res.status(200).json({ message : "Post Deleted"});
        
    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Cannot delete post!"})
    }
    
}

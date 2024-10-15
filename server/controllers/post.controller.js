import db from "../db.js";


export const getPosts = async (req, res)  => {
    let post =[];
    try{
        const response = await db.query("SELECT * FROM users u JOIN posts p ON u.id=p.userid JOIN postdetails pd ON p.id = pd.postid;");
        response.rows.forEach(element => {
            delete element.password;
            delete element.email;
        });
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
        response.rows.forEach(element => {
            delete element.password;
            delete element.email;
        });
        res.status(200).json( response.rows);

    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Post not available!"})
    }
    
}

export const addPost = async (req, res) => {
    const {title, price, image, address, city, bedroom, bathroom, latitude, longitude, type, property, description, utilities, pet, income, size, school, bus, restaurant} = req.body
    const uid = req.userId
    
    try{

        const postResponse = await db.query("INSERT INTO posts (title, price, image, address, city, bedroom, bathroom, latitude, longitude, type, property, userid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, (SELECT id FROM users WHERE id=$12)) RETURNING *", [title, price, image, address, city, bedroom, bathroom, latitude, longitude, type, property, uid]);
        const postDetailsesponse = await db.query("INSERT INTO postdetails(description, utilities, pet, income, size, school, bus, restaurant, postid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM posts WHERE id=$9)) RETURNING *", [description, utilities, pet, income, size, school, bus, restaurant, postResponse.rows[0].id]);
        console.log({...postResponse.rows[0], ...postDetailsesponse.rows[0]});
        const data = {...postResponse.rows[0], ...postDetailsesponse.rows[0]}
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
        res.status(200).json({ message : "Post Deleted"});

    }catch(err){
        console.log(err);
        res.status(400).json({ message : "Cannot delete post!"})
    }
    
}

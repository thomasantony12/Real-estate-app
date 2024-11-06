export const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId);
    res.status(200).json({ message : "Authentication successful"});

}


export const shouldBeAdmin = async (req, res) => {

}
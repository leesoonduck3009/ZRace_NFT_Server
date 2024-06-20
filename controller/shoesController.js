const {firestore} = require("../config/firebaseAdminConfig.js")
const addShoes = async(req,res)=>{
    const data = req.body;
    const batch = firestore.batch();
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: "Invalid input data. Expected an array of shoes." });
    }
    data.forEach(shoe => {
        const shoeRef = firestore.collection('shoes').doc(); // Tạo một reference cho từng tài liệu
        batch.set(shoeRef, shoe); 
    });
    try {
        await batch.commit(); // Thực hiện batch commit để thêm tất cả các tài liệu cùng lúc
        console.log('Successfully added all shoes to Firestore.');
      } catch (error) {
        console.error('Error adding shoes to Firestore: ', error);
    }
    //const respone = await firestore.collection("shoes").add(data);
    res.status(200).json({data: data});
}
module.exports = {addShoes}
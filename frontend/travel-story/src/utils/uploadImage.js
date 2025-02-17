import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try{
    const response = await axiosInstance.post("/image-upload",formData,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }catch(error){
    console.error("An error occurred while uploading image. Please try again!", error.message);
    throw error;
  }
}

export default uploadImage;
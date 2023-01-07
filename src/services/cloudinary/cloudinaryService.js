export const uploadImages = async (mediaURLs, id) => {
  try {
    const imageUrls = [];
    const url =
      "https://api.cloudinary.com/v1_1/" +
      process.env.REACT_APP_CLOUD_NAME +
      "/auto/upload";
    await Promise.all(
      Array.from(mediaURLs).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        formData.append("api_key", process.env.REACT_APP_API_KEY);
        formData.append("timestamp", Date.now());
        formData.append("folder", `mediab4u/${id}/posts`);

        let response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        response = await response.json();

        imageUrls.push(response.secure_url);
      })
    );
    return imageUrls;
  } catch (err) {
    console.log(err.message);
  }
};

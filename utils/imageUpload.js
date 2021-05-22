export const imageUpload = async (images, token, isAvatar=false) => {

    let imgArr = []
    for(const item of images){
        const formData = new FormData()
        formData.append("file", item);       
        const res = await fetch('/api/uploads', {
            method: "POST",
            body: formData,
            headers: { 
                        'Authorization': token 
                    },
            onUploadProgress: (event) => {
                console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
              }
        })
        const data = await res.json();
        if(data !== undefined && data.data !== undefined && data.data[0] !== undefined && data.data[0].url !== undefined && data.data[0].url.url !== undefined){
            imgArr.push({url: data.data[0].url.url})
        }
    }
    return imgArr;
}
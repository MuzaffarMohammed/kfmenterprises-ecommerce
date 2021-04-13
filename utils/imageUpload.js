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
        imgArr.push({url: '/assets/images/'+item.name})
    }
    return imgArr;
}
const cl = console.log;

const showModal = document.getElementById("showModal");
const moviemodal = document.getElementById("moviemodal");
const movieform = document.getElementById("movieform");
const title = document.getElementById("title");
const imgurl = document.getElementById("imgurl");
const overview = document.getElementById("overview");
const rating = document.getElementById("rating");
const backdrop = document.getElementById("backdrop");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn")
const loader = document.getElementById("loader");

const movieContainer = document.getElementById("movieContainer");

const closeModal  = [...document.querySelectorAll(".closeModal")]

let baseUrl = `https://movies-b2691-default-rtdb.asia-southeast1.firebasedatabase.app`;
let posturl = `${baseUrl}/movies.json`;

const objtoarr = (obj) =>{
    let arr = [];
    for(const key in obj){
        arr.push({...obj[key], id : key})
    }
    return arr
}

const makeapicall = (apiurl, methodName, msgBody = null)=>{
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
     return  fetch(apiurl, {
        method: methodName,
        body: msgBody,
        headers : {
            "content-type" : "Application/json"
        }

    })
    .then(res => {
      return  res.json()
    })
}

const  templating = (arr) => {
    let result =``;
    arr.forEach(obj => {
        result += `<div class="col-md-4">
                                <div class="card">
                                    <figure class="moviecard" id="${obj.id}">
                                        <img src="${obj.imgurl}" alt="${obj.title}">
                                        <figcaption>
                                            <div class="ratingSection">
                                                <div class="row">
                                                    <div class="col-md-10">
                                                        <h2>${obj.title}</h2>
                                                    </div>
                                                    <div class="col-md-2">
                                                        ${obj.rating >= 4 ? `<span class="badge badge-success">${obj.rating}</span>`:
                                                    obj.rating < 4 && obj.rating>=2 ? `<span class="badge badge-warning">${obj.rating}</span>` : `<span class="badge badge-danger">${obj.rating}</span>`
                                                }
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="overviewsection">
                                                <h3>${obj.title}</h3>
                                                <em>overview</em>
                                                <p>${obj.overview}</p>
                                            
                                                    <div class="action">
                                                        <button class="btn btn-primary" type="button" onclick = "onMovieEdit(this)">Edit</button>
                                                        <button class="btn btn-danger" type="button" onclick = "onMovieDelete(this)">Delete</button>
                                                    </div>
                                           </div> 
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>`
    })
    movieContainer.innerHTML = result;
}

makeapicall(posturl,"GET", null)
.then(data=>{
    cl(data)
  let array=  objtoarr(data)
    templating(array.reverse())
})
.catch(err=>{
    cl(err)
})

const modalBackdropToggle = ()=>{
    backdrop.classList.toggle('active');
    moviemodal.classList.toggle('active');
    movieform.reset();
    updatebtn.classList.add("d-none")
    submitbtn.classList.remove("d-none")
};

showModal.addEventListener("click", modalBackdropToggle);

closeModal.forEach(btn => {
    btn.addEventListener("click", modalBackdropToggle);

});

const onMovieDelete = (e) =>{
  
    Swal.fire({
      title: "Do you want to remove this movie?",
      
      showCancelButton: true,
      confirmButtonText: "remove",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let deleteId = e.closest(".moviecard").id;
    cl(deleteId)
    loader.classList.remove("d-none")
    let deleteUrl = `${baseUrl}/movies/${deleteId}.json`;
    makeapicall(deleteUrl, "DELETE")
    .then(res=>{
        cl(res)
        e.closest(".col-md-4").remove()
        loader.classList.add("d-none")
    })
    .catch(err => {
        cl(err)
    })
    
      } 
    });

    
}

const onMovieEdit = (e)=>{
    let editId = e.closest(".moviecard").id;
    cl(editId)
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/movies/${editId}.json`;
    cl(editUrl);
    loader.classList.remove("d-none");
    makeapicall(editUrl,"GET")
    .then(res=>{
        cl(res)
        modalBackdropToggle();
        title.value = res.title;
        imgurl.value = res.imgurl;
        overview.value = res.overview;
        rating.value = res.rating;
        submitbtn.classList.add("d-none");
        updatebtn.classList.remove("d-none");
    })
    .catch(err=>{
        
    })
    .finally(()=>{
        loader.classList.add("d-none")
       
    })
}

const addMovieCard = (obj) => {
    let card = document.createElement("div");
    card.id = obj.id;
    card.className = "col-md-4";
    card.innerHTML = ` <div class="card">
                            <figure class="moviecard" id="${obj.id}">
                                <img src="${obj.imgurl}" alt="${obj.title}">
                                <figcaption>
                                    <div class="ratingSection">
                                        <div class="row">
                                            <div class="col-md-10">
                                                <h2>${obj.title}</h2>
                                            </div>
                                            <div class="col-md-2">
                                            ${obj.rating >= 4 ? `<span class="badge badge-success">${obj.rating}</span>`:
                                            obj.rating < 4 && obj.rating >= 2 ? `<span class="badge badge-warning">${obj.rating}</span>` : `<span class="badge badge-danger">${obj.rating}</span>`
                                        }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="overviewsection">
                                            <h3>${obj.title}</h3>
                                            <em>overview</em>
                                            <p>${obj.overview}</p>
                                    
                                            <div class="action">
                                                <button class="btn btn-primary" type="button" onclick = "onMovieEdit(this)">Edit</button>
                                                <button class="btn btn-danger" type="button" onclick = "onMovieDelete(this)">Delete</button>
                                            </div>
                                   </div> 
                                </figcaption>
                            </figure>
                        </div>`
                        movieContainer.prepend(card);
}

const onMovieAdd = (e) => {
    e.preventDefault();
    //  movieform.reset();
    let obj = {
        title : title.value,
        imgurl : imgurl.value,
        overview : overview.value,
        rating : rating.value
    }
    cl(obj)
    // movieform.reset();
    loader.classList.remove("d-none")
    makeapicall(posturl,"POST", obj)
    .then(res=>{
        cl(res)
        obj.id = res.name;
        addMovieCard(obj)
        cl(addMovieCard)
        Swal.fire({
            title: "Movie Added Successfully",
            timer: 1000,
            icon: "success"
          });
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        movieform.reset();
        modalBackdropToggle();
        loader.classList.add("d-none")
    })
}

const onMovieUpdate =()=>{
    let updateId = localStorage.getItem("editId");
    cl(updateId);

    let updateUrl = `${baseUrl}/movies/${updateId}.json`
     cl(updateUrl);

     let updatedObj = {
        title : title.value,
        imgurl : imgurl.value,
        overview : overview.value,
        rating : rating.value,
        id : updateId
     }
     cl(updatedObj);
     loader.classList.remove("d-none")
     makeapicall(updateUrl, "PATCH", updatedObj)
     .then(res=>{
        cl(res)
        let card  = document.getElementById(updateId);
        cl(card);
        card.innerHTML = `<div class="card">
        <figure class="moviecard" id="${updatedObj.id}">
            <img src="${updatedObj.imgurl}" alt="${updatedObj.title}">
            <figcaption>
                <div class="ratingSection">
                    <div class="row">
                        <div class="col-md-10">
                            <h2>${updatedObj.title}</h2>
                        </div>
                        <div class="col-md-2">
                        ${updatedObj.rating >= 4 ? `<span class="badge badge-success">${updatedObj.rating}</span>`:
                        updatedObj.rating < 4 && updatedObj.rating>=2 ? `<span class="badge badge-warning">${updatedObj.rating}</span>` : `<span class="badge badge-danger">${updatedObj.rating}</span>`
                    }
                        </div>
                    </div>
                </div>
                <div class="overviewsection">
                    <h3>${updatedObj.title}</h3>
                    <em>overview</em>
                    <p>${updatedObj.overview}</p>
                
                    <div class="action">
                    <button class="btn btn-primary" type="button" onclick = "onMovieEdit(this)">Edit</button>
                    <button class="btn btn-danger" type="button" onclick = "onMovieDelete(this)">Delete</button>
                    </div>
                  </div>  
            </figcaption>
        </figure>
    </div>`
    modalBackdropToggle();
    movieform.reset();
    updatebtn.classList.add("d-none");
    submitbtn.classList.remove("d-none");
    loader.classList.add("d-none");
    Swal.fire({
        title: "Movie updated Successfully",
        timer: 1000,
        icon: "success"
      });
     })
     .catch(err=>{
        movieform.reset();
     })
     .finally(()=>{
        // movieform.reset()
        updatebtn.classList.add("d-none");
        submitbtn.classList.remove("d-none");
     })
}


movieform.addEventListener("submit", onMovieAdd);
updatebtn.addEventListener("click", onMovieUpdate);
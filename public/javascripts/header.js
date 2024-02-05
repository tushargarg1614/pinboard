// code for lightmode
  
function applyStyles() {
    var checkbox = document.querySelector("#checkbox");
    var body = document.querySelector('.body');


    var isLightMode = localStorage.getItem('isLightMode');
    if (isLightMode) {
        checkbox.checked = true;
        body.style.backgroundColor = "white";
        body.style.color = "#262B37";
    } else {
        checkbox.checked = false;
        body.style.backgroundColor = "#262B37";
        body.style.color = "white";
    }
}


document.addEventListener('DOMContentLoaded', applyStyles);


var checkbox = document.querySelector("#checkbox");
checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
       
        localStorage.setItem('isLightMode', 'true');
    } else {
      
        localStorage.removeItem('isLightMode');
    }

    
    applyStyles();
});

//code for search input 
var srchInp =document.querySelector("#srch-user")
 var srchSpace=document.querySelector(".searchSpace")
 var cross= document.querySelector("#cross")


srchInp.addEventListener('focus',function(){
srchSpace.style.visibility="visible"
cross.style.visibility="visible"

})
cross.addEventListener('click',function(){
srchSpace.style.visibility="hidden"
cross.style.visibility="hidden"
})

//code for sending ajax req to backend for user 
 srchInp.addEventListener('input', function(){
    axios.get(`/username/${srchInp.value}`)
    .then(function(data){
        var userCard=""
        data.data.forEach(elem => {
         userCard+=`<div class="user hover:bg-slate-300  w-full gap-2 h-12 ">
         <div class="prof-card  flex gap-2 ml-5">
         <img src="./images/uploads/${elem. profileimage}" alt="" class="object-cover border-blue-700 border-2 bg-black h-12 w-12 rounded-full">
         <div class="user-detail  flex flex-col ">
         <div class="userFullName cursor-pointer text-md  font-bold "> ${elem.fullname} 
         <p class="userName cursor-default user  text-sm font-thin">${elem.username}</p>
         </div>
         </div>
         </div>
        </div>`
        
    });
    srchSpace.innerHTML=userCard
    userCard=""
    srchSpace.addEventListener('click',function(){
        if(event.target.classList.contains('userFullName') ){
           var clickedUser= event.target.querySelector('.userName').innerHTML
          console.log(clickedUser)
           axios.post('/clickedUser',{username:clickedUser})
           .then(function(res){
            let loggedUser= res.data.username
            if(loggedUser===clickedUser){
                return window.location.href="/profile"
            }
             return window.location.href="/user"  
            
           })
          
        }
         console.log(event.target)
     })
    })  
 }) 
// // code for showing currently visited page
// var link = document.querySelectorAll(".link")
// link.forEach(function(elem){
//     elem.addEventListener("click",function(){
//         this.style.color="green"
//     })
// })

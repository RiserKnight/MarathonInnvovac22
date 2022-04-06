const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");

// if startQuiz button clicked
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); //show info box
}
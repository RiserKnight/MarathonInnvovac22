const ques1_btn = document.querySelector(".section1 .ques1_btn ");
const ques2_btn = document.querySelector(".section1 .ques2_btn ");
const ques3_btn = document.querySelector(".section1 .ques3_btn");
const ques4_btn = document.querySelector(".section1 .ques4_btn");

let ques_count=0;

window.onload=()=>{
    ques_count=0;
    showQuestions(ques_count);
    showbutton(ques_count);
}
ques1_btn.onclick = ()=>{
    ques_count=0;
    showQuestions(ques_count);
    showbutton(ques_count);
}

ques2_btn.onclick = ()=>{
    ques_count=1;
    showQuestions(ques_count);
    showbutton(ques_count);
}

ques3_btn.onclick = ()=>{
    ques_count=2;
    showQuestions(ques_count);
    showbutton(ques_count);
}

ques4_btn.onclick = ()=>{
    ques_count=3;
    showQuestions(ques_count);
    showbutton(ques_count);
}

function showQuestions(index){
    var que_text = document.querySelector(".que_text");
    var constraints = document.querySelector(".constraints");
    var example1 = document.querySelector(".example1");
    var example2 = document.querySelector(".example2");
    var example3 = document.querySelector(".example3");
    var example4 = document.querySelector(".example4");
    var inputs = document.querySelector(".inputs");

    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let const_tag = '<div class="option"><span>'+ questions[index].constraints +'</span></div>';

    let exam1_tag = '<div class="option"><span>'+ questions[index].example1 +'</span></div>';

    let exam2_tag = '<div class="option"><span>'+ questions[index].example2+'</span></div>';

    let exam3_tag = '<div class="option"><span>'+ questions[index].example3 +'</span></div>';

    let exam4_tag = '<div class="option"><span>'+ questions[index].example4+'</span></div>';

    let input_tag= '<div class="option"><span>'+ questions[index].inputs+'</span></div>';
    que_text.innerHTML = que_tag;
     //adding new span tag inside 
     constraints.innerHTML = const_tag;
     example1.innerHTML = exam1_tag;
     example2.innerHTML = exam2_tag;
     example3.innerHTML = exam3_tag;
     example4.innerHTML = exam4_tag;
     inputs.innerHTML = input_tag;
}

function showbutton(index){
    var upload= document.querySelector(".upload");
     
    let upload_btn='<form action="/uploadfile" id="post" method="post" enctype="multipart/form-data"><div class="form-group"><label for="file1">Upload File 1:</label><input type="file" name="file1" id="" required class="form-control"></div><div class="form-group"><label for="file2">Upload File 2:</label><input type="file" name="file2" id="" required class="form-control"></div><div class="form-group"><button class="btn btn-danger btn-block">Upload Files</button></div></form>';
      upload.innerHTML=upload_btn;
     
}



const quiz_box = document.querySelector(".quiz_box");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const option_list = document.querySelector(".option_list");
const next_btn = document.getElementById("nextBtn");
const option1=document.getElementById("option1");
const option2=document.getElementById("option2");
const option3=document.getElementById("option3");
const option4=document.getElementById("option4");
const user_ans=document.getElementById("user_ans");

var ansSubmit = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            clearTimeout(timeoutObj);
            document.getElementById("stage2ques").submit();
        }
    };
})();

// if continueQuiz button clicked
window.onload = ()=>{
    
    quiz_box.classList.add("activeQuiz"); //show quiz box
    startTimer(30); //calling startTimer function
 //   startTimerLine(0); //calling startTimerLine function
 timeoutObj = setTimeout(ansSubmit, 30000);
}

let timeValue =  30;
let counter;
let counterLine;
let widthValue = 0;

const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked


option1.onclick=()=>{addSelection(option1);}
option2.onclick=()=>{addSelection(option2);}
option3.onclick=()=>{addSelection(option3);}
option4.onclick=()=>{addSelection(option4);}



function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
        
                    console.log("Time Off: Auto selected correct answer.");
              
        //show the next button if user selected any option
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 56);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}

function addSelection(option){
    for(a=0;a<4;a++){
        option_list.children[a].classList.remove("correct");
    }
    option.classList.add("correct");
    user_ans.value=option.id;
    next_btn.classList.add("show");
}
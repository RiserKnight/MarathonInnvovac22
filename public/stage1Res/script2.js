const quiz_box = document.querySelector(".quiz_box");
const wait_box = document.querySelector(".wait_box");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const submitBtn=document.getElementById("stage1submit");
const waitCount = document.querySelector(".timer .wait_sec");

submitBtn.addEventListener("click", function(event){
    event.preventDefault()
  });
  var ansSubmit = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            clearTimeout(timeoutObj);
            document.getElementById("stage1ques").submit(); 
        }
    };
})();
// if continueQuiz button clicked
window.onload = ()=>{
    
    quiz_box.classList.add("activeQuiz"); //show quiz box
    startTimer(90); //calling startTimer function
  //  startTimerLine(0); //calling startTimerLine function
    timeoutObj = setTimeout(ansSubmit, 90000);
}

submitBtn.onclick=()=>{
    console.log("click huya");
    quiz_box.classList.remove("activeQuiz");
    wait_box.classList.add("activeWait");
    const waittime=timeCount.innerHTML;
    
    startTimer1(waittime);

}

let timeValue =  90;
let counter;
let counterLine;
let widthValue = 0;

const bottom_ques_counter = document.querySelector("footer .total_que");

/*
function ansSubmit(){
clearTimeout(timeoutObj);
document.getElementById("stage1ques").submit(); 
}*/
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
        }
    
    }
}
function startTimer1(time){
    counter = setInterval(timer1, 1000);
    function timer1(){
        waitCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = waitCount.textContent; 
            waitCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off 
        }
    
    }
}



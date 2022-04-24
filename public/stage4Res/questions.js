let questions = [
    {
    numb: 1,
    question: "If a number does not contain any subsequence  of digits that is a prime,it is called an antiprime in this issue. 446, 18, and 844, for example, are antiprimes, although 346, 181, and 222 are not. It's worth noting that 181 is not an antiprime because its digits contain the prime subsequence 11. You've been handed a String N, which represents a large integer N. You're also provided an integer D with a maximum value of 8. Let X be the number of antiprimes with exactly N digits, with each digit ranging from 1 to D, inclusive. Calculate and return the value of X, which can be rather huge (X modulo 1,000,000,007).",
    constraints: [
       "-N will have between 1 and 1,000 characters, inclusive.<br>-Each character of N will be a digit.<br>-The character N[0] will not be '0'.<br>D will be between 1 and 8, inclusive."
    ],
    example1: [
      "61214027451155456631310754220433707056704675307344311 <br> 7 <br>Returns: 328754822"
    ],
    example2:[
      "1<br> 5 <br>Returns: 2 <br>We are interested in 1-digit numbers that only use digits 1 through 5. Among those, there are two antiprime numbers: 1 and 4."
    ],
    example3:[
      "2 <br>4 <br>Returns: 2 <br> Here the two antiprime numbers are 14 and 44."
    ],
    example4:[
      "2 <br>3 <br> Returns: 0 <br> There are no antiprime numbers among the numbers 11, 12, 13, 21, 22, 23, 31, 32, and 33."
    ],
    inputs:[
      ""
    ]
  },
    {
    numb: 2,
    question: "You're considering adopting the following betting strategy: you'll stake one dollar in the first round. If you win the bet, you keep the dollar and place a new wager in the following round. Otherwise, you'll lose a $1 and have to stake two dollars in the next round (provided you still have at least two dollars in your account). If you win, you get two dollars and bet one dollar in the third round; if you lose, you lose two dollars and bet four dollars in the third round (if you have at least that much in your account), and so on. To put it another way, everytime you lose a wager, the next round's bet is doubled. When you win, the following round's wager will be one dollar.You'll be given an int initSum that represents the amount of money you start with. You'll also get a String as a result. The ith character of the outcome will be either 'W' (win) or 'L' (loss), indicating the round's conclusion. After all of the rounds have been completed, return the amount of money you will have. If you don't have enough money in your account to pay the value of the bet at any stage, you must stop and refund the amount you have.",
    constraints: [
      "-	initSum will be between 1 and 1000, inclusive.<br>-	outcome will contain between 1 and 50 characters, inclusive.<br>-	Each character of outcome will be either 'W' or 'L'."
    ],
    example1: [
      	"12 <br> WWWWWWWW <br> Returns: 20 <br>You are really lucky. You win one dollar in each round, so you end up with 20 dollars."
    ],
    example2:[
      	"15 <br> LLLWLLLL <br>Returns: 1 <br>After losing 7 dollars in the first three rounds, you have just enough money to cover your bet for the fourth round. You win 8 dollars in this round, but lose another 15 in the last four, so your final sum will be one dollar."
    ],
    example3:[
       	"20 <br>WLWLWLWL <br> Returns: 23 <br> You win one dollar in each odd numbered round and lose one dollar in the last round."
    ],
    example4:[
      	"925 <br> WLLLLLWLLLLLLWWWWWLWLLWLLLLLLWL<br> Returns: 934"
    ],
    inputs:[
      "1.210 <br>   WLLLWWLLWLLLL <br><br> 2.625 <br>  LLLLWLLWWL <br><br> 3.74<br> WWWLLWLLLLWWWLLLW"
    ]
  },
 {
    numb: 3,
    question: "Alice is a topper in her batch. She knows the maximum duration D of the exam (in minutes) and secret marks M which is required to top the exam. An exam contains N problems, Marks for each problem is represented by Marks array where Marks(i) denotes the marks allotted to the ith problem. Time (in minutes) taken to solve each problem is represented by Time array where Time(i) denotes the time she required to solve ith problem.Task:Determine whether she will be able to top this time or not. For each test case, print YES if she will top the exam else print NO.",
    constraints:[
    "-D: Represents the maximum duration of the exam <br> -M: Represents the secret marks required to top the exam <br>-N: Represents the number of problems in the exam <br> -Marks: Represents the marks allotted to each problem <br> -Time: Represents the marks required to solve each problem"
    ],
    example1: [
      "D = 10 <br> M = 13 <br> N = 4 <br> Marks = [2, 5, 8, 6] Time = [4, 6, 3, 5] <br> Returns : YES <br> exam duration is 10 and Secret Marks is 13. She can choose problems 2 and 3 with marks 5 and 8 & duration 6 and 3 to solve in the given time to get the required marks."
    ],
  example2:[
    "D = 5 <br> M = 10 <br> N = 2 <br> Marks = [9, 9] Time = [3, 3] <br> Returns: NO <br> In this case, she can not achieve the required marks in the given time."
  ],
  example3:[
    "D = 5 <br> M = 3 <br> N = 4 <br> Marks = [1, 2, 3, 4] Time = [1, 1, 1, 1] <br> Returns : YES <br> She can choose all four problems, the total time taken to solve all the problems is 4 and the total marks is 10. "
  ],
  example4:[ 
    " " 
  ]
    
  },
    {
    numb: 4,
    question: "Every rabbit knows what to try to to just in case of a flood. All you would like to try to to is to urge to some extent above the water level and await Mazai. But when the particular flood happens, rabbits start to panic. That’s why we invite your help to make an optimal evacuation plan for rabbits.Let’s describe the flood as a game between a rabbit and water. Game takes place during a rectangular grid with n rows and m columns. Let’s say that some extent during a row i and a column j has coordinates (i, j). it's known, that for all 1 ≤ i ≤ n, 1 ≤ j ≤ m a cell with coordinates (i, j) has height hij. The rabbit starts at some extent with coordinates (r1, c1), water starts at point with coordinates (r2, c2). Moreover, the rabbit features a property named jump height.The rabbit and water alternate , the rabbit makes the primary move. After each move the rabbit either doesn’t move or jumps to any adjacent cell. Cells are adjacent, if they need a standard side. additionally to the present , the rabbit cannot move to a cell, which height exceeds the peak of a current cell quite on jump height. Water just fills all the cells that have adjacent cell crammed with water of greater or equal height. Both water and therefore the rabbit should stay within the sport grid. Rabbit can only survive within the cells not crammed with water. the sport doesn’t ever stop. Your task is to seek out the minimum jump height the rabbit must have so as to survive for infinite time. if the rabbit cannot survive in any case,in a single line output -1.otherwise,in a single line output a single number- the least jump height that rabbit should have in order to survive for infinte time.",
    constraints:[
      "-First line of input contains 2 integer numbers n and m separated with a space (1 ≤ n, m ≤ 100, n · m ≠1 ) — size of the game grid.<br>-The next n lines describe grid cells. Each of n strings contains m integer numbers, separated with a space hij (0 ≤ hij ≤ 105) — heights of cells.<br>-The next line contains two integer numbers r1 and c1, separated with a space (1 ≤ r1 ≤ n, 1 ≤ c1 ≤ m) — initial location of the rabbit.<br>The last line contains two integers r2 and c2, separated with a space (1 ≤ r2 ≤ n, 1 ≤ c2 ≤ m) — initial location of water.<br>-It is guaranteed, that the rabbit and water start in different cells. Columns are numerated from 1 to m from left to right. Rows are numerated from 1 to n from top to bottom."
      ],
      example1: [
        "2 3 <br>6 5 4 <br> 1 2 3 <br> 2 1 <br> 1 3 <br> Returns : 3"
    ],
    example2:[
      "1 3 <br> 0 0 0 <br> 1 1 <br> 1 3 <br> Returns: -1"
    ],
    example3:[
      ""
    ],
    example4:[ 
      "" 
    ]
     
  }
]
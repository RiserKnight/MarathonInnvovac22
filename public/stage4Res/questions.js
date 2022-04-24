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
      "1.4313227 <br> 7 <br><br> 2.4145151034304051222355504123532555424043555140100<br> 5 <br><br> 3. 10222310 <br> 3"
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
      "1.968  <br> LLWLLLLLWLLLWWLWLWLWWWWLWLWLLWWWLWLWLWLWWLLWLWWW <br><br> 2.	433 <br> WWWWWWLLWLLLWLWWWLLWLWLLLWWLWWWWWW <br><br> 3.	15 <br>LWWLLLLWLLLLL"
    ]
  },
 {
    numb: 3,
    question: "You are given a string s consisting of lower case English letters and '.'. A string is called good if all of its characters are equal, e.g. 'aaa' is good whereas 'aab' is not.Each '.' should be replaced by a letter ('a' - 'z') so as to maximize number of good substrings in s. Return the maximum number of possible good substrings you can have.",
    constraints:[
    "-	Number of characters in s will be between 1 and 500, inclusive. <br>-	Each character of s will be a lower case English letter ('a' to 'z') or '.'."
    ],
    example1: [
      "'aab' <br> Returns: 4 <br>Following 4 substrings are good. Assume 1 based indexing. s[1, 1] = 'a', s[1, 2] = 'aa', s[2, 2] = 'a', s[3, 3] = 'b'."
    ],
  example2:[
    "	'a.' <br> Returns: 3 <br> You can fill '.' by 'a' and get string 'aa' whose all three substrings are good."
  ],
  example3:[
    "'topcoder.is.quite...good..imho....' <br> Returns: 56 "
  ],
  example4:[ 
    " '.acb.a.cbcac..b.b..bb.caaacbac.abcab..bbababcb.aa.' <br> Returns: 119 " 
  ],
  inputs:[
    "1.'..aa..baaabbb.b.a.aaa.aaabba.a.b.abb.b..ba.aaaaaaa.' <br> 2. 'bbaab..bba.a..a.ccccb...abaa.ccaaacbacc.bcaccbccbac..bc.cabbba.bcbc.bbacbcbabcbccaaaaabcccccb.a.ca..cabccabcab.bb.b.caa.bacbbacbcacaaa.aab...ca.c.abb.aacccca'<br> 3.	'............'"
  ]
    
  },
    {
    numb: 4,
    question: "Alice is a topper in her batch. She knows the maximum duration D of the exam (in minutes) and secret marks M which is required to top the exam. An exam contains N problems, Marks for each problem is represented by Marks array where marks(i) denotes the marks allotted to the ith problem. Time (in minutes) taken to solve each problem is represented by Time array where time(i) denotes the time she required to solve ith problem.Task-Determine whether she will be able to top this time or not.",
    constraints:[
      "-D: Represents the maximum duration of the exam <br> -M: Represents the secret marks required to top the exam <br> -N: Represents the number of problems in the exam <br> -Marks: Represents the marks allotted to each problem <br> -Time: Represents the marks required to solve each problem"
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
    ],
    inputs:[
      "1. 65 170 11 <br> 49 62 88 94 22 83 74 52 69 57 15 <br> 46 84 59 29 51 18 57 30 15 38 15 <br><br> 2.86 99 10 <br>86 6 9 61 64 68 2 63 14 81 <br> 88 17 8 42 20 61 76 21 27 2  <br><br>3.46 210 12 <br> 10 79 47 16 33 41 65 66 56 98 73 34 <br> 96 85 45 28 37 80 61 22 82 10 86 74 "
    ]
  }
]
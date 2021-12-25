/*
I solved this by hand instead of by code

Part 1:

#############
#...........# 0000
###B#B#D#D###
  #C#C#A#A#
  #########

############# 2000
#.........D.# 2000
###B#B#D#.###
  #C#C#A#A#
  #########

############# 9
#.A.......D.# 2009
###B#B#D#.###
  #C#C#A#.#
  #########

############# 3000
#.A.........# 5009
###B#B#D#.###
  #C#C#A#D#
  #########

############# 4000
#.A.........# 9009
###B#B#.#D###
  #C#C#A#D#
  #########

############# 3
#.A.....A...# 9012
###B#B#.#D###
  #C#C#.#D#
  #########

############# 20
#.A.B...A...# 9032
###B#.#.#D###
  #C#C#.#D#
  #########

############# 600
#.A.B...A...# 9632
###B#.#.#D###
  #C#.#C#D#
  #########

############# 30
#.A.....A...# 9662
###B#.#.#D###
  #C#B#C#D#
  #########

############# 40
#.A.....A...# 9702
###.#B#.#D###
  #C#B#C#D#
  #########

############# 700
#.A.....A...# 10402
###.#B#C#D###
  #.#B#C#D#
  #########

############# 3
#.......A...# 10405
###.#B#C#D###
  #A#B#C#D#
  #########

############# 6
#...........# 10411
###A#B#C#D###
  #A#B#C#D#
  #########

*/

/*
Part 2
.. . . . ..
  B B D D
  D C B A
  D B A C
  C C A A

.. . . . .D	5000
  B B . D
  D C B A
  D B A C
  C C A A

B. . . . .D	80
  B B . D
  D C . A
  D B A C
  C C A A

B. . . . AD	6
  B B . D
  D C . A
  D B . C
  C C A A

B. . . A AD	5
  B B . D
  D C . A
  D B . C
  C C . A

BB . . A AD	40
  B . . D
  D C . A
  D B . C
  C C . A

BB . . A AD	800
  B . . D
  D . . A
  D B . C
  C C C A

BB B . A AD	40
  B . . D
  D . . A
  D . . C
  C C C A

BB B . A AD	900
  B . . D
  D . . A
  D . C C
  C . C A

BB . . A AD	50
  B . . D
  D . . A
  D . C C
  C B C A

B. . . A AD	60
  B . . D
  D . . A
  D B C C
  C B C A

.. . . A AD	60
  B . . D
  D B . A
  D B C C
  C B C A

.. . . A AD	40
  . B . D
  D B . A
  D B C C
  C B C A

D. . . A AD	4000
  . B . D
  . B . A
  D B C C
  C B C A

DD . . A AD	4000
  . B . D
  . B . A
  . B C C
  C B C A

DD . . A AD	1000
  . B . D
  . B C A
  . B C C
  . B C A

DD . . . AD	9
  . B . D
  . B C A
  . B C C
  A B C A

DD . . . .D	10
  . B . D
  . B C A
  A B C C
  A B C A

DD . . . DD	2000
  . B . .
  . B C A
  A B C C
  A B C A

DD . . . DD	10
  . B . .
  A B C .
  A B C C
  A B C A

DD . . . DD	600
  . B C .
  A B C .
  A B C .
  A B C A

DD . . . DD	11
  A B C .
  A B C .
  A B C .
  A B C .

DD . . . .D	5000
  A B C .
  A B C .
  A B C .
  A B C D

DD . . . ..	5000
  A B C .
  A B C .
  A B C D
  A B C D

D. . . . ..	9000
  A B C .
  A B C D
  A B C D
  A B C D

.. . . . ..	9000
  A B C D
  A B C D
  A B C D
  A B C D
*/
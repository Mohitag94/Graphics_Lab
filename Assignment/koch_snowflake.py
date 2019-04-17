from turtle import *
  
canvas = Screen()
canvas.title("KOCH_SnowFlake")
canvas.setup(1000,700)
canvas.bgcolor("red") 
color("white")
pensize(2) 


def snowflake(lengthSide, depth): 
    if depth == 0: 
        forward(lengthSide) 
        return
    lengthSide /= 3.0
    snowflake(lengthSide, depth-1) 
    left(60) 
    snowflake(lengthSide, depth-1) 
    right(120) 
    snowflake(lengthSide, depth-1) 
    left(60) 
    snowflake(lengthSide, depth-1) 
  
# main function 
if __name__ == "__main__": 
    speed(500000)                    
    length = 450.0              
    
    penup()                       
    backward(length/2.0)         
  
    pendown()          
    for i in range(3):     
        snowflake(length, 4) 
        right(120) 
  
    mainloop()  

from turtle import *

canvas = Screen()
canvas.title("LEVI`S_Curve")
canvas.setup(1000,700)
canvas.bgcolor("pink") 
color("blue")
pensize(2) 

def C_curve(x1, y1, x2, y2, level):

    def drawLine(x1, y1, x2, y2):
    	speed(350)
        up()
        goto(x1,y1)
        down()
        goto(x2,y2)

    if level == 0:
        drawLine(x1, y1, x2, y2)
    else:
        xm = (x1+x2+y1-y2)/2
        ym = (x2+y1+y2-x1)/2
        C_curve(x1, y1, xm, ym, level-1)
        C_curve(xm, ym, x2, y2, level-1)

def main():
    C_curve(0, -100, 0, 100, 10)
    mainloop()

main()
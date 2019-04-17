import sys
import pygame
from pygame import gfxdraw
from pygame.locals import QUIT

#color definition
black=(0,0,0)
red=(227,0,0)
green=(0,227,0)
blue=(0,0,227)
white=(227,227,227)
rgb=(200,123,130)

#def draw_screen():
	
(width, height) = (1000, 700)
screen=pygame.display.set_mode((width, height),0,32)
pygame.display.set_caption("DDA_Line")
screen.fill(rgb)
pygame.display.update()


def dda(x1, y1, x2, y2):
	
	m = float((y2-y1)) / float((x2-x1))
	print("Slope is ", m)
	points=[]
	x, y = x1, y1
	#pygame.gfxdraw.pixel(screen, int(round(x)), int(round(y)), black)
	points.append((int(round(x)),int(round(y))))

	while(x<x2):
		x+=1
		y+=m
		points.append((int(round(x)),int(round(y))))
		#pygame.gfxdraw.pixel(screen, int(round(x)), int(round(y)), black)
	
	return points


def draw_line(x1,y1,x2,y2):
	
	points=dda(x1,y1,x2,y2)

	for p in points:
		print("Ploting Point: ", p)
		pygame.gfxdraw.pixel(screen, p[0], p[1], black)
		pygame.display.update()

	while True:
		for event in pygame.event.get():
			if event.type == QUIT:
				pygame.quit()
				quit()

	pygame.display.update()


draw_line(12,11,350,350)
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
rgb=(23,23,23)

#def draw_screen():
pygame.init()
(width, height) = (1000, 700)
screen=pygame.display.set_mode((width, height),0,32)
pygame.display.set_caption("BRESENHAMS_Line")
screen.fill(green)
pygame.display.update()

def correct_order(x1, y1, x2, y2):
	if x2 > x1:
		return x1, y1, x2, y2
	else:
		return x2, y2, x1, y1

def bresenhams_line(x1, y1, x2, y2):
	x1, y1, x2, y2 = correct_order(x1, y1, x2, y2)
	m_new = 2 * (y2-y1)
	slope_error_new = m_new - (x2-x1)
	y=y1
	
	points = []

	for x in range(x1,(x2+1)):
		#print(x,y)
		points.append((x,y))
		#pygame.gfxdraw.pixel(screen, x, y, black)

		slope_error_new += m_new
		if slope_error_new >= 0:
			y += 1
			slope_error_new -= 2 * (x2-x1)
	#pygame.display.update()
	return points

def draw_line(x1,y1,x2,y2):
	
	points=bresenhams_line(x1,y1,x2,y2)

	for p in points:
		print("Ploting Point: ", p)
		pygame.gfxdraw.pixel(screen, p[0], p[1], black)
		pygame.display.update()

	while True:
		for event in pygame.event.get():
			if event.type == QUIT:
				pygame.quit()
				sys.exit()

	pygame.display.update()


draw_line(50,50,350,350)
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
rgb=(29,66,100)

#def draw_screen():
pygame.init()
(width, height) = (1000, 700)
screen=pygame.display.set_mode((width, height),0,32)
pygame.display.set_caption("BRESENHAMS_Circle")
screen.fill(rgb)
pygame.display.update()

def bresenhams_circle(radius, center):
	d = 3 - (2 * radius)
	x = 0
	y = radius
	points = []
	xc = center[0]
	yc = center[1]

	#diving the circle into 8 parts
	points.append((xc + x, yc + y))
	points.append((xc + y, yc + x))
	points.append((xc + y, yc - x))
	points.append((xc + x, yc - y))

	points.append((xc - x, yc + y))
	points.append((xc - y, yc + x))
	points.append((xc - x, yc - y))
	points.append((xc - y, yc - x))
	
	while(x <= y):
		x += 1
		if d <= 0:
			d += (4*x) + 6
		else:
			d += 4 * (x - y) + 10
			y -= 1

		points.append((xc + x, xc + y))
		points.append((xc + y, xc + x))

		points.append((xc + y, xc - x))
		points.append((xc + x, xc - y))

		points.append((xc - x, xc + y))
		points.append((xc - y, xc + x))

		points.append((xc - x, xc - y))
		points.append((xc - y, xc - x))

	return points

def draw_circle(radius, center):
	
	points = bresenhams_circle(radius, center)

	for p in points:
		print("Ploting Point: ", p)
		pygame.gfxdraw.pixel(screen, p[0], p[1], red)
		pygame.display.update()

	while True:
		for event in pygame.event.get():
			if event.type == QUIT:
				pygame.quit()
				sys.exit()

draw_circle(200, (350,350))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import random

# Create a new image with a dark background
width, height = 1920, 1080
image = Image.new('RGB', (width, height), (0, 0, 0))
draw = ImageDraw.Draw(image)

# Add a subtle gradient
for y in range(height):
    for x in range(width):
        # Create a subtle blue gradient
        r = 0
        g = int(10 * (1 - y/height))
        b = int(20 * (1 - y/height))
        draw.point((x, y), fill=(r, g, b))

# Add stars
for _ in range(1000):
    x = random.randint(0, width)
    y = random.randint(0, height)
    size = random.randint(1, 3)
    brightness = random.randint(150, 255)
    draw.ellipse([x-size, y-size, x+size, y+size], fill=(brightness, brightness, brightness))

# Add some nebula-like effects
for _ in range(5):
    x = random.randint(0, width)
    y = random.randint(0, height)
    radius = random.randint(100, 300)
    color = (random.randint(0, 50), random.randint(0, 50), random.randint(50, 100))
    for r in range(radius, 0, -1):
        alpha = int(255 * (1 - r/radius))
        draw.ellipse([x-r, y-r, x+r, y+r], fill=(color[0], color[1], color[2], alpha))

# Apply a slight blur for a more ethereal look
image = image.filter(ImageFilter.GaussianBlur(radius=1))

# Save the image
image.save('back.png', 'PNG') 
from matplotlib.lines import Line2D
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Parameters
N = 4  # Number of Majoranas
L = 10  # Length of the screen


# Set up the figure and axis
fig, ax = plt.subplots()
ax.set_xlim(0, L)  # Width of the screen
ax.set_ylim(-L / 2, L / 2)  # Height of the screen
ax.set_aspect('equal')
ax.axis('off')


line1 = Line2D([L/5 - L/5/3.5, 4*L/5 + L/5/3.5], [0.5, 0.5], color='grey', lw=1)
ax.add_line(line1)


for i in range (1, 5):
    line = Line2D([i*L/5 - L/5/3.5, i*L/5 + L/5/3.5], [-0.5, -0.5], color='grey', lw=1)
    ax.add_line(line)

for i in range (1, 5):
    if i !=1:
        line1 = Line2D([i*L/5 - L/5/3.5, i*L/5 - L/5/3.5], [-0.5, -1.5], color='grey', lw=1)
        ax.add_line(line1)
    if i != 4:
        line2 = Line2D([i*L/5 + L/5/3.5, i*L/5 + L/5/3.5], [-0.5, -1.5], color='grey', lw=1)
        ax.add_line(line2)

    







# Initialize Majoranas and their positions
majoranas = []
init_positions = []
colors = ['red', 'blue', 'green', 'orange']
for idx in range(N):
    x = L / (N + 1) * (idx + 1)
    y = 0
    init_positions.append([x, y])
    majoranas.append(plt.Circle((x, y), 0.3, color=colors[idx]))
    ax.add_patch(majoranas[idx])

plt.show()
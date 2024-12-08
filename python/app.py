import tkinter as tk
from tkinter import messagebox
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
from matplotlib.lines import Line2D
from matplotlib.patches import Circle
from matplotlib.animation import FuncAnimation
import numpy as np

N = 4  
L = 10  

index_mapping = list(range(N))

def exchange_neighbors(i, j):
    if i > j:
        i, j = j, i
    
    trajectory_i, trajectory_j = [], []
    physical_i, physical_j = index_mapping[i], index_mapping[j]
    init_i = init_positions[physical_i]
    init_j = init_positions[physical_j]
    no_steps = int(L / (N + 1) * 20)

    for k in range(no_steps // 4):
        x_i = init_i[0] + (L / (2 * (N + 1))) * (k / (no_steps // 4))
        trajectory_i.append([x_i, 0])
        trajectory_j.append(init_j)

    for k in range(no_steps // 4, no_steps // 2):
        x_i = init_i[0] + L / (2 * (N + 1))
        y_i = -1 * (k - no_steps // 4) / (no_steps // 4)
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(init_j)

    for k in range(no_steps // 2, no_steps):
        x_j = init_j[0] + (init_i[0] - init_j[0]) * ((k - no_steps // 2) / (no_steps // 2))
        trajectory_i.append(trajectory_i[-1])
        trajectory_j.append([x_j, 0])

    for k in range(no_steps // 4):
        x_i = trajectory_i[-1][0]
        y_i = trajectory_i[-1][1] + (0 - trajectory_i[-1][1]) * (k / (no_steps // 4))
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(trajectory_j[-1])

    for k in range(no_steps // 4):
        x_i = trajectory_i[-1][0] + (init_j[0] - trajectory_i[-1][0]) * (k / (no_steps // 4))
        y_i = 0
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(trajectory_j[-1])

    return trajectory_i, trajectory_j, physical_i, physical_j

def start_animation():
    try:
        i = int(entry_i.get())
        j = int(entry_j.get())
        if not (0 <= i < N and 0 <= j < N and abs(i - j) == 1):
            raise ValueError

        trajectory_i, trajectory_j, physical_i, physical_j = exchange_neighbors(i, j)

        def animate(frame):
            if frame < len(trajectory_i):
                majoranas[physical_i].center = trajectory_i[frame]
                majoranas[physical_j].center = trajectory_j[frame]
            return majoranas[physical_i], majoranas[physical_j]

        ani = FuncAnimation(fig, animate, frames=len(trajectory_i), interval=50, blit=True, repeat=False)
        
        print(f"Index Mapping: {index_mapping}")

        index_mapping[i], index_mapping[j] = index_mapping[j], index_mapping[i]

        init_positions[physical_i], init_positions[physical_j] = init_positions[physical_j], init_positions[physical_i]
        
        canvas.draw()

    except ValueError:
        messagebox.showerror("Input Error", "Enter valid indices (0-3) for two neighboring Majoranas.")

root = tk.Tk()
root.title("Majorana Exchange Simulation")

frame = tk.Frame(root)
frame.pack(side=tk.LEFT)

label_i = tk.Label(frame, text="Index i (0-3):")
label_i.pack()
entry_i = tk.Entry(frame)
entry_i.pack()

label_j = tk.Label(frame, text="Index j (0-3):")
label_j.pack()
entry_j = tk.Entry(frame)
entry_j.pack()

start_button = tk.Button(frame, text="Start", command=start_animation)
start_button.pack()

fig = Figure(figsize=(6, 4))
ax = fig.add_subplot(111)
ax.set_xlim(0, L)
ax.set_ylim(-L / 2, L / 2)
ax.set_aspect('equal')
ax.axis('off')

line1 = Line2D([L / 5 - L / 5 / 3.5, 4 * L / 5 + L / 5 / 3.5], [0.5, 0.5], color='grey', lw=1)
ax.add_line(line1)

for i in range(1, 5):
    line = Line2D([i * L / 5 - L / 5 / 3.5, i * L / 5 + L / 5 / 3.5], [-0.5, -0.5], color='grey', lw=1)
    ax.add_line(line)

for i in range(1, 5):
    if i != 1:
        line1 = Line2D([i * L / 5 - L / 5 / 3.5, i * L / 5 - L / 5 / 3.5], [-0.5, -1.5], color='grey', lw=1)
        ax.add_line(line1)
    if i != 4:
        line2 = Line2D([i * L / 5 + L / 5 / 3.5, i * L / 5 + L / 5 / 3.5], [-0.5, -1.5], color='grey', lw=1)
        ax.add_line(line2)

init_positions = [[L / (N + 1) * (idx + 1), 0] for idx in range(N)]
majoranas = [Circle((x, y), 0.3, color=color, ec='black') for (x, y), color in
             zip(init_positions, ['red', 'yellow', 'green', 'blue'])]

for circle in majoranas:
    ax.add_patch(circle)

canvas = FigureCanvasTkAgg(fig, root)
canvas.get_tk_widget().pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

root.mainloop()
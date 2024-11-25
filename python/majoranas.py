from matplotlib.lines import Line2D
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Parameters
N = 4  # Number of Majoranas
L = 10  # Length of the screen

# Set up the figure 
fig, ax = plt.subplots()
ax.set_xlim(0, L)  
ax.set_ylim(-L / 2, L / 2)  
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


# Initialize Majoranas 
majoranas = []
init_positions = []
colors = ['red', 'yellow', 'green', 'blue']
for idx in range(N):
    x = L / (N + 1) * (idx + 1)
    y = 0
    init_positions.append([x, y])
    majoranas.append(plt.Circle((x, y), 0.3, color=colors[idx], ec='black'))
    ax.add_patch(majoranas[idx])


def exchange_neighbors(i, j):
    '''
    Calculates trajectories for exchanging two neighboring Majoranas i and j
    '''
    
    trajectory_i, trajectory_j = [], []
    init_i = init_positions[i]
    init_j = init_positions[j]
    no_steps = int(L / (N + 1) * 20)

    # Move i rightwards, j stays in place
    for k in range(no_steps // 4):
        x_i = init_i[0] + (L / (2 * (N + 1))) * (k / (no_steps // 4))
        trajectory_i.append([x_i, 0])
        trajectory_j.append(init_j)

    #  Move i downward
    for k in range(no_steps // 4, no_steps // 2):
        x_i = init_i[0] + L / (2 * (N + 1))
        y_i = -1 * (k - no_steps // 4) / (no_steps // 4)
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(init_j)

    # Move j to init_i
    for k in range(no_steps // 2, no_steps):
        x_j = init_j[0] + (init_i[0] - init_j[0]) * ((k - no_steps // 2) / (no_steps // 2))
        trajectory_i.append(trajectory_i[-1])  # i stays in place
        trajectory_j.append([x_j, 0])

    # Move i to y = 0
    for k in range(no_steps // 4):
        x_i = trajectory_i[-1][0]  # x remains fixed
        y_i = trajectory_i[-1][1] + (0 - trajectory_i[-1][1]) * (k / (no_steps // 4))
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(trajectory_j[-1])  # j stays in place

    # Move i to init_j
    for k in range(no_steps // 4):
        x_i = trajectory_i[-1][0] + (init_j[0] - trajectory_i[-1][0]) * (k / (no_steps // 4))
        y_i = 0  # y is fixed at 0
        trajectory_i.append([x_i, y_i])
        trajectory_j.append(trajectory_j[-1])  # j stays in place

    return trajectory_i, trajectory_j


def exchange(i, j):
    '''
    Calculates trajectories for exchanging any two Majoranas i and j
    '''
    
    if i > j:
        i, j = j, i

    trajectories = [[pos.copy()] for pos in init_positions]

    sequence = []
    if j == i:
        return trajectories
    if j == i + 1:
        sequence.append((i, j))
    elif j == i + 2:
        sequence.append((i, i + 1))
        sequence.append((i, j))
        sequence.append((i+1, j))
    elif j == i + 3:
        sequence.append((i, i + 1))
        sequence.append((i + 2, j))
        sequence.append((i, j))
        sequence.append((i, i + 2))
        sequence.append((i+1, j))

    else:
        raise ValueError("Invalid exchange")

    # Perform the exchanges
    for k, l in sequence:
        traj_k, traj_l = exchange_neighbors(k, l)

        # Update trajectories
        for t in range(len(traj_k)):
            for m in range(N):
                if m == k:
                    # Update for k
                    trajectories[m].append(traj_k[t])
                elif m == l:
                    # Update for l
                    trajectories[m].append(traj_l[t])
                else:
                    # Keep others stationary for this step
                    trajectories[m].append(trajectories[m][-1])

        # Keep positions updated
        init_positions[k], init_positions[l] = init_positions[l], init_positions[k]

    return trajectories

#--------------------------------------------------------------------------------------------------------------

print("Enter the indices of the Majoranas to be exchanged (0 to 3):")
i, j = map(int, input().split())

trajectories = exchange(i, j)

def update(frame):
    for idx, traj in enumerate(trajectories):
        if frame < len(traj):
            majoranas[idx].center = traj[frame]
    return majoranas

#--------------------------------------------------------------------------------------------------------------

ani = FuncAnimation(fig, update, frames=len(trajectories[0]), interval=40, blit=True)

plt.show()

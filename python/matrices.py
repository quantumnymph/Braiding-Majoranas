import numpy as np

U12 = [[np.exp(-1j*np.pi/4), 0, 0, 0],
       [0, np.exp(1j*np.pi/4), 0, 0],
       [0, 0, np.exp(-1j*np.pi/4), 0],
       [0, 0, 0, np.exp(1j*np.pi/4)]]

U23 = [[1, -1j, 0, 0],
       [-1j, 1, 0, 0],
       [0, 0, 1, -1j],
       [0, 0, -1j, 1]]

U34 = [[np.exp(-1j*np.pi/4), 0, 0, 0],
       [0, np.exp(1j*np.pi/4), 0, 0],
       [0, 0, np.exp(1j*np.pi/4), 0],
       [0, 0, 0, np.exp(-1j*np.pi/4)]]

def dagger(U):
    return np.conj(np.transpose(U))



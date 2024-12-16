from matrices import U12, U23, U34
import numpy as np


def element_as_vector(a):
    return [float(a.real), float(a.imag)]

def vector_to_string(v):
    result = ""
    # case: both vector elements are zero
    if abs(v[0]) < 1e-15 and abs(v[1]) < 1e-15:
        result += "0"
    # case: real part is zero
    elif abs(v[0]) < 1e-15:
        if v[1] == 1:
            result += "i"
        elif v[1] == -1:
            result += "-i"
        else: result += "{}i".format(int(v[1]) if v[1].is_integer() else v[1])
    # case: imaginary part is zero
    elif abs(v[1]) < 1e-15:
        result += "{}".format(int(v[0]) if v[0].is_integer() else v[0])

    # case: both real and imaginary parts are whole numbers
    elif v[0].is_integer() and v[1].is_integer():
        # case: both real and imaginary parts are positive
        if v[0] > 0 and v[1] > 0:
            result += "{}+{}i".format(int(v[0]), int(v[1]))
        # case: real part is positive and imaginary part is negative
        elif v[0] > 0 and v[1] < 0:
            result += "{}-{}i".format(int(v[0]), int(abs(v[1])))
        # case: real part is negative and imaginary part is positive
        elif v[0] < 0 and v[1] > 0:
            result += "-{}+{}i".format(int(abs(v[0])), int(v[1]))

    if result != "": return result

    #else: result is in the form a*e^(i*theta)
    angle = np.arctan2(v[1], v[0])
    magnitude = np.sqrt(v[0]**2 + v[1]**2)
    
    #convert angle to multiples of pi if possible
    argument = angle/np.pi

    if magnitude != 1: result += "{}".format(int(magnitude) if magnitude.is_integer() else magnitude)
    if argument < 0:
        result += "e^{-i\\frac{\\pi}{" + "{}".format(int(1/abs(argument))) + "}}"
    else: result += "e^{-i\\frac{\\pi}{" + "{}".format(int(1/abs(argument))) + "}}"
    #print(magnitude, argument, angle)
    
    return result
        
def matrix_to_string(U):
    result = []
    for row in U:
        result.append([vector_to_string(element_as_vector(a)) for a in row])
    return result

#dot product of two matrices
def matrix_multiply(A, B):
    result = []
    for i in range(len(A)):
        result.append([])
        for j in range(len(B[0])):
            result[i].append(sum([A[i][k]*B[k][j] for k in range(len(A[0]))]))
    return result

print(element_as_vector(-2*1j*np.exp(1j*np.pi/4)))
print(element_as_vector(2*np.exp(-1j*np.pi/4)))
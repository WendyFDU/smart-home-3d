import keras
import numpy as np

from keras.models import Sequential
from keras.layers import Convolution2D, MaxPooling2D
from keras.layers import Activation, Dropout, Flatten, Dense
from keras.optimizers import SGD, RMSprop, Adam
from keras.regularizers import l2
from keras.layers.normalization import BatchNormalization
from keras.callbacks import ModelCheckpoint, Callback 

test_input_filepath = 'Sensor_test_input.txt'

# Build network structure
model = Sequential()

model.add(Dense(20, input_dim=17))
model.add(Activation('relu'))
model.add(Dense(20))
model.add(Activation('relu'))
model.add(Dense(20))
model.add(Activation('relu'))
model.add(Dense(20))
model.add(Activation('relu'))
model.add(Dense(20))
model.add(Activation('relu'))
model.add(Dense(5))
model.add(Activation('sigmoid'))

model.load_weights('best_new_sensor.h5')

# Generate input data
test_X = np.genfromtxt(test_input_filepath, delimiter='\t')

test_y = model.predict(x=test_X)

np.savetxt("Sensor_test_actual_output.txt", test_y, fmt='%.4f')
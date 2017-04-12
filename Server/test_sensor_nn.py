import keras
import numpy as np
import sys
import json

from keras.models import Sequential
from keras.layers import Convolution2D, MaxPooling2D
from keras.layers import Activation, Dropout, Flatten, Dense
from keras.optimizers import SGD, RMSprop, Adam
from keras.regularizers import l2
from keras.layers.normalization import BatchNormalization
from keras.callbacks import ModelCheckpoint, Callback 

# Read input from command line
paramStr = sys.argv[1]
params = np.fromiter(json.loads(paramStr), np.float)
# print(params)

test_X = np.reshape(params, (1, 17))
# print(test_X)

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

# Calculate output
test_y = model.predict(x=test_X)
print(json.dumps(test_y[0].tolist()))


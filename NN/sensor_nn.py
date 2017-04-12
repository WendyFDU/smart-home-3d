import keras
import numpy as np

from keras.models import Sequential
from keras.layers import Convolution2D, MaxPooling2D
from keras.layers import Activation, Dropout, Flatten, Dense
from keras.optimizers import SGD, RMSprop, Adam
from keras.regularizers import l2
from keras.layers.normalization import BatchNormalization
from keras.callbacks import ModelCheckpoint, Callback 

train_input_filepath = 'New_sensor_train_input.txt'
train_output_filepath = 'New_sensor_train_output.txt'
nb_epoch = 1000

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

# model.save('cnn_model.h5')

#sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9)
#adam = Adam(lr=0.0001)
#rmsprop = RMSprop(lr=0.0001)
model.compile(loss='mean_squared_error',
              optimizer='adam')
              # metrics=['accuracy']

# Generate input data
train_X = np.genfromtxt(train_input_filepath, delimiter='\t')
train_y = np.genfromtxt(train_output_filepath, delimiter='\t')
# valid_X = np.genfromtxt(valid_input_filepath, delimiter='\t')
# valid_y = np.genfromtxt(valid_output_filepath, delimiter='\t')

checkpointer = ModelCheckpoint(filepath="best_new_sensor_test.h5", verbose=1, save_best_only=True)  

model.fit(
    x=train_X,
    y=train_y,
    nb_epoch=nb_epoch,
    validation_data=(train_X, train_y),
    callbacks=[checkpointer])

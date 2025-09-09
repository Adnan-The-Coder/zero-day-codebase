import tensorflow as tf
import numpy as np

# Load model (dummy for now)
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(4,)),
    tf.keras.layers.Dense(10, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid")
])
model.compile(optimizer="adam", loss="binary_crossentropy")

def predict(data: dict):
    # Example: expects { "features": [..] }
    x = np.array([data["features"]])
    y_pred = model.predict(x)
    return float(y_pred[0][0])
    
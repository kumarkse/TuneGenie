from tensorflow.keras.models import load_model


# Load the saved model
model = load_model('model.keras')

# Display the model summary
model.summary()

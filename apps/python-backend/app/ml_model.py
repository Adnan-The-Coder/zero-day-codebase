# import tensorflow as tf
# import numpy as np

# # Load model (dummy for now)
# model = tf.keras.Sequential([
#     tf.keras.layers.Input(shape=(4,)),
#     tf.keras.layers.Dense(10, activation="relu"),
#     tf.keras.layers.Dense(1, activation="sigmoid")
# ])
# model.compile(optimizer="adam", loss="binary_crossentropy")

# def predict(data: dict):
#     # Example: expects { "features": [..] }
#     x = np.array([data["features"]])
#     y_pred = model.predict(x)
#     return float(y_pred[0][0])
# ==========================================================
# 📧 Email / Fraud / Phishing Classification Script
# ==========================================================

# ----------------------------------------------------------
# Imports
# ----------------------------------------------------------
import os
import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import html
import glob

# ----------------------------------------------------------
# Dataset Folder Path (⚠️ adjust if needed)
# ----------------------------------------------------------
data_folder = r"C:\Users\ZEBA FATHIMA\ext\zero-day-codebase\apps\python-backend\assests"

# Model artifacts folder (inside same email spam folder)
artifacts_folder = os.path.join(data_folder, "model_artifacts")
os.makedirs(artifacts_folder, exist_ok=True)

# ----------------------------------------------------------
# Load CSVs automatically
# ----------------------------------------------------------
csv_files = glob.glob(os.path.join(data_folder, "*.csv"))

if not csv_files:
    raise SystemExit(f"❌ No CSV files found in {data_folder}")

print(f"✅ Found {len(csv_files)} CSV files:")
dfs = []
for path in csv_files:
    try:
        df = pd.read_csv(path, encoding="latin1", on_bad_lines="skip")
        df["__source_file"] = os.path.basename(path)
        dfs.append(df)
        print(f"   Loaded {os.path.basename(path)} → {df.shape}")
    except Exception as e:
        print(f"⚠️ Could not load {os.path.basename(path)}: {e}")

print(f"\n✅ Loaded {len(dfs)} valid datasets")

# ----------------------------------------------------------
# Auto-detect text & label columns
# ----------------------------------------------------------
def pick_text_label_columns(df):
    text_cols = [c for c in df.columns if any(k in c.lower() for k in ["text","message","body","content"])]
    label_cols = [c for c in df.columns if any(k in c.lower() for k in ["label","class","spam","target"])]

    if not text_cols:  # fallback: longest string column
        str_cols = [c for c in df.columns if df[c].dtype == "object"]
        if str_cols:
            lengths = {c: df[c].astype(str).map(len).median() for c in str_cols}
            text_cols = [max(lengths, key=lengths.get)]

    if not label_cols:  # fallback: small integer column
        candidate = None
        for c in df.columns:
            if df[c].dtype != "object" and df[c].nunique() <= 10:
                candidate = c
                break
        if candidate:
            label_cols = [candidate]

    return text_cols[0] if text_cols else None, label_cols[0] if label_cols else None

rows = []
for df in dfs:
    tcol, lcol = pick_text_label_columns(df)
    if tcol and lcol:
        tmp = df[[tcol, lcol]].copy()
        tmp.columns = ["text", "label"]
        tmp["text"] = tmp["text"].astype(str)
        rows.append(tmp)
        print(df["__source_file"].iloc[0], "=> text:", tcol, ", label:", lcol)
    else:
        print("Skipping", df["__source_file"].iloc[0])

if rows:
    data = pd.concat(rows, ignore_index=True)
    print("\nCombined dataset shape:", data.shape)
else:
    raise SystemExit("No valid datasets found.")

# ----------------------------------------------------------
# Clean text and normalize labels
# ----------------------------------------------------------
def clean_text(s):
    s = html.unescape(s)
    s = re.sub(r"http\S+", " ", s)
    s = re.sub(r"\S+@\S+", " ", s)
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

data["text_clean"] = data["text"].map(clean_text)

mapping = {}
for val in data["label"].unique():
    sval = str(val).lower()
    if sval in ["spam", "1", "true", "phishing", "malicious"]:
        mapping[val] = 1
    elif sval in ["ham", "0", "false", "legitimate", "clean", "good"]:
        mapping[val] = 0

if mapping:
    data["label_num"] = data["label"].map(mapping)
else:
    if data["label"].nunique() == 2:
        vals = list(data["label"].unique())
        data["label_num"] = (data["label"] == vals[0]).astype(int)
    else:
        raise SystemExit("⚠️ Please manually map label values to 0/1")

print("\nSample after cleaning:")
print(data[["text_clean","label_num"]].head())

# ----------------------------------------------------------
# Train/Test split + Model training
# ----------------------------------------------------------
X = data["text_clean"]
y = data["label_num"].astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

pipe = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=20000, ngram_range=(1,2), stop_words="english")),
    ("clf", LogisticRegression(max_iter=1000))
])

print("🚀 Training on", X_train.shape[0], "examples...")
pipe.fit(X_train, y_train)

# Save trained model
model_path = os.path.join(artifacts_folder, "spam_tfidf_logreg.pkl")
joblib.dump(pipe, model_path)
print(f"✅ Model saved to {model_path}")

# ----------------------------------------------------------
# Evaluation
# ----------------------------------------------------------
pred = pipe.predict(X_test)
print("\nAccuracy:", accuracy_score(y_test, pred))
print("\nClassification report:\n", classification_report(y_test, pred))
print("\nConfusion matrix:\n", confusion_matrix(y_test, pred))

# ----------------------------------------------------------
# Streamlit App Code (auto-write to file)
# ----------------------------------------------------------
# Write Streamlit app code directly from notebook
streamlit_code = """
import streamlit as st
import joblib
import os

st.set_page_config(page_title="Email / Phishing Classifier", layout="centered")

st.title("📧 Email / Phishing / Fraud Classifier")
st.write(
    "Paste an email or message below and the model will predict "
    "whether it is **spam/phishing (1)** or **not spam (0)**."
)

# ✅ Correct Windows path for the saved model
MODEL_PATH = r"C:\\Users\\ZEBA FATHIMA\\Downloads\\email spam\\model_artifacts\\spam_tfidf_logreg.pkl"

if not os.path.exists(MODEL_PATH):
    st.error(f"❌ Model not found at {MODEL_PATH}. Run the training script first to save the model.")
else:
    model = joblib.load(MODEL_PATH)

    text = st.text_area("Email text:", height=250)

    if st.button("🔍 Classify"):
        if not text.strip():
            st.warning("Please enter some text to classify.")
        else:
            pred = model.predict([text])[0]
            proba = model.predict_proba([text])[0]

            st.write("### ✅ Prediction:", int(pred))
            st.write("**Probability (not spam, spam):**", [float(x) for x in proba])

            if pred == 1:
                st.error("🚨 Model prediction: **SPAM / PHISHING**")
            else:
                st.success("👍 Model prediction: **NOT SPAM**")

    st.markdown("---")
    st.caption("Model artifacts stored in: `C:\\\\Users\\\\ZEBA FATHIMA\\\\Downloads\\\\email spam\\\\model_artifacts`")

"""

with open("streamlit_app.py", "w", encoding="utf-8") as f:
    f.write(streamlit_code)

print("✅ Streamlit app written to streamlit_app.py")

with open(os.path.join(data_folder, "streamlit_app.py"), "w", encoding="utf-8") as f:
    f.write(streamlit_code)

print(f"\n✅ Streamlit app written to {os.path.join(data_folder, 'streamlit_app.py')}")



    
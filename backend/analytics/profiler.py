import pandas as pd


def detect_column_type(series):
    """
    Automatically detect the semantic type of a dataframe column.
    """

    # Remove missing values for analysis
    non_null = series.dropna()

    if len(non_null) == 0:
        return "empty"

    # Normalize values for checking
    values = (
        non_null.astype(str)
        .str.strip()
        .str.lower()
    )

    unique_values = set(values.unique())

    # Boolean detection
    boolean_values = {
        "true", "false",
        "yes", "no",
        "y", "n"
    }

    if unique_values.issubset(boolean_values):
        return "boolean"

    # Already numeric
    if pd.api.types.is_numeric_dtype(series):

        # High uniqueness can indicate an ID
        uniqueness = series.nunique() / len(non_null)

        if uniqueness > 0.95:
            return "id"

        return "numeric"

    # Try converting strings to numbers
    cleaned = (
        non_null.astype(str)
        .str.replace(r"[$₹,%]", "", regex=True)
        .str.replace(",", "", regex=False)
        .str.strip()
    )

    numeric_test = pd.to_numeric(
        cleaned,
        errors="coerce"
    )

    numeric_ratio = numeric_test.notna().mean()

    if numeric_ratio >= 0.90:

        uniqueness = numeric_test.nunique() / len(non_null)

        if uniqueness > 0.95:
            return "id"

        return "numeric"

    # Try datetime detection
    datetime_test = pd.to_datetime(
        non_null,
        errors="coerce"
    )

    datetime_ratio = datetime_test.notna().mean()

    if datetime_ratio >= 0.85:
        return "datetime"

    # Detect ID-like columns
    uniqueness = series.nunique() / len(non_null)

    if uniqueness > 0.95:
        return "id"

    # Detect long text
    average_length = values.str.len().mean()

    if average_length > 40:
        return "text"

    # Otherwise categorical
    return "categorical"


def profile_dataset(df):
    """
    Analyze the structure and quality of a dataframe.
    """

    profile = []

    for column in df.columns:

        series = df[column]

        detected_type = detect_column_type(series)

        profile.append({
            "column": column,
            "type": detected_type,
            "missing": int(series.isna().sum()),
            "unique": int(series.nunique()),
            "sample": (
                str(series.dropna().iloc[0])
                if not series.dropna().empty
                else None
            )
        })

    return profile

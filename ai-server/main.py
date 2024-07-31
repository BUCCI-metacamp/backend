import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from model import OnlineModel

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

app = FastAPI()
model = OnlineModel()

class Targets(BaseModel):
    BenefitPerTime: float
    Benefit: float
    GoodProductRatio: float
    Line01GoodProductRatio: float
    Line02GoodProductRatio: float
    Line03GoodProductRatio: float

class SpeedData(BaseModel):
    values: Dict[str, float]
    targets: Targets

class OptimizationResult(BaseModel):
    best_values: Dict[str, float]
    best_target_value: float

class OptimizationResults(BaseModel):
    BenefitPerTime: OptimizationResult
    Benefit: OptimizationResult
    GoodProductRatio: OptimizationResult

@app.post("/train")
async def train(data: SpeedData):
    values = data.values
    targets = {
        "BenefitPerTime": data.targets.BenefitPerTime,
        "Benefit": data.targets.Benefit,
        "GoodProductRatio": data.targets.GoodProductRatio,
        "Line01GoodProductRatio": data.targets.Line01GoodProductRatio,
        "Line02GoodProductRatio": data.targets.Line02GoodProductRatio,
        "Line03GoodProductRatio": data.targets.Line03GoodProductRatio,
    }
    
    logger.debug(f"train data - values: {values}, targets: {targets}")
    
    try:
        model.update_model(values, targets)
    except Exception as e:
        logger.error(f"Error updating model: {e}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Model updated with new data"}

@app.get("/predict", response_model=OptimizationResults)
async def predict():
    try:
        result = model.predict_optimal_value()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result

@app.post("/reset")
async def reset():
    try:
        result = model.reset_model()
    except Exception as e:
        logger.error(f"Error reset model: {e}")  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Model reset"}
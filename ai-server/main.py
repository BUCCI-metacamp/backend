from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import OnlineModel

app = FastAPI()
model = OnlineModel()

class SpeedData(BaseModel):
    M01Duration: float
    M01Time: float
    M02Duration: float
    M02Time: float
    M03Duration: float
    M03Time: float
    ConvSpeedRatio: float
    BenefitPerTime: float
    Benefit: float
    Good: float

class OptimalSpeedResponse(BaseModel):
    pusher_speed1: float
    operating_interval1: float
    pusher_speed2: float
    operating_time2: float
    pusher_speed3: float
    operating_time3: float
    conveyor_speed: float
    predicted_revenue: float

@app.post("/train/")
async def train(data: SpeedData):
    values = [data.M01Duration, data.M01Time, data.M02Duration,
              data.M02Time, data.M03Duration, data.M03Time, data.ConvSpeedRatio,
              data.BenefitPerTime, data.Benefit, data.Good]
    revenue = data.revenue

    try:
        model.update_model(values, revenue)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Model updated with new data"}

@app.post("/predict/", response_model=OptimalSpeedResponse)
async def predict():
    try:
        best_values, best_revenue = model.predict_optimal_value()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return OptimalSpeedResponse(
        pusher_speed1=best_values[0],
        operating_interval1=best_values[1],
        pusher_speed2=best_values[2],
        operating_time2=best_values[3],
        pusher_speed3=best_values[4],
        operating_time3=best_values[5],
        conveyor_speed=best_values[6],
        predicted_revenue=best_revenue
    )

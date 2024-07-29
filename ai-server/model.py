from sklearn.linear_model import SGDRegressor
import numpy as np
import joblib
import os
from scipy.optimize import minimize
from skopt import gp_minimize
from sklearn.preprocessing import StandardScaler

class OnlineModel:
  def __init__(self, model_path="model.joblib"):
    self.model_path = model_path
    self.model = SGDRegressor()
    self.scaler = StandardScaler()
    self.model_initialized = False
    self.load_model()

  def update_model(self, values, revenue):
    values_scaled = self.scaler.fit_transform([values])
    if not self.model_initialized:
      self.model.partial_fit([values], [revenue])
      self.model_initialized = True
    else:
      self.model.partial_fit([values], [revenue])
      self.save_model()

  def predict_optimal_value(self):
    if not self.model_initialized:
      raise ValueError("Model is not trained yet")
          
    bounds = [
        (0.1, 2.0),  # 1번 기계 푸셔 속도 (m/s)
        (1.0, 10.0),  # 1번 기계 작동 간격 (초)
        (0.1, 2.0),  # 2번 기계 푸셔 속도 (m/s)
        (1.0, 10.0),  # 2번 기계 동작 시간 (초)
        (0.1, 2.0),  # 3번 기계 푸셔 속도 (m/s)
        (1.0, 10.0),  # 3번 기계 동작 시간 (초)
        (0.05, 1.0)   # 컨베이어 속도 (m/s)
    ]
        
    result = self._optimize_lbfgsb(bounds)
    # result = self._optimize_bayesian(bounds)

    return result
      
  def _optimize_lbfgsb(self, bounds):
    def objective(x):
      x_scaled = self.scaler.transform([x])
      return -self.model.predict(x_scaled)[0]  # 최대화를 위해 음수 사용

    initial_guess = [np.mean(b) for b in bounds]
    result = minimize(objective, initial_guess, method='L-BFGS-B', bounds=bounds)
        
    best_values = result.x
    best_revenue = -result.fun
        
    return best_values, best_revenue
  
  # def _optimize_bayesian(self, bounds):
  #   def objective(x):
  #     x_scaled = self.scaler.transform([x])
  #     return -self.model.predict(x_scaled)[0]

  #   result = gp_minimize(objective, bounds, n_calls=100, random_state=1)
        
  #   best_values = result.x
  #   best_revenue = -result.fun
        
  #   return best_values, best_revenue

  def save_model(self):
    joblib.dump((self.model, self.model_initialized), self.model_path)

  def load_model(self):
    if os.path.exists(self.model_path):
      self.model, self.model_initialized = joblib.load(self.model_path)
    else:
      self.model_initialized = False

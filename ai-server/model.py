from river import forest, preprocessing, compose
import numpy as np
import joblib
import os
from scipy.optimize import minimize, differential_evolution

class OnlineModel:
    def __init__(self, model_path="model.joblib"):
        self.model_path = model_path
        self.targets = ['BenefitPerTime', 'Benefit', 'GoodProductRatio', 'Line01GoodProductRatio', 'Line02GoodProductRatio', 'Line03GoodProductRatio']
        self.model = {target: forest.AMFRegressor(n_estimators=3, seed=42) for target in self.targets}
        self.model_initialized = False
        self.load_model()

    def update_model(self, values, targets):
        if not self.model_initialized:
            for target, value in targets.items():
                self.model[target].learn_one(values, value)
            self.model_initialized = True
        else:
            for target, value in targets.items():
                self.model[target].learn_one(values, value)
        self.save_model()

    def predict_optimal_value(self):
        if not self.model_initialized:
            raise ValueError("Model is not trained yet")
          
        bounds = [
            (0.1, 1.0),  # 1번 기계 푸셔 속도 비율
            (1.0, 10.0),  # 1번 기계 작동 간격 (초)
            (0.1, 1.0),  # 2번 기계 푸셔 속도 비율
            (1.0, 10.0),  # 2번 기계 동작 시간 (초)
            (0.1, 1.0),  # 3번 기계 푸셔 속도 비율
            (1.0, 10.0),  # 3번 기계 동작 시간 (초)
            (0.05, 1.0)   # 컨베이어 속도 비율
        ]
        
        results = {}
        for target in self.targets:
            best_values, best_target_value = self._optimize_lbfgsb(bounds, target)
            results[target] = {
                "best_values": best_values,
                "best_target_value": best_target_value,
            }

        return results
      
    def _optimize_lbfgsb(self, bounds, target):
        def objective(x):
            input_dict = dict(zip(
                ['M01Duration', 'M01Time', 'M02Duration', 'M02Time',
                'M03Duration', 'M03Time', 'ConvSpeedRatio'],
                x
            ))
            prediction = self.model[target].predict_one(input_dict)
            return -prediction  # 최대화를 위해 음수 사용

        initial_guess = [np.mean(b) for b in bounds]
        # result = minimize(objective, initial_guess, method='L-BFGS-B', bounds=bounds)
        result = differential_evolution(objective, bounds=bounds)
        
        best_values = dict(zip(
            ['M01Duration', 'M01Time', 'M02Duration', 'M02Time',
             'M03Duration', 'M03Time', 'ConvSpeedRatio'],
            result.x
        ))
        best_target_value = -result.fun
        
        return best_values, best_target_value

    def save_model(self):
        joblib.dump((self.model, self.model_initialized), self.model_path)

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model, self.model_initialized = joblib.load(self.model_path)
        else:
            self.model_initialized = False

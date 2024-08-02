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
        
    def reset_model(self, model_path="model.joblib"):
        self.targets = ['BenefitPerTime', 'Benefit', 'GoodProductRatio', 'Line01GoodProductRatio', 'Line02GoodProductRatio', 'Line03GoodProductRatio']
        self.model = {target: forest.AMFRegressor(n_estimators=3, seed=42) for target in self.targets}
        self.model_initialized = False
        self.delete_model()

    def predict_optimal_value(self):
        if not self.model_initialized:
            raise ValueError("Model is not trained yet")
          
        bounds = [
            (100, 100),  # 1번 기계 푸셔 속도 비율
            (2.5, 25.0),  # 1번 기계 작동 간격
            (1, 100),  # 2번 기계 푸셔 속도 비율
            (3, 3),  # 2번 기계 동작 시간
            (1, 100),  # 3번 기계 푸셔 속도 비율
            (2, 2),  # 3번 기계 동작 시간
            (1, 100)   # 컨베이어 속도 비율
        ]
        
        results = {}
        targets = ['BenefitPerTime', 'Benefit', 'GoodProductRatio']
        for target in targets:
            best_values, best_target_value = self._optimize_de(bounds, target)
            results[target] = {
                "best_values": best_values,
                "best_target_value": best_target_value,
            }

        return results
      
    def _optimize_de(self, bounds, target):
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
        
        additional_targets = ['Line01GoodProductRatio', 'Line02GoodProductRatio', 'Line03GoodProductRatio']
        additional_input_dict = best_values.copy()
        for additional_target in additional_targets:
            best_values[additional_target] = self.model[additional_target].predict_one(additional_input_dict)
        
        best_target_value = -result.fun
        
        return best_values, best_target_value

    def save_model(self):
        joblib.dump((self.model, self.model_initialized), self.model_path)

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model, self.model_initialized = joblib.load(self.model_path)
        else:
            self.model_initialized = False
            
    def delete_model(self):
        if os.path.exists(self.model_path):
            os.remove(self.model_path)
        else:
            print("Model file does not exist.")

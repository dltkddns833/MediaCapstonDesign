import numpy as np
import sys

result = []
canvas_path = './public/bottleneck/canvas_img/canvas.jpg_https~tfhub.dev~google~imagenet~inception_v3~feature_vector~1.txt'
image_path = sys.argv[1]
data_1 = np.loadtxt(fname=canvas_path, delimiter=",")
dist_Q = np.linalg.norm(data_1)

# 벡터길이 비교
for i  in range(1, 81):
    data_2 = np.loadtxt(fname=image_path + '_' + str(i) + '.jpg_https~tfhub.dev~google~imagenet~inception_v3~feature_vector~1.txt', delimiter=",")
    dist = np.linalg.norm(data_1 - data_2) 
    result.append(str(dist))

join_result = "\n".join(result)
print(join_result)
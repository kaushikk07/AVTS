from ultralytics import YOLO
import cv2
import requests
import util
import datetime as dt
from sort.sort import *
from util import get_car, read_license_plate, write_csv
from datetime import datetime,timedelta 


# Define starting time
# start_time = datetime.now()


# Declare a variable to store the starting datetime and camera number
start_datetime = None
camera_number = None

def get_starting_info():
    global start_datetime, camera_number

    # Get starting datetime from user input
    while True:
        start_datetime_str = input("Enter the starting date and time (YYYY-MM-DD HH:MM:SS): ")
        try:
            start_datetime = dt.datetime.strptime(start_datetime_str, "%Y-%m-%d %H:%M:%S")
            break
        except ValueError:
            print("Invalid datetime format. Please enter the datetime in YYYY-MM-DD HH:MM:SS format.")

    # Get camera number from user input
    camera_number = input("Enter the camera number: ")

# Example usage:
get_starting_info()
print("Starting Datetime:", start_datetime)
print("Camera Number:", camera_number)

hiff = 0

results = {}

mot_tracker = Sort()

# load models
coco_model = YOLO('E:/College/sem8/avts/ld/yolov8n.pt')
license_plate_detector = YOLO('E:/College/sem8/avts/ld/online_1.pt')

# load video
cap = cv2.VideoCapture('./sample2.mp4')

vehicles = [2, 3, 5, 7]

#find fps
fps = cap.get(cv2.CAP_PROP_FPS)





# read frames
frame_nmr = -1
ret = True
while ret:
    frame_nmr += 1
    ret, frame = cap.read()
    if ret:
        results[frame_nmr] = {}
        # detect vehicles
        detections = coco_model(frame)[0]
        detections_ = []
        for detection in detections.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = detection
            if int(class_id) in vehicles:
                detections_.append([x1, y1, x2, y2, score])

        # track vehicles
        track_ids = mot_tracker.update(np.asarray(detections_))

        # detect license plates
        license_plates = license_plate_detector(frame)[0]
        for license_plate in license_plates.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = license_plate

            # assign license plate to car
            xcar1, ycar1, xcar2, ycar2, car_id = get_car(license_plate, track_ids)

            if car_id != -1:

                # crop license plate
                license_plate_crop = frame[int(y1):int(y2), int(x1): int(x2), :]

                # process license plate
                license_plate_crop_gray = cv2.cvtColor(license_plate_crop, cv2.COLOR_BGR2GRAY)
                _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 64, 255, cv2.THRESH_BINARY_INV)

                # read license plate number
                license_plate_text, license_plate_text_score = read_license_plate(license_plate_crop_thresh)

                if license_plate_text is not None:
                    # Inside the loop where you process each frame
                    current_time = start_datetime + timedelta(seconds=frame_nmr / fps)
                    print("Current Time:", current_time)

                    # Prepare data for API request
                    data = {
                        "licensePlate": license_plate_text,
                        "date": current_time.strftime("%Y-%m-%d"),
                        "time": current_time.strftime("%H:%M:%S"),
                        "cameraNo": camera_number
                    }

                    # Make POST request to the API endpoint
                    response = requests.post('http://localhost:3000/insert-d2', json=data)

                    if response.status_code == 201:
                        print("Data inserted successfully for frame", frame_nmr)
                    else:
                        print("Failed to insert data for frame", frame_nmr)
                        print("Error:", response.text)

                    if car_id in results[frame_nmr]:
                        results[frame_nmr][car_id]['date_time'] = current_time.strftime("%Y-%m-%d %H:%M:%S")


                    results[frame_nmr][car_id] = {'car': {'bbox': [xcar1, ycar1, xcar2, ycar2]},
                                                  'license_plate': {'bbox': [x1, y1, x2, y2],
                                                                    'text': license_plate_text,
                                                                    'bbox_score': score,
                                                                    'text_score': license_plate_text_score}}

# write results
write_csv(results, './test.csv')
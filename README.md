# BTO

## Steps to Run Project
1. Make sure Docker Desktop and Docker Compose is installed on your machine
    
https://docs.docker.com/compose/install/

https://www.docker.com/products/docker-desktop/

2. Clone the repository
```
git clone https://github.com/BilkentBTO/BTO.git
```
3. cd to project directory
```
cd ./BTO/App
```
4. Run Docker Compose while the Docker Engine is running (have Docker Desktop running at the background)
```
docker compose up
```
Or use compose watch to enable hotloading. (Very useful for development purposes)
```
docker compose watch
```
5. Access the localhost port printed on the terminal. Example output:
```
frontend-1  |   VITE v6.0.3  ready in 159 ms
frontend-1  |
frontend-1  |   ➜  Local:   http://localhost:5173/
frontend-1  |   ➜  Network: http://172.18.0.3:5173/
```
You can view the project via the link given in Local

## Overview

Bilkent Tanıtım Ofisi (BTO) is a website for uses in guidance. It helps the user and the customer as it makes accessing the guide tools easier. These guide tools are mainly campus tours, exhibitions and communications between the guide and the student. This app creates two user types. One of them is public which is for students and teachers. The other one is for private usage which is for the guides and coordinators in Bilkent. This website provides an interaction and a connection between the public and private users.
 

## Features

### Public Section

- **Campus Tour Registration**: 
  - Provides a register system for institutions and individuals for the campus tour.
  - There will be a form that will collect the data of the individuals and the institutions by taking their educational place, city, preferred visit date, preferred visit time, number of participants and the contact info that will be used for arranging the guide times.

- **Transportation and Expectations**:
  - Providing the required transportation info for coming to the campus and showing what visitors should expect during the tour.

- **General Communication**:
  - Makes the communication easier between users as it provides the phone and email
 

- **Exhibition Invitations**:
  - Allows exhibitions to invite the university.

### Private Section

- **Guides and Other Superior Users**:
  - Register as a guide for the upcoming exhibitions and tours.
  - Taking the data of the working hours and making the contact easier between the daily advisor by using communication panels.

- **Advisors and Other Superior Users**:
  - An algorithm will be created to automatically flag a tour as approved or rejected, which will be determined later on.

- **Coordinator Features**:
  - Analysing the data, managing the guides, and approving the exhibitions.

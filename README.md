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
You can view the project via the link given in Local. Defaults to http://localhost:5173/

## Overview

BTO System is an internal tool designed for Bilkent University Information Ofice. The main purpose of the system is to make it easy for High Schools to come and visit Bilkent University. The System manages upcoming tour requests made by high schools, individual tour requests made by individuals and fair requests made by High School.
 

## Features

### Public Features

- **Campus Tour Registration**: 
  - Schools can request a tour. On registration a custom code is given which can be used to track the progress of the registration. 
  - Individuals can request a private tour. Similar code is assigned on successful registration.
  - Schools can invite Bilkent to come and participate in a fair. Similar custom code is again generated to make it easy to keep track of the application.

- **Surveys**: 
  - Each tour has a custom survey assigned to it. Via the custom link provided face-to-face from the guide of the tour, attendants can fill in the survey and show their interest in Bilkent.

- **Apply to Join BTO**: 
  - Students of Bilkent can apply to be a part of the Information Office. They can fill in a registration form to notify the coordinators of the Office.

- **General Contact Information**:
  - General contact information is shown on main page.

### Internal Features

- **Guides**:
  - Guides can list out all available tours which are not assigned to any other guides. 
  - They can apply to be the Guide of that tour and send application request to the Advisors.
  - They can see the tours & fairs they are assigned to. 
  - They can edit their available hours to make them available for assignments.
  - They can view the Advisors of the system for emergency contact.

- **Advisors**:
  - Advisors can Accept/Reject the tour registration requests made by High School Managers. 
  - Accepted tours are made open for Guides to apply. 
  - Guide-Tour applications can be Viewed, Accepted and Rejected. Accepted Guide-Tour applications are added as a confirmed tour to the system. 
  - Advisors can view the tours they are responsible for. 
  - They can also apply to tours just like a Guide in case of an emergency.

- **Coordinator**:
  - Coordinators can list all users and delete an user from the system.
  - They can assign a day of week to the advisors for them to be responsible of. Responsible advisors see the tours that occur on the day they are assigned to.
  - Fair invitation requests can be viewed, accepted and rejected. 
  - Accepted Fairs are made available for Guide assignment. Since it is an important issue, Coordinator manually assigns Guides to the fair. The fair can be seen from the Guide's Dashboard.
  - Work Hours of Users can be viewed to make the necessary payments.
  - User registration requests can be accepted or new users can be added.
  - A Data panel can be accessed which displays the results of the surveys and the average scores of the Guides

- **Admin**:
  - Admin can list all coordinators and add a coordinator to the system. This is the main supervisor of the BTO System.
  - They have all the functionality of the other users.

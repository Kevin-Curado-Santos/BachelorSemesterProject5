# Bachelor Semester Project 5
@Author: Kevin Santos

## Usage
To run the project, follow these steps:
    1. clone the git repo
    2. Open the terminal and navigate to the project directory.
    3. Run the command `docker compose up --build` to build and start the Docker containers.
    4. Access the application via your web browser at `http://localhost`.
    5. To stop the application, use `docker compose down` in the terminal.
   
## Project Structure
The project is organized into the following directories:
- `api/`: Contains the backend API code.
- `src/`: Contains the frontend source cod

## Miscellaneous
- When on localhost, one can go to `http://localhost/admin/config` to access the admin configuration page.
- A password for the admin is asked, which for now is hardcoded as `admin123`. (Future versions will allow changing this password.)
- The database is prepopulated with some sample data, including images in the `celeb` and `landscapes` domains.
- The number of rounds per domain can be configured in the admin config page.
- After a user has done the survey, their data is stored in a csv file at `api/data/user_char/`. Also their audio is saved in `api/data/audio/` and the images that were used during the study and the selected image are saved in `api/data/round_logs/` (currently only works for images).
- Currently both microphone and text input feedback modes are supported.

### POST /habits - create a habit
Request: {"name": "Read 20 pages", "description":"Before bed"}
Response: 201 {"id":1,"name": "Read 20 pages", "description":"Before bed","createdAt":"Date.now()"} 
Errors: 400 Validation error-name missing, empty, or over 100 characters.


### GET /habits - List all the habits
Reqeust : /habits
Reponse : { {id:,name:,description:,createdAt:}... }
Errors: Unable to get habits

### GET /habits/:id - Get information of the habit id
Request : :id
Response: {id:,name:,description:,createdAt:}
Errors: 404 Habit not found , 400 validation error: Not a valid habit id

### PUT /habits/:id - Update a a particular habit id
Request: :id and Body: {"name":"x","description":"y"}
Response:{id:,name:,description:,createdAt:};
Errors: 404 Habit not found, 400 Validation error, missing, empty, or over 100 characters for name

### DELETE /habts/:id - Delete a particular habit id
Request : :id
Response: {id:,name:,description:,createdAt:}
Errors: 404 Habit not found , 400 validation error: Not a valid habit id

### POST /habits/:id/checkin- records a habit was done on a date/ With 1 habit one day
Request: :id 
Response: 200
Errors: 400 Validation error: id is a string, 404 Not a valid habit id

### GET /habits/:id/streak - gets the current streak of a particular habits id and the longest streak
Requst: :id
Response: {"current": "x", longest": "x"}
Errors: 404 habit id doesn't exist, 400 validation error: Not a valid habit id


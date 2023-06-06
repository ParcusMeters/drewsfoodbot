# Drews Food Bot

Drew's food bot is a multipurpose web app.

The Bot leverages Facebook's API webhooks and Heroku virtual servers to run.

The data collected is stored in a AWS RDS database instance.
This database is managed and cleared using AWS Lambda.
Other AWS Lambda functions collect this data, convert it into a csv file, and send it to the necessary email addresses leveraging AWS SES.

The bot gathers critical data on student satisfaction with dining hall menus, provide direct access to "Personal Support Leaders," and enhance communication between administrators' announcements and students.

The bot has been utilized as a pedagogical instrument to teach computer science concepts in the "Introduction to Technology and Programming" seminars for both students and staff at St. Andrew's College.





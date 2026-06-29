# Database Design

Users

* id
* name
* email
* password
* role

Leads

* id
* name
* phone
* email
* source
* status
* assigned\_to
* created\_at

Customers

* id
* lead\_id
* company
* address

FollowUps

* id
* lead\_id
* follow\_up\_date
* remarks
* status

Tasks

* id
* title
* assigned\_to
* due\_date
* status


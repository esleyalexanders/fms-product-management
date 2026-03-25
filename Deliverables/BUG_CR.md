List of Feedback:
From 13/03 ~ 23/03


EFFORT RANGE:
Minor: under 3 Man-day days
Medium: from 4 to 10 Man-day days
Major: over 10 Man-day days

[BUG LIST]
PRICEBOOK ITEMS
* [BUG] Need to be able to do cents for the products
Status: Deployed on PROD
Spec: Round price up to 2 decimal. Example: 25 dollars and 10 cents → 25.10 dollar
Expected effort: Minor

JOB MANAGEMENT
* [BUG] Pick wrong sessions to link while convert to jobs on the calendar view
Status: Fixed on PROD   
Spec: Allow to show up franchisee information on preview and email. 
Expected effort: Medium

SCHEDULE CALENDAR & SESSIONS
* [BUG] Filtering system have not working
Status: Deployed on PROD
Spec: Allow users to filter by staff name or session information (name, linked pricebook item,...)
Expected effort: Medium

OTHER
* [BUG] SSO on franchise web, tenant site and unit site
Status: Deployed on PROD
Expected effort: Medium

* [BUG] Enrollment slots count for future sessions not working:
Status: Testing, some case need waiting for next week for the cron job to generate sessions slots to test for some case
Expected effort: Minor
II. CHANGE REQUEST LIST
Deployed on PROD
PRICEBOOK
* [CR] For service address, default is same as customer address
Status: Deployed on PROD
Expected effort: Minor

SCHEDULE CALENDAR & SESSIONS
* [CR] Highlight staff information on session cards
Status: Deployed on PROD
Actual effort: Minor

OTHER:
* [CR] Unit lists for Franchise in Super Admin site
Status: Deployed on PROD
Spec: Allow user to view unit lists of a single franchise on Franchise Management screen
Actual effort: Medium

* [Scope] Unit appearance custom features
Status: Deployed on PROD
Spec: On tenant site, allow Franchisor to custom appearance for their franchisee units. 
Actual effort: Medium

Plan to do next phase
PRICEBOOK
* [CR] Need a bigger description for the instructions at the end of the price book item with the photo
Status: To do
Spec: Move description to preview cards and make it bigger
Expected effort: Minor

* [CR] Add tax information in the pricebook item preview
Status: To do
Spec: Add which tax category and calculate total tax number add on for the pricebook price. 
Expected effort: Minor

QUOTE MANAGEMENT
* [CR] Can't add more than one item to the quote for non-subscription
Status: To do
Original spec: Only one service can be chosen for a single quote (work for Subscription and Course), Many products can be chosen for a single quote.
Changed Spec: For course services and products, we can add as many items as we want. But for subscription, only one item can be chosen.
Expected effort: Medium

* [CR] Can't modify quote if it is in non-approved stage
Status: To Do
Original spec: Can not edit if quote is sent, approved or rejected. 
Changed spec: Users can still edit quotes until it’s approved or rejected including draft, sent status. Users can only invoice and convert to a job after quotes are approved.
Expected effort: Medium

* [CR] Deposit before start of quote is not reconciled correctly. Need to be able to put it into non-complete jobs
Status: To do
Changed Spec: Add payment information on the Quote Summary and be able to convert to an incomplete job. Both UI and quote sent to customers.
Expected effort: Medium 

* [CR] If a subscription is chosen you can still change quantity. Remove the option
Status: Done but have not pushed on PROD
Changed spec: For subscription service, > 1 for quantity can not be modified.
Expected effort: Minor 

* [CR] Service date should say start date
Status: Done but have not pushed on PROD
Changed spec: Change wording UI only from “Service date” to “Start date”
Expected effort: Minor

* [CR] Add franchisee logo, address on Invoice, Quote preview and email sent to the end client. 
Status: To do, need to clarify more about account numbers. 
Spec: Allow to show up franchise information on preview and email. 
Expected effort: Medium 

* [CR] Do not change the payment configuration after approve the quote
Status: To do, need to clarify with client
Action: Have to discuss with client but this logic make sense now and try to persuade that no change needed
Expected effort: Medium

INVOICE 
* [CR] Can't put in credit card (Stripe)
Status: To do, need to clarify with client
Spec: Allow franchisee owner to put their credit card in and can change when they need it
Action: Need to clarify if credit card mean Stripe or other type support needed

* [CR] Does not have bank details on invoice
Status: Spec Confirming
Spec: Display bank accounts on invoice preview, email invoice if they choose Cash/Direct deposit/cheque option. Not work for Stripe option.
Expected effort: Medium 

* [CR] Cash should have bank deposit or cheque on the description as well
Status: Done but have not pushed on PROD
Spec: Change wording on UI only for cash option in payment configuration
Expected effort: Minor

JOB MANAGEMENT
* [CR] Job mode for for products only
Status: To do
Spec: Allow user to view product job type on Job Management lists and filter for service and product type of job
Expected effort: Major

* [CR] Record completion for job
Status: To do
Spec: Allow users to mark as complete or other status like cancel, pending,... to product job only. 
Expected effort: Major


SCHEDULE CALENDAR & SESSIONS
* [CR] Needs to be colour coded for future lessons
Status: Done but have not pushed on PROD
Spec: For future lessons, still display color instead of grey color, but it still will be grayer for the user to know. 
Expected effort: Minor

* [CR] Does not show student in the sessions
Status: To do, need to clarify with client
Current state: You can still show students with generated sessions when click on it but do not see them for future sessions.
Expected effort: Major

* [CR] Cant change teacher from Schedule calendar
Status: To do, need to clarify with client
Current state: You can still change the teacher with generated sessions when click on it but do not see them for future sessions.
Expected effort: Major


OTHER:
* [CR] Take exact address using API Google Maps
Status: Spec confirming
Expected effort: Medium~Major

#DevTinder APIs
we will create separate routers for group f apis like below
## ROUTER1:
## authRouter
#(logic of handling below apis will be written inside auth router)
-POST /signup
-POST /login
-POST /logout

## ROUTER2:
## profileRouter
-PATCH /profile/edit (after signing up , you can updateyour profile like add photos, updat gender , age etc but will not edit your email id or pw. we are not allowing user to update those 2)
-GET /profile/view (get my own profile from server i.e viewing the profile)
-PATCH /profile/password (for updating pw if forgotten)

## ROUTER3:
## ConnectionRequestRouter
-POST /request/send/:status/:userId |
 status dynamic it can be accepted or not accepted

-POST /request/review/:status/:requestId

## ROUTER4
## UserRouter
-GET /user/connections
-GET /user/requests
-GET/user/feed (gets you the profile of other users on the platform. )


note:
---------------------------------------------------
for connection request we've diff status
not interested (on left swiping)
interested //a has sent a connection req to b (on right swiping)
accepted //b has accepted the req of a 
rejected // b has rejected the req of a 
----------------------------------------------------
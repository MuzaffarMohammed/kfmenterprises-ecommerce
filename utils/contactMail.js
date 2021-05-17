export const contactMail = (req) =>{
return`<p>Hi Admin,</p>
<p><strong>There is a contact form request from a user</strong></p>
<h3>Contact Details</h3>
<p>Name:&nbsp;${req.body.userName}</p>
<p>Email: ${req.body.email}</p>
<p>Phone:${req.body.phoneNumber}</p>
<h3>Message</h3>
<p>&nbsp;${req.body.message}</p>`;}
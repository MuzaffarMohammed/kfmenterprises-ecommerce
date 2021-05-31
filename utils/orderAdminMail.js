export const orderAdminMail = (req) =>{
return`<p>Hi Admin,</p>
<p><strong>There is an order placed from a user.</strong></p>
<table style="height: 127px; width: 90%; border: none;">
<tbody>
<tr style="height: 21px;">
<td style="width: 594px; height: 43px; background: black; color: white; text-align: left;"><strong>&nbsp;KFM Cart</strong></td>
</tr>
<tr style="height: 20px;">
<td style="width: 594px; height: 10px; text-align: center;">
<p></p>
<p></p>
<p>ORDER ID: <span style="color: #3366ff;">${req.body.orderId}</span></p>
</td>
</tr>
<tr style="height: 21px;">
<td style="width: 594px; height: 25px; background: black; color: white; text-align: left;">&nbsp; &nbsp;Order Details</td>
</tr>
<tr style="height: 21px;">
<td style="width: 594px; text-align: left; height: 21px;">
<table style="border: 1px solid #ccc; width: 95%; height: 174px; margin: 15px;">
<tbody>
<tr style="height: 41px;">
<td style="width: 20%; text-align: right; height: 41px;">Order Details URL : </td>
<td style="width: 80%; height: 41px;">&nbsp;<a href="${req.body.orderUrl}" target="_blank" rel="noopener"> Order URL (Click to navigate to order detail page)</a></td>
</tr>
<tr style="height: 21px;">
<td style="width: 20%; height: 21px; text-align: right;">Customer Name : </td>
<td style="width: 80%; height: 21px;">&nbsp;${req.body.userName}</td>
</tr>
<tr style="height: 21px;">
<td style="width: 20%; height: 21px; text-align: right;">Customer Mobile : </td>
<td style="width: 80%; height: 21px;">&nbsp;${req.body.mobile}</td>
</tr>
<tr style="height: 21px;">
<td style="width: 20%; height: 21px; text-align: right;">Customer Email : </td>
<td style="width: 80%; height: 21px;">&nbsp;<a href="mailto:muzaffarmohammed43@gmail.com">${req.body.cusEmail}</a>&nbsp;</td>
</tr>
<tr style="height: 70px;">
<td style="width: 20%; height: 70px; text-align: right;">Customer Address : </td>
<td style="width: 80%; height: 70px;">&nbsp;${req.body.address}.</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height: 28px;">
<td style="width: 594px; text-align: left; background: black; height: 28px;"></td>
</tr>
</tbody>
</table>`;}
export const orderConfirmationMail = (req) =>{
return`<p>Hi ${req.body.userName},</p>
<p><span style="color: #008000;"><strong>Your order has been accepted by the seller. </strong></span></p>
<table style="height: 127px; width: 90%; border: none;">
<tbody>
<tr style="height: 21px;">
<td style="width: 594px; height: 43px; background: black; color: white; text-align: left;"><strong>&nbsp;KFM Cart</strong></td>
</tr>
<tr style="height: 21px;">
<td style="width: 594px; height: 10px; text-align: center;">
<p></p>
<p><strong>Order Status: </strong><em><span style="color: #99cc00;"><span style="color: #339966;">Packaging started,</span> <span style="color: #ff6600;">shipment will be initiated soon.</span></span></em></p>
<p></p>
</td>
</tr>
<tr style="height: 21px;">
<td style="width: 594px; height: 25px; background: black; color: white; text-align: left;">&nbsp; &nbsp;Track your order</td>
</tr>
<tr style="height: 21px;">
<td style="width: 594px; text-align: left; height: 21px;">
<table style="border: 1px solid #cccccc; width: 95%; height: 10px; margin: 15px;">
<tbody>
<tr style="height: 41px;">
<td style="width: 23.1075%; height: 10px; text-align: right;">&nbsp;Order Details URL:</td>
<td style="width: 86.0762%; height: 10px;">&nbsp;<a href="${req.body.orderUrl}" target="_blank" rel="noopener"><input type="button" value="View Order" style="background-color: black; color: white; font-weight: bold; text-align: center; border-radius:5px;"/></a></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr style="height: 28px;">
<td style="width: 594px; text-align: left; background: black; height: 28px;"></td>
</tr>
</tbody>
</table>`;
}

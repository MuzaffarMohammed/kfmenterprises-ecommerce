export const orderDeliveredMail = (req) => {
    return ` <div style="width: 100%!important; height: 100%!important; margin: 0; padding: 0;">
<table id="m_-6678617953402007639m_-4412197490498174029OutlookWrapper" style="width: 100%; border-collapse: collapse!important; text-align: left;">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif;" align="center">
<table id="m_-6678617953402007639m_-4412197490498174029EmailWrapper" dir="ltr" style="width: 100%!important; border-collapse: collapse!important; text-align: left;">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif;" align="center">
<table style="width: 427px; background-color: #fafafa; text-align: left; height: 381px; border-collapse: collapse !important;">
<tbody>
<tr style="height: 358px;">
<td style="font-family: Arial, sans-serif; padding: 23px 18px 21px 17px; width: 399px; height: 381px; border-collapse: collapse !important;">
<table style="margin-bottom: 20px; width: 100%; min-width: 338px; border-collapse: collapse!important; text-align: left;">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif;" align="center"><a href="https://www.kfmcart.com" target="_blank" rel="noopener"><img class="CToWUd" style="width: 130px;" title="www.kfmcart.com" src="https://res.cloudinary.com/kfmcartproducts/image/upload/v1628853272/kfmlogo.png" alt="www.kfmcart.com" width="130" border="0" /></a></td>
</tr>
</tbody>
</table>
<table style="background-color: #ffffff; border-left: 1px solid #d6d6d6; border-right: 1px solid #d6d6d6; border-bottom: 1px solid #d6d6d6; border-top: 2px solid #cecece; border-collapse: collapse!important; text-align: left;">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif; padding: 25px 23px 33px 23px;">
<table style="font-size: 20px; line-height: 24px; color: #002e36; margin-bottom: 18px; border-collapse: collapse!important; text-align: left;">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif;">Hi ${req.body.userName},</td>
</tr>
</tbody>
</table>
<table style="font-size: 18px; line-height: 24px; color: #002e36; text-align: left; border-collapse: collapse !important; width: 237px;">
<tbody>
<tr>
<td style="padding-bottom: 18px; font-family: Arial, sans-serif; border-collapse: collapse !important; width: 233px;">Your package has been delivered!</td>
</tr>
</tbody>
</table>
<div style="font-size: 18px;">&nbsp;</div>
<table style="text-align: left; height: 32px; width: 163px; border-collapse: collapse !important;" width="157">
<tbody>
<tr>
<td style="border-collapse: collapse!important; font-family: Arial,sans-serif;"><span style="font-size: 11px; line-height: 15px; color: #868686;">Order Id # <a style="text-decoration: none; font-size: 11px; line-height: 15px; color: #868686; display: inline-block;" href="${req.body.orderUrl}">${req.body.orderId}</a>.</span></td>
</tr>
</tbody>
</table>
<table style="font-size: 9px; line-height: 15px; color: #868686; text-align: left; border-collapse: collapse !important; height: 59px;" width="351">
<tbody>
<tr>
<td style="font-family: Arial, sans-serif; border-collapse: collapse !important; width: 347px;"><span style="font-size: 11px; line-height: 15px; color: #868686;">This email was sent from an email address that can't receive emails. Please don't reply to this email.</span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>`;
}
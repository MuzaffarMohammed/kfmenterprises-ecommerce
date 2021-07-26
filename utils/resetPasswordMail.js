export const restPasswordMail = (req) =>{
// const mailTrigTime = req.body.mailTrigtimeStamp;
// console.log("Mail Trig Time :"+ mailTrigTime);
    return `<p>Hi ${req.body.userName},</p>
    <p><span style="color: #000000;">&nbsp;You recently requested to reset your password for your KFM Cart account. Use the button below to reset it. <br><strong>This password reset is only valid for the next 20 Minutes. </strong></span></p>
    <table style="height: 127px; width: 90%; border: none;">
    <tbody>
    <tr style="height: 21px;">
    <td style="width: 99.1342%; height: 43px; background: black; color: white; text-align: left;"><strong>&nbsp;KFM Cart</strong></td>
    </tr>
    <tr style="height: 21px;">
    <td style="width: 99.1342%; text-align: left; height: 21px;">
    <table style="border: 1px solid #cccccc; width: 95%; height: 10px; margin: 15px;">
    <tbody>
    <tr style="height: 41px;">
    <td style="width: 23.1075%; height: 10px; text-align: right;">&nbsp;Proceed Reset Password:</td>
    <td style="width: 86.0762%; height: 10px;">&nbsp;<a href="${req.body.forgotPasswordUrl}" target="_blank" rel="noopener"><input type="button" value="Change Password" style="width: 20%; height: 30px; background-color: black; color: white; font-weight: bold; text-align: center; border-radius:5px;"/></a></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr style="height: 28px;">
    <td style="width: 99.1342%; text-align: left; background: black; height: 28px;">&nbsp;</td>
    </tr>
    </tbody>
    </table>
    <p>For security, this request was received from a {{operating_system}} device using {{browser_name}}. If you did not request a password reset, please ignore this email or&nbsp;<a href="https://www.kfmcart.com/contactus">contact support</a>&nbsp;if you have questions.</p><p>Thanks,<br />The KFM Cart Team</p>`;
}
export const orderMail = (req) =>{

    return `<table style="height: 389px; width: 60%; border: none;">
    <tbody>
    <tr style="height: 17px;">
    <td style="width: 100%; height: 17px; background-color: #00d27f;">&nbsp;</td>
    </tr>
    <tr style="height: 94px;">
    <td style="width: 100%; height: 94px;" align="left">
    <p><strong>Dear ${req.body.userName},</strong></p>
    <p style="font-size: 12px;">Thank you for shopping with us. We would like to let you know that we have received your order:</p>
    </td>
    </tr>
    <tr style="height: 44px;">
    <td style="width: 100%; height: 44px; background-color: #ccf6e5; color: #009358; font-weight: bold; text-align: center;">ORDER DETAILS</td>
    </tr>
    <tr style="height: 234px;">
    <td style="width: 100%; height: 234px;">
    <table style="border: 1px solid #cccccc; width: 100.161%; height: 79px;">
    <tbody>
    <tr style="height: 34px; border: 1px Solid #ccc;">
    <td style="text-align: center; height: 34px; font-size: 11px; border: 1px solid #cccccc; width: 30%;">ORDER ID</td>
    <td style="text-align: center; height: 34px; font-size: 11px; border: 1px solid #cccccc; width: 10%;">
    <p>ORDER DATE</p>
    </td>
    <td style="text-align: center; height: 34px; font-size: 11px; border: 1px solid #cccccc; width: 50.2012%;">SHIPPING ADDRESS</td>
    </tr>
    <tr style="height: 45px;">
    <td style="width: 30%; height: 45px; border: 1px solid #cccccc;">
    <blockquote>
    <p class="text-break" style="text-align: center; color: #009358; font-size: 13px;">${req.body.orderId}</p>
    </blockquote>
    </td>
    <td style="width: 10%; text-align: center; height: 45px; font-size: 11px; border: 1px solid #cccccc;">${req.body.orderDate}</td>
    <td style="width: 50.2012%; height: 45px; font-size: 12px; text-align: center; border: 1px solid #cccccc;">${req.body.userName},<br />${req.body.address}</td>
    </tr>
    </tbody>
    </table>
    <p style="text-align: center;"><strong>SHIPPING DETAILS</strong></p>
    <table style="border-collapse: collapse; width: 100%; height: 68px;" border="1">
    <tbody>
    <tr style="height: 17px;">
    <td style="width: 15%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">Name</td>
    <td style="width: 84.4064%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">&nbsp;${req.body.userName}</td>
    </tr>
    <tr style="height: 17px;">
    <td style="width: 15%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">Email</td>
    <td style="width: 84.4064%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">&nbsp;${req.body.email}</td>
    </tr>
    <tr style="height: 17px;">
    <td style="width: 15%; font-size: 11px; border: 1px solid #cccccc; height: 17px;">Address</td>
    <td style="width: 84.4064%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">&nbsp;${req.body.address}</td>
    </tr>
    <tr style="height: 17px;">
    <td style="width: 15%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">Mobile</td>
    <td style="width: 84%; height: 17px; font-size: 11px; border: 1px solid #cccccc;">&nbsp;${req.body.mobile}</td>
    </tr>
    </tbody>
    </table>
    <p style="font-size: 10px;"><br />In case you have further queries, please feel free to reach out to us on&nbsp; +91 8247732147 &nbsp;or mail us at&nbsp;<a href="mailto:kfmcart@gmail.com" target="_blank" rel="noopener">kfmcart@gmail.<wbr />com</a>.</p>
    <p style="font-size: 10px;">&nbsp;</p>
    <p style="font-size: 10px;">Warm Regards,</p>
    <p style="font-size: 10px;"><strong>Team KFM Cart</strong></p>
    <table style="border-collapse: collapse; width: 100%; height: 17px;" border="1">
    <tbody>
    <tr style="height: 17px;">
    <td style="width: 100%; height: 17px; font-size: 10px; background-color: #00d27f; color: white;">&copy; 2021. All Right Reserved @KFM Cart</td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>`;
}
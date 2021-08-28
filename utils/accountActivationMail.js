export const accountActivationMail = (req) =>{

    return `
    <h3> Hello ${req.body.userName} </h3>
    <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
    <p>To activate your account please click this button: <a target="_" href="${process.env.NEXT_PUBLIC_BASE_URL}/api/user/accountActivation/${req.body.id}"><input type="button" value="Activate" style="background-color: black; color: white; font-weight: bold; text-align: center; border-radius:5px;"/></a></p>
    </br>
    <h3>Happy Shopping</h3>
    </br>
    <p>Cheers</p>
    <p>KFM Cart Team</p>
`;
}
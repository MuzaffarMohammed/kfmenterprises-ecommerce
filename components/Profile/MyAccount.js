import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../store/GlobalState'
import { valid } from '../../utils/valid'
import { patchData } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { renameFile } from '../../utils/util'
import { isLoggedInPopup } from '../SignIn/SignInCardFunctionalComponent'
import { INVALID_LOGIN } from '../../utils/constants'

const MyAccount = () => {

    const initialSate = {
        avatar: '',
        name: '',
        password: '',
        cf_password: ''
    }
    const [data, setData] = useState(initialSate)
    const { avatar, name, password, cf_password } = data

    const { state, dispatch } = useContext(DataContext)
    const { auth, notify } = state

    useEffect(() => {
        if (auth.user) setData({ ...data, name: auth.user.name })
    }, [auth.user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault();
        if (password || name !== auth.user.name || avatar) {
            const cb = (auth) => {
                if (!auth.user) return dispatch({ type: 'NOTIFY', payload: { error: INVALID_LOGIN } })
                if (password) {
                    const errMsg = valid(name, auth.user.email, password, cf_password)
                    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg , delay: 10000} })
                    updatePassword()
                }
                if (name !== auth.user.name || avatar) updateInfor()
            }
            isLoggedInPopup(undefined, dispatch, cb);
        }else return dispatch({ type: 'NOTIFY', payload: { success: 'No change made.' } })
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        patchData('user/resetPassword', { password }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err , delay: 10000} })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        if (!file)
            return dispatch({ type: 'NOTIFY', payload: { error: 'File does not exist!' } })

        if (file.size > 1024 * 1024) //1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'Image size should be less than 1MB!' } })

        if (file.type !== "image/jpeg" && file.type !== "image/png") //1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'Incorrect Image format! Please upload "jpeg/jpg/png" formats.' } })
        const fileExtn = file.name.split('.').pop();
        const renamedfile = renameFile(file, auth.user.name + '.' + fileExtn);
        setData({ ...data, avatar: renamedfile })
    }

    const updateInfor = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        try {
            if (avatar) media = await imageUpload([avatar], 'profile', auth.token)
            if (media && (media.length <= 0 || media[0].url === undefined)) return dispatch({ type: 'NOTIFY', payload: { error: 'Image upload failed! Please try again.' } })
            patchData('user', {
                name, avatar: avatar ? media[0].url : auth.user.avatar
            }, auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                dispatch({
                    type: 'AUTH', payload: {
                        token: auth.token,
                        user: res.user
                    }
                })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
        } catch (err) {
            dispatch({ type: 'NOTIFY', payload: { loading: false } })
            dispatch({ type: 'NOTIFY', payload: { error: err.message } })
        }
    }

    if (!auth.user) return null;

    return (
        <div className="text-secondary my-3 mx-1">
            <div className="userProfileCol">
                <h3 className="text-center text-uppercase">
                    {auth.user.role === 'user' ? 'My Account' : 'Admin Profile'}
                </h3>

                <div className="avatar">
                    <img src={(avatar ? URL.createObjectURL(avatar) : auth.user.avatar)}
                        alt="avatar" />
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up"
                            accept="image/*" onChange={changeAvatar} />
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="name">User Name</label>
                    <input type="text" name="name" value={name} className="form-control"
                        placeholder="Your name" onChange={handleChange} maxLength='100' />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" defaultValue={auth.user.email}
                        className="form-control" disabled={true} maxLength='100' />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" value={password} className="form-control"
                        placeholder="Your new password" onChange={handleChange} maxLength='64' />
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm New Password</label>
                    <input type="password" name="cf_password" value={cf_password} className="form-control"
                        placeholder="Confirm new password" onChange={handleChange} maxLength='64' />
                </div>

                <button className="btn btn-primary w-100 signBtn" disabled={notify.loading}
                    onClick={handleUpdateProfile}>
                    Update
                </button>
            </div>
        </div>
    );
}

export default MyAccount;
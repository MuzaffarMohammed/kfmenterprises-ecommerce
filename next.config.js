let env = {
    "BASE_URL": "http://localhost:3000",
    "MONGODB_URL": "mongodb+srv://admin:admin123@kfmdatacluster.k12wf.mongodb.net/kfmData?retryWrites=true&w=majority",
    "ACCESS_TOKEN_SECRET": "*C837NzAgSbc5$Xg-S#b?!fV@vs*R6GdF4Ny",
    "REFRESH_TOKEN_SECRET": "EpBc_%qZY&CuX+7-q%9V!MR47xhFLW@Fk$3W",
    "PAYPAL_CLIENT_ID": "YOUR_PAYPAL_CLIENT_ID"
}
if (process.env.NODE_ENV === 'production') {
   env = {}
  }

module.exports = {
    env:env
}